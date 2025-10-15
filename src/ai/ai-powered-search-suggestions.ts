'use server';

/**
 * @fileOverview Provides AI-powered search suggestions based on user input.
 *
 * - getSearchSuggestions - A function that returns search suggestions based on the input query.
 * - SearchSuggestionsInput - The input type for the getSearchSuggestions function.
 * - SearchSuggestionsOutput - The return type for the getSearchSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SearchSuggestionsInputSchema = z.object({
  query: z.string().describe('The user query to generate search suggestions for.'),
});
export type SearchSuggestionsInput = z.infer<typeof SearchSuggestionsInputSchema>;

const SearchSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of search suggestions.'),
});
export type SearchSuggestionsOutput = z.infer<typeof SearchSuggestionsOutputSchema>;

export async function getSearchSuggestions(input: SearchSuggestionsInput): Promise<SearchSuggestionsOutput> {
  return searchSuggestionsFlow(input);
}

const searchSuggestionsPrompt = ai.definePrompt({
  name: 'searchSuggestionsPrompt',
  input: {schema: SearchSuggestionsInputSchema},
  output: {schema: SearchSuggestionsOutputSchema},
  prompt: `You are an AI assistant that provides search suggestions for an e-commerce website selling groceries.

  Generate an array of search suggestions based on the user's query. The suggestions should be relevant to groceries and related products.

  User Query: {{{query}}}

  Suggestions:`,
});

const searchSuggestionsFlow = ai.defineFlow(
  {
    name: 'searchSuggestionsFlow',
    inputSchema: SearchSuggestionsInputSchema,
    outputSchema: SearchSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await searchSuggestionsPrompt(input);
    return output!;
  }
);
