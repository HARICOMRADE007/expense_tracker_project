import { supabase } from '../lib/supabase';
import { Expense } from '../types/expense';

export const expenseService = {
    async getAll() {
        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('expenses')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;

            return data?.map(item => ({
                ...item,
                // Ensure amount is number
                amount: Number(item.amount),
                // Convert timestamp to date string format used in app (YYYY-MM-DD or similar)
                date: new Date(item.date).toISOString().split('T')[0]
            })) as Expense[] || [];
        } catch (error) {
            console.error('Error fetching expenses:', error);
            return [];
        }
    },

    async add(expense: Expense) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('expenses')
                .insert([{
                    // Omit ID to let Supabase generate it, or use the one we processed if needed
                    user_id: user.id,
                    amount: expense.amount,
                    category: expense.category,
                    date: expense.date,
                    note: expense.note
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error adding expense:', error);
            return null;
        }
    },

    async delete(id: string) {
        try {
            const { error } = await supabase
                .from('expenses')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting expense:', error);
            return false;
        }
    }
};
