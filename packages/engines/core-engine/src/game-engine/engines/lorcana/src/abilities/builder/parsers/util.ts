// Shared regex patterns and utilities for ability parsing

export const PATTERNS = {
  // Keywords - Updated to include all missing keywords
  SIMPLE_KEYWORD:
    /^(Bodyguard|Evasive|Rush|Ward|Vanish|Support|Reckless|Voiceless)$/i,
  KEYWORD_WITH_VALUE:
    /^\*\*(Challenger|Resist|Singer|Shift|Sing[\s-]?Together)\*\*\s*\+?(\d+)\s*_\([^)]+\)_\.?$/i,

  // Triggered abilities - simplified patterns
  ON_PLAY: /^When you play this character,\s*(.+)$/i,
  ON_QUEST: /^Whenever this character quests,\s*(.+)$/i,
  ON_BANISH: /^When this character is banished,\s*(.+)$/i,
  ON_CHALLENGE: /^When(?:ever)? this character challenges,\s*(.+)$/i,
  AT_START: /^At the start of your turn,\s*(.+)$/i,
  AT_END: /^At the end of your turn,\s*(.+)$/i,

  // Activated abilities
  EXERT_ABILITY: /^\{E\}(?:,\s*(\d+)\s*\{I\})?\s*[-–—]\s*(.+)$/i,
  INK_ABILITY: /^(\d+)\s*\{I\}(?:,\s*(.+?))?\s*[-–—]\s*(.+)$/i,

  // Static abilities
  WHILE_CONDITION: /^While (.+?),\s*(.+)$/i,

  // Simple effects
  GAIN_LORE: /gain (\d+) lore/i,
  DRAW_CARDS: /draw (?:(\d+) )?cards?/i,
  DEAL_DAMAGE: /deal (\d+) damage/i,
  BOOST_STAT: /(?:gets?|gains?) ([+-]\d+) \{([SWL])\}/i,
};

export function splitIntoAbilities(text: string): string[] {
  // First check if this is a simple keyword
  const simpleKeywords = [
    "Bodyguard",
    "Evasive",
    "Rush",
    "Ward",
    "Vanish",
    "Support",
    "Reckless",
    "Voiceless",
  ];
  if (simpleKeywords.includes(text.trim())) {
    return [text.trim()];
  }

  // Split on common separators like newlines or periods followed by spaces
  const parts = text.split(/\n+|\.\s+/);

  // Clean up each part and filter out empty ones
  return parts
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .map((part) => {
      const isKeyword =
        simpleKeywords.includes(part) ||
        /^(Challenger|Resist|Singer|Shift)\s*\+?(\d+)$/.test(part);
      return isKeyword ? part : part.endsWith(".") ? part : part + ".";
    });
}
