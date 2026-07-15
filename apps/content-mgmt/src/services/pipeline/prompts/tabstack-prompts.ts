/**
 * Tabstack Prompts
 *
 * AI prompts for preprocessing and processing web article content
 * extracted via Tabstack.
 *
 * These prompts are tailored for article content, which differs from
 * video transcripts in structure and analysis approach.
 */

/**
 * Entity extraction prompt for article content
 */
export const ARTICLE_ENTITY_EXTRACTION_PROMPT = `You are an expert content analyst specializing in gaming news and articles. Analyze the following article and extract all relevant entities.

## Instructions
Extract entities in these categories:
- **character**: Game characters, NPCs, bosses, heroes, villains mentioned
- **item**: Weapons, armor, consumables, in-game items mentioned
- **location**: Maps, zones, dungeons, game locations mentioned
- **ability**: Skills, spells, abilities mentioned
- **game_mode**: PvP, PvE, raids, game modes mentioned
- **mechanic**: Game mechanics, systems, features discussed
- **creator**: Content creators, developers, companies mentioned
- **game**: Specific games mentioned
- **other**: Other relevant entities

## Output Format
Return a JSON object with this structure:
{
  "entities": [
    {
      "name": "Entity Name",
      "type": "character|item|location|ability|game_mode|mechanic|creator|game|other",
      "confidence": 0.0-1.0,
      "mentionCount": number,
      "contexts": ["brief context snippet where entity appears"]
    }
  ]
}

## Guidelines
- Only include entities with confidence >= 0.5
- Include up to 3 context snippets per entity
- Focus on game-related entities
- Normalize entity names (capitalize properly, use common names)
- Merge duplicate entities with different spellings
- For articles, pay attention to game titles and developer names

## Article Content
{article_content}`;

/**
 * Theme analysis prompt for article content
 */
export const ARTICLE_THEME_ANALYSIS_PROMPT = `You are an expert content analyst. Analyze the following article and identify the main themes and topics.

## Instructions
Identify 3-7 main themes that capture the essence of the article. Each theme should:
- Have a concise title (3-4 words max)
- Have a brief description (1-2 sentences)
- Be relevant to the gaming/content context

## Output Format
Return a JSON object with this structure:
{
  "themes": [
    {
      "title": "Theme Title",
      "description": "Brief description of the theme",
      "relevance": 0.0-1.0
    }
  ]
}

## Guidelines
- Order themes by relevance (highest first)
- Focus on actionable, informative themes
- Avoid generic themes like "gaming" or "video game"
- Capture unique aspects of the article
- Consider the article's angle (news, opinion, guide, review)

## Article Content
{article_content}`;

/**
 * Content segmentation prompt for article content
 */
export const ARTICLE_SEGMENTATION_PROMPT = `You are an expert content analyst. Analyze the following article and segment it into logical sections.

## Instructions
Divide the article into 3-10 logical segments based on topic changes. For each segment:
- Identify the approximate character offset range
- Provide a brief summary
- List key topics covered
- Note any entities mentioned

## Output Format
Return a JSON object with this structure:
{
  "segments": [
    {
      "index": 0,
      "startOffset": 0,
      "endOffset": 500,
      "summary": "Brief summary of this segment",
      "topics": ["topic1", "topic2"],
      "entityMentions": ["Entity1", "Entity2"]
    }
  ]
}

## Guidelines
- Segments should be at least 200 characters long
- Summaries should be 1-2 sentences
- Topics should be specific, not generic
- Entity mentions should match entities from extraction
- Consider article structure (intro, body, conclusion)

## Article Content
{article_content}`;

/**
 * Game relevance validation prompt for articles
 */
export const ARTICLE_GAME_RELEVANCE_PROMPT = `You are an expert content classifier. Determine if the following article is related to video games, gaming, or game-related topics.

## Instructions
Analyze the article and determine:
1. Is this article primarily about video games or gaming?
2. What game(s) is it about (if any)?
3. What type of gaming content is it?

## Output Format
Return a JSON object with this structure:
{
  "isGameRelated": true|false,
  "confidence": 0.0-1.0,
  "games": ["Game Name 1", "Game Name 2"],
  "contentType": "news|guide|review|opinion|announcement|patch_notes|esports|other",
  "reasoning": "Brief explanation of the classification"
}

## Guidelines
- Article must be primarily about gaming to be classified as game-related
- Tech news, general entertainment, or tangentially related content should be marked as not game-related
- Be strict - only clearly gaming content should pass
- Consider the publication source (gaming sites vs general news)

## Article Information
Title: {title}
Source: {source}

## Article Excerpt
{article_excerpt}`;

/**
 * Preprocessing prompts configuration for Tabstack
 */
export const TABSTACK_PREPROCESSING_PROMPTS = {
  contentSegmentation: ARTICLE_SEGMENTATION_PROMPT,
  entityExtraction: ARTICLE_ENTITY_EXTRACTION_PROMPT,
  gameRelevance: ARTICLE_GAME_RELEVANCE_PROMPT,
  themeAnalysis: ARTICLE_THEME_ANALYSIS_PROMPT,
};

/**
 * Overview summary prompt for articles
 */
export const ARTICLE_OVERVIEW_PROMPT = `You are an expert content analyst. Analyze the article and generate a comprehensive overview.

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
  "contentCategory": "news|guide|review|opinion|announcement|patch_notes|esports|other"
}

## Guidelines
- Logline should be engaging and attention-grabbing with markdown formatting
- Full overview should be comprehensive but concise
- Short overview should capture the essence in 1-2 sentences
- Rate clickbait honestly: 1-2 for factual/balanced, 3 for moderate, 4-5 for sensational
- Themes should have concise titles and brief descriptions
- Category should match the article's primary purpose

## Article Information
Title: {title}
Source: {source}
Entities: {entities}
Themes: {themes}

## Article Content
{article_content}`;

/**
 * Processing prompts configuration for Tabstack
 */
export const TABSTACK_PROCESSING_PROMPTS = {
  overview: ARTICLE_OVERVIEW_PROMPT,
  // Enhanced summaries use the same prompts as Supadata
  // But with article-specific context
  insightful: {
    list: "/* Same as Supadata but with article context */",
    qa: "/* Same as Supadata but with article context */",
  },
  funny: {
    list: "/* Same as Supadata but with article context */",
    qa: "/* Same as Supadata but with article context */",
  },
  actionable: {
    list: "/* Same as Supadata but with article context */",
    qa: "/* Same as Supadata but with article context */",
  },
  controversial: {
    list: "/* Same as Supadata but with article context */",
    qa: "/* Same as Supadata but with article context */",
  },
};

/**
 * Get article excerpt for validation
 */
export function getArticleExcerpt(content: string, maxLength = 2000): string {
  if (content.length <= maxLength) {
    return content;
  }
  // Get beginning and end
  const partLength = Math.floor(maxLength / 2);
  const beginning = content.slice(0, partLength);
  const end = content.slice(-partLength);
  return `${beginning}\n...\n${end}`;
}
