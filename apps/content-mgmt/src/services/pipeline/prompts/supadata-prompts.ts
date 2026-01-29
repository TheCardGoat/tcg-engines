/**
 * Supadata Prompts
 *
 * AI prompts for preprocessing and processing YouTube video content
 * extracted via Supadata.
 */

/**
 * Entity extraction prompt for video content
 */
export const ENTITY_EXTRACTION_PROMPT = `You are an expert content analyst specializing in gaming content. Analyze the following video transcript and extract all relevant entities.

## Instructions
Extract entities in these categories:
- **character**: Game characters, NPCs, bosses, heroes, villains
- **item**: Weapons, armor, consumables, crafting materials, currencies
- **location**: Maps, zones, dungeons, cities, regions
- **ability**: Skills, spells, talents, perks, abilities
- **game_mode**: PvP, PvE, raids, dungeons, arenas, modes
- **mechanic**: Game mechanics, systems, features
- **creator**: Content creators, streamers, YouTubers mentioned
- **other**: Other relevant entities

## Output Format
Return a JSON object with this structure:
{
  "entities": [
    {
      "name": "Entity Name",
      "type": "character|item|location|ability|game_mode|mechanic|creator|other",
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

## Transcript
{transcript}`;

/**
 * Theme analysis prompt for video content
 */
export const THEME_ANALYSIS_PROMPT = `You are an expert content analyst. Analyze the following video transcript and identify the main themes and topics.

## Instructions
Identify 3-7 main themes that capture the essence of the content. Each theme should:
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
- Capture unique aspects of the content

## Transcript
{transcript}`;

/**
 * Content segmentation prompt for video content
 */
export const CONTENT_SEGMENTATION_PROMPT = `You are an expert content analyst. Analyze the following video transcript and segment it into logical sections.

## Instructions
Divide the content into 3-10 logical segments based on topic changes. For each segment:
- Identify the start and end timestamps (in seconds)
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
      "endOffset": 120,
      "summary": "Brief summary of this segment",
      "topics": ["topic1", "topic2"],
      "entityMentions": ["Entity1", "Entity2"]
    }
  ]
}

## Guidelines
- Segments should be at least 30 seconds long
- Summaries should be 1-2 sentences
- Topics should be specific, not generic
- Entity mentions should match entities from extraction

## Transcript with Timestamps
{transcript}`;

/**
 * Game relevance validation prompt
 */
export const GAME_RELEVANCE_PROMPT = `You are an expert content classifier. Determine if the following content is related to video games, gaming, or game-related topics.

## Instructions
Analyze the content and determine:
1. Is this content primarily about video games or gaming?
2. What game(s) is it about (if any)?
3. What type of gaming content is it?

## Output Format
Return a JSON object with this structure:
{
  "isGameRelated": true|false,
  "confidence": 0.0-1.0,
  "games": ["Game Name 1", "Game Name 2"],
  "contentType": "tutorial|gameplay|news|review|discussion|other",
  "reasoning": "Brief explanation of the classification"
}

## Guidelines
- Content must be primarily about gaming to be classified as game-related
- Tangentially related content (e.g., tech reviews, general entertainment) should be marked as not game-related
- Be strict - only clearly gaming content should pass

## Content Summary
Title: {title}
Description: {description}

## Transcript Excerpt
{transcript_excerpt}`;

/**
 * Preprocessing prompts configuration
 */
export const SUPADATA_PREPROCESSING_PROMPTS = {
  entityExtraction: ENTITY_EXTRACTION_PROMPT,
  themeAnalysis: THEME_ANALYSIS_PROMPT,
  contentSegmentation: CONTENT_SEGMENTATION_PROMPT,
  gameRelevance: GAME_RELEVANCE_PROMPT,
};

/**
 * Format transcript for prompts
 */
export function formatTranscriptForPrompt(
  segments: Array<{ text: string; offsetMs: number }>,
  maxLength = 15000,
): string {
  let result = "";
  for (const segment of segments) {
    const timestamp = formatTimestamp(segment.offsetMs);
    const line = `[${timestamp}] ${segment.text}\n`;
    if (result.length + line.length > maxLength) {
      break;
    }
    result += line;
  }
  return result;
}

/**
 * Format milliseconds to timestamp string
 */
function formatTimestamp(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Get transcript excerpt for validation
 */
export function getTranscriptExcerpt(
  textContent: string,
  maxLength = 2000,
): string {
  if (textContent.length <= maxLength) {
    return textContent;
  }
  // Get beginning, middle, and end
  const partLength = Math.floor(maxLength / 3);
  const beginning = textContent.slice(0, partLength);
  const middle = textContent.slice(
    Math.floor(textContent.length / 2) - partLength / 2,
    Math.floor(textContent.length / 2) + partLength / 2,
  );
  const end = textContent.slice(-partLength);
  return `${beginning}\n...\n${middle}\n...\n${end}`;
}
