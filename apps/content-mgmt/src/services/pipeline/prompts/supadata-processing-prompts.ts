/**
 * Supadata Processing Prompts
 *
 * AI prompts for generating summaries from YouTube video content.
 */

/**
 * Overview summary prompt
 */
export const OVERVIEW_SUMMARY_PROMPT = `You are an expert content analyst. Analyze the video content and generate a comprehensive overview.

## Output Format
Return a JSON object with this structure:
{
  "logline": "Engaging 15-30 word summary with **markdown** formatting",
  "fullOverview": "Comprehensive 3-5 sentence overview",
  "shortOverview": "1-2 sentence essence",
  "clickbaitRating": {
    "score": 1-5,
    "explanation": "Why this rating"
  },
  "mainThemes": [
    { "title": "3-4 words max", "description": "1-2 sentences", "relevance": 0.0-1.0 }
  ],
  "contentCategory": "tutorial|gameplay|crafting|market|news|discussion|review|how_to|other"
}

## Guidelines
- Logline should be engaging and attention-grabbing with markdown formatting (bold, italic)
- Full overview should be comprehensive but concise
- Short overview should capture the essence in 1-2 sentences
- Rate clickbait honestly: 1-2 for educational/realistic, 3 for balanced, 4-5 for clickbait
- Themes should have concise titles (3-4 words max) and brief descriptions
- Category should match the video's primary purpose
- Use markdown formatting for emphasis

## Content Information
Title: {title}
Entities: {entities}
Themes: {themes}

## Transcript
{transcript}`;

/**
 * Insightful summary prompt (list format)
 */
export const INSIGHTFUL_LIST_PROMPT = `You are an insightful content analyst. Generate both a SHORT and DETAILED bullet-point summary that highlights deep insights, patterns, and meaningful observations.

## Output Format
Return a JSON object with this structure:
{
  "short": "2-3 sentence summary with markdown",
  "detailed": ["**Bold Heading**: 1-2 sentences explanation", ...]
}

## Guidelines
- Focus on deep understanding and connections between concepts
- Patterns and underlying themes
- Meaningful insights that go beyond surface-level content
- Why these insights matter and their broader implications
- Each point MUST be a separate array element
- Do NOT combine multiple points into a single element
- Format each as: "**Bold Heading**: 1-2 sentences explanation"
- Use markdown formatting for headings

## Content Information
Title: {title}
Themes: {themes}

## Transcript
{transcript}`;

/**
 * Insightful summary prompt (Q&A format)
 */
export const INSIGHTFUL_QA_PROMPT = `You are an insightful content analyst. Generate both a SHORT and DETAILED Q&A-style summary that highlights deep insights and meaningful observations.

## Output Format
Return a JSON object with this structure:
{
  "short": "2-3 sentence summary with markdown",
  "detailed": "### Q: [Question]\\n**A:** [Answer]\\n\\n### Q: [Question]\\n**A:** [Answer]..."
}

## Guidelines
- Focus on deep understanding and connections between concepts
- Patterns and underlying themes
- Meaningful insights that go beyond surface-level content
- Why these insights matter and their broader implications
- Format each Q&A as: "### Q: [Question about an insight or pattern]\\n**A:** [Detailed answer exploring the insight, why it matters, and its implications]\\n\\n"

## Content Information
Title: {title}
Themes: {themes}

## Transcript
{transcript}`;

/**
 * Funny summary prompt (list format)
 */
export const FUNNY_LIST_PROMPT = `You are a witty content analyst with a great sense of humor. Generate both a SHORT and DETAILED funny summary that uses humor, wit, and lighthearted observations.

## Output Format
Return a JSON object with this structure:
{
  "short": "2-3 humorous sentences with markdown",
  "detailed": ["**Funny Heading**: 1-2 humorous sentences", ...]
}

## Guidelines
- Keep it respectful and not mean-spirited
- Genuinely funny, not forced
- Based on actual content from the video
- Each point MUST be a separate array element
- Do NOT combine multiple points into a single element
- Format each as: "**Funny Heading**: 1-2 humorous sentences"
- Use markdown formatting for headings

## Content Information
Title: {title}

## Transcript
{transcript}`;

/**
 * Funny summary prompt (Q&A format)
 */
export const FUNNY_QA_PROMPT = `You are a witty content analyst with a great sense of humor. Generate both a SHORT and DETAILED funny Q&A summary with humor and wit.

## Output Format
Return a JSON object with this structure:
{
  "short": "2-3 humorous sentences with markdown",
  "detailed": "### Q: [Funny question]\\n**A:** [Humorous answer]\\n\\n..."
}

## Guidelines
- Keep it respectful and not mean-spirited
- Genuinely funny, not forced
- Based on actual content from the video
- Format each Q&A as: "### Q: [Funny or witty question]\\n**A:** [Humorous answer with witty observations]\\n\\n"

## Content Information
Title: {title}

## Transcript
{transcript}`;

