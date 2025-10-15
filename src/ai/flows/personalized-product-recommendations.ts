'use server';
/**
 * @fileOverview An AI agent that provides personalized product recommendations based on user purchase history and browsing behavior.
 *
 * - getPersonalizedRecommendations - A function that retrieves personalized product recommendations for a given user.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  userId: z.string().describe('The ID of the user for whom to generate recommendations.'),
  purchaseHistory: z.array(z.string()).describe('An array of product IDs representing the user\'s purchase history.'),
  browsingHistory: z.array(z.string()).describe('An array of product IDs representing the user\'s browsing history.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendedProducts: z.array(z.string()).describe('An array of product IDs representing the personalized product recommendations.'),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function getPersonalizedRecommendations(input: PersonalizedRecommendationsInput): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are an expert recommendation system for a grocery store.

  Based on the user's purchase history and browsing behavior, you will recommend products that they might be interested in.

  Purchase History: {{#if purchaseHistory}}{{#each purchaseHistory}}- {{{this}}}\n{{/each}}{{else}}No purchase history{{/if}}
  Browsing History: {{#if browsingHistory}}{{#each browsingHistory}}- {{{this}}}\n{{/each}}{{else}}No browsing history{{/if}}

  Recommend a list of product IDs that the user might be interested in.  Return ONLY the product IDs in a JSON array.
  Do not include any other text or explanation.
  `,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
