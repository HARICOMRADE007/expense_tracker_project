import { Expense } from '../types/expense';

const fetchAvailableModels = async (apiKey: string): Promise<string> => {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!response.ok) return 'gemini-1.5-flash'; // Fallback if list fails

        const data = await response.json();
        // Find first model that supports generateContent
        const validModel = data.models?.find((m: any) =>
            m.supportedGenerationMethods?.includes('generateContent') &&
            (m.name.includes('gemini-1.5') || m.name.includes('gemini-pro') || m.name.includes('gemini-1.0'))
        );

        return validModel ? validModel.name.replace('models/', '') : 'gemini-1.5-flash';
    } catch (e) {
        console.warn('Failed to fetch models list, using default', e);
        return 'gemini-1.5-flash';
    }
};

export const chatWithAdvisor = async (message: string, expenses: Expense[], apiKey: string) => {
    if (!apiKey) throw new Error('API Key is missing');

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

    try {
        // Dynamically find a working model
        const modelName = await fetchAvailableModels(apiKey);
        console.log(`Using AI Model: ${modelName}`);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
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
            throw new Error(err.error?.message || 'Failed to fetch response');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error: any) {
        console.error('AI Chat Error:', error);
        throw new Error(error.message || 'Failed to communicate with Advisor');
    }
};