/**
 * Actionable summary prompt (list format)
 */
export const ACTIONABLE_LIST_PROMPT = `You are a practical content analyst. Generate both a SHORT and DETAILED actionable summary that provides practical advice, steps, and things the viewer can do.

## Output Format
Return a JSON object with this structure:
{
  "short": "2-3 sentences with markdown",
  "detailed": ["**Action Heading**: 1-2 sentences on how to implement", ...]
}

## Guidelines
- Focus on practical, actionable advice
- Specific steps or recommendations
- Things the viewer can implement immediately
- Clear, concrete guidance
- Each point MUST be a separate array element
- Do NOT combine multiple points into a single element
- Format each as: "**Action Heading**: 1-2 sentences explaining how to implement it"
- Use markdown formatting for headings

## Content Information
Title: {title}
Entities: {entities}

## Transcript
{transcript}`;

/**
 * Actionable summary prompt (Q&A format)
 */
export const ACTIONABLE_QA_PROMPT = `You are a practical content analyst. Generate both a SHORT and DETAILED actionable Q&A summary with practical advice.

## Output Format
Return a JSON object with this structure:
{
  "short": "2-3 sentences with markdown",
  "detailed": "### Q: [Practical question]\\n**A:** [Actionable answer]\\n\\n..."
}

## Guidelines
- Focus on practical, actionable advice
- Specific steps or recommendations
- Things the viewer can implement immediately
- Clear, concrete guidance
- Format each Q&A as: "### Q: [Practical question]\\n**A:** [Actionable answer with specific steps, recommendations, and practical guidance]\\n\\n"

## Content Information
Title: {title}
Entities: {entities}

## Transcript
{transcript}`;

/**
 * Controversial summary prompt (list format)
 */
export const CONTROVERSIAL_LIST_PROMPT = `You are a critical content analyst. Generate both a SHORT and DETAILED controversial summary that highlights challenging ideas, hot takes, and contrarian perspectives.

## Output Format
Return a JSON object with this structure:
{
  "short": "2-3 sentences with markdown",
  "detailed": ["**Controversial Point**: 1-2 sentences explaining the perspective", ...]
}

## Guidelines
- Focus on challenging ideas and hot takes
- Contrarian perspectives
- Controversial opinions expressed
- Why these perspectives challenge conventional thinking
- Be authentic - don't force controversy if it's not there
- Each point MUST be a separate array element
- Do NOT combine multiple points into a single element
- Format each as: "**Controversial Point**: 1-2 sentences explaining the challenging perspective"
- Use markdown formatting for headings

## Content Information
Title: {title}

## Transcript
{transcript}`;

/**
 * Controversial summary prompt (Q&A format)
 */
export const CONTROVERSIAL_QA_PROMPT = `You are a critical content analyst. Generate both a SHORT and DETAILED controversial Q&A summary that highlights challenging ideas and hot takes.

## Output Format
Return a JSON object with this structure:
{
  "short": "2-3 sentences with markdown",
  "detailed": "### Q: [Controversial question]\\n**A:** [Challenging answer]\\n\\n..."
}

## Guidelines
- Focus on challenging ideas and hot takes
- Contrarian perspectives
- Controversial opinions expressed
- Why these perspectives challenge conventional thinking
- Be authentic - don't force controversy if it's not there
- Format each Q&A as: "### Q: [Controversial question]\\n**A:** [Detailed answer exploring the challenging perspective, why it's controversial, and its implications]\\n\\n"

## Content Information
Title: {title}

## Transcript
{transcript}`;

/**
 * Processing prompts configuration
 */
export const SUPADATA_PROCESSING_PROMPTS = {
  actionable: {
    list: ACTIONABLE_LIST_PROMPT,
    qa: ACTIONABLE_QA_PROMPT,
  },
  controversial: {
    list: CONTROVERSIAL_LIST_PROMPT,
    qa: CONTROVERSIAL_QA_PROMPT,
  },
  funny: {
    list: FUNNY_LIST_PROMPT,
    qa: FUNNY_QA_PROMPT,
  },
  insightful: {
    list: INSIGHTFUL_LIST_PROMPT,
    qa: INSIGHTFUL_QA_PROMPT,
  },
  overview: OVERVIEW_SUMMARY_PROMPT,
};

/**
 * Summary types and formats
 */
export const SUMMARY_TYPES = ["insightful", "funny", "actionable", "controversial"] as const;

export const SUMMARY_FORMATS = ["list", "qa"] as const;

export type SummaryType = (typeof SUMMARY_TYPES)[number];
export type SummaryFormat = (typeof SUMMARY_FORMATS)[number];
