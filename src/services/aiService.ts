import { Expense } from '../types/expense';

const fetchAvailableModels = async (apiKey: string): Promise<string> => {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!response.ok) return 'gemini-1.5-flash';

        const data = await response.json();

        // Filter for generation models
        const validModels = data.models?.filter((m: any) =>
            m.supportedGenerationMethods?.includes('generateContent') &&
            (m.name.includes('gemini-1.5') || m.name.includes('gemini-pro') || m.name.includes('gemini-1.0'))
        );

        if (!validModels || validModels.length === 0) return 'gemini-1.5-flash';

        // Sort: Prefer "flash" first, then "pro"
        // This ensures High Speed & Low Cost models are picked over heavy quota models
        validModels.sort((a: any, b: any) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            if (aName.includes('flash') && !bName.includes('flash')) return -1;
            if (!aName.includes('flash') && bName.includes('flash')) return 1;
            return 0;
        });

        // Return the first one (highest priority)
        return validModels[0].name.replace('models/', '');
    } catch (e) {
        console.warn('Failed to fetch models list, using default', e);
        return 'gemini-1.5-flash';
    }
};

export const chatWithAdvisor = async (message: string, expenses: Expense[], apiKey: string) => {
    if (!apiKey) throw new Error('API Key is missing');

    const summary = expenses
        .slice(0, 20) // Reduced from 50 to 20 to save tokens and avoid Rate Limits
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

            // Handle Rate Limits specially
            if (response.status === 429) {
                throw new Error('Usage limit exceeded. Please wait 1 minute before trying again.');
            }

            throw new Error(err.error?.message || 'Failed to fetch response');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error: any) {
        console.error('AI Chat Error:', error);
        throw new Error(error.message || 'Failed to communicate with Advisor');
    }
};
