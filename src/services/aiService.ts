import { Expense } from '../types/expense';

export const chatWithAdvisor = async (message: string, expenses: Expense[], apiKey: string) => {
    if (!apiKey) throw new Error('API Key is missing');

    // Prepare a concise summary of expenses for context
    // We limit to recent 50 to avoid token limits, but sort by date descending
    const summary = expenses
        .slice(0, 50)
        .map(e => `${e.date}: ${e.amount} (${e.category}) - ${e.note || ''}`)
        .join('\n');

    const systemPrompt = `
    You are "SpendWise Advisor", a friendly and helpful AI financial assistant.
    Your goal is to help the user understand their spending, save money, and make better financial decisions.
    
    Current User Data (Recent Expenses):
    ${summary}
    
    Instructions:
    1. Answer the user's question based on the data above.
    2. If the data is empty, give general financial advice.
    3. Be concise, encouraging, and easy to understand.
    4. Use emojis occasionally to be friendly.
    5. If asked about "total" or specifics, calculate from the provided data.
  `;

    const models = ['gemini-1.5-flash', 'gemini-pro', 'gemini-1.0-pro'];
    let lastError: any;

    for (const model of models) {
        try {
            console.log(`Attempting to connect with model: ${model}`);
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: systemPrompt + '\n\nUser Question: ' + message }]
                        }
                    ]
                })
            });

            if (!response.ok) {
                const err = await response.json();
                // If it's a 404 (Not Found) or 400 (Bad Request - often model related), continue to next model
                if (response.status === 404 || response.status === 400) {
                    console.warn(`Model ${model} failed, trying next...`, err);
                    lastError = err;
                    continue;
                }
                throw new Error(err.error?.message || 'Failed to fetch response');
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;

        } catch (error: any) {
            console.error(`Error with model ${model}:`, error);
            lastError = error;
            // Only continue if it's a specific "not found" type error we want to retry
            // For now, we try next model on any error to be safe, or we could filter
            continue;
        }
    }

    throw new Error(lastError?.error?.message || lastError?.message || 'All AI models failed. Please check your API Key permissions.');
};
