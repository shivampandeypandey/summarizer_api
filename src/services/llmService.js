const axios = require('axios');
const logger = require('../utils/logger');

const MODEL = 'openai/gpt-3.5-turbo';

/**
 * Calls the OpenRouter LLM API to summarize customer complaint.
 * 
 * @param {string} customerMessage - The free-form customer complaint message.
 * @returns {Promise<Object>} - Structured JSON with summary, category, urgency, sentiment.
 */
const callLLM = async (customerMessage) => {

    if (!customerMessage || typeof customerMessage !== 'string' || customerMessage.trim().length === 0) {
        logger.error('Invalid customerMessage input: must be a non-empty string');
        throw new Error('Invalid input: customerMessage must be a non-empty string');
    }

    const prompt = `
    ### Goal
    You are an expert customer support summarizer bot.
    You analyze customer messages and extract structured information for internal ticketing.
    
    ### Instructions
    1. Read the message carefully, understanding both explicit and implicit meaning.
    2. Be robust to:
        - Polite complaints
        - Aggressive tone / passive-aggressive tone / sarcasm
        - Multi-intent messages (choose MAIN intent for Category)
        - Mixed sentiments (choose dominant sentiment)
        - Vague messages — infer likely category and urgency
        - Positive-only messages and subtle suggestions
    3. Generate:
        - A brief summary of the main issue (1-2 sentences, no longer)
        - Category: Choose one of:
          - "Refund Issue"
          - "Delay"
          - "Account Access"
          - "Other"
        - Urgency: Choose one of:
          - "Low"
          - "Medium"
          - "High"
        - Sentiment: Choose one of:
          - "Positive"
          - "Neutral"
          - "Negative"
    4. If message contains multiple topics:
        - Prioritize the most important/frustrating issue from customer perspective.
        - If unsure, select the first major issue mentioned.
    5. For vague messages, infer as best as possible — but DO NOT hallucinate new categories.
    6. STRICT OUTPUT: Always return only a VALID JSON block with these exact keys:
        - summary
        - category
        - urgency
        - sentiment
    
    ### Few-shot Examples
    
    #### Example 1
    Customer Message: """I’ve been waiting 3 days for my refund and your support hasn’t replied. This is really frustrating."""
    Expected JSON:
    {
      "summary": "Customer is upset due to a delayed refund and lack of support response.",
      "category": "Refund Issue",
      "urgency": "High",
      "sentiment": "Negative"
    }
    
    #### Example 2
    Customer Message: """I tried logging in today but my account seems locked. Can someone please help?"""
    Expected JSON:
    {
      "summary": "Customer is unable to access their account and needs assistance.",
      "category": "Account Access",
      "urgency": "Medium",
      "sentiment": "Neutral"
    }
    
    #### Example 3
    Customer Message: """Great service overall, but delivery took a bit longer than expected."""
    Expected JSON:
    {
      "summary": "Customer is satisfied but mentions a slight delivery delay.",
      "category": "Delay",
      "urgency": "Low",
      "sentiment": "Positive"
    }
    
    #### Example 4
    Customer Message: """Oh wow, your support team is just *fantastic* — 6 emails sent and still no reply. I guess ignoring customers is your new policy? Still waiting on my refund by the way."""
    Expected JSON:
    {
      "summary": "Customer is very upset about lack of support response regarding their refund.",
      "category": "Refund Issue",
      "urgency": "High",
      "sentiment": "Negative"
    }
    
    #### Example 5
    Customer Message: """Your app is generally great and I usually love using it. But this latest update broke the payment system. I can’t process my payment now, and support has been super slow. I expect better from your team!"""
    Expected JSON:
    {
      "summary": "Customer is frustrated about broken payment system and slow support response.",
      "category": "Other",
      "urgency": "High",
      "sentiment": "Negative"
    }
    
    #### Example 6
    Customer Message: """Everything is broken. Nothing works. Please fix it."""
    Expected JSON:
    {
      "summary": "Customer is extremely frustrated and reporting that the system is non-functional.",
      "category": "Other",
      "urgency": "High",
      "sentiment": "Negative"
    }
    
    ### Now process the following message:
    
    Customer Message: """${customerMessage}"""
    
    IMPORTANT: Return the result as strict JSON only. Do not include any extra text.
    `;

    try {
        const response = await axios.post(
            `${process.env.OPENROUTER_API_URL}/chat/completions`, // Use env variable for BASE URL
            {
                model: MODEL,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3,
                max_tokens: 512,
                top_p: 0.9,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        logger.info('OpenRouter LLM response received');

        const llmResponse = response.data.choices[0]?.message?.content;

        if (!llmResponse) {
            throw new Error('Empty response from LLM');
        }

        // Attempt to parse strict JSON response
        const parsed = JSON.parse(llmResponse);

        return parsed;
    } catch (err) {
        const status = err.response?.status || 'No status';
        const data = err.response?.data || 'No data';

        logger.error(`LLM API error: ${err.message}`);
        logger.error(`LLM API status: ${status}`);
        logger.error(`LLM API response data: ${JSON.stringify(data)}`);

        throw new Error('Error communicating with LLM API');
    }
};

module.exports = { callLLM };
