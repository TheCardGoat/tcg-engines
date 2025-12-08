import { getAllCards } from "../../../../../packages/lorcana-engine/src/cards/index";

/**
 * Normalize a single ability text by applying consistent formatting rules
 */
function normalizeAbilityText(text: string): string {
  let normalized = text;

  // Remove formatting artifacts
  normalized = normalized.replaceAll("\r", ""); // Remove carriage returns
  normalized = normalized.replace(/\u0003/g, ""); // Remove control characters

  // Normalize quotes - replace fancy quotes with standard apostrophes
  normalized = normalized.replaceAll("\u2019", "'"); // Replace right single quotation mark (')
  normalized = normalized.replaceAll("\u2018", "'"); // Replace left single quotation mark (')
  normalized = normalized.replaceAll("\u201C", '"'); // Replace left double quotation mark (")
  normalized = normalized.replaceAll("\u201D", '"'); // Replace right double quotation mark (")

  // Normalize markdown formatting - remove underscores (including standalone ones)
  normalized = normalized.replace(/_([^_]+)_/g, "$1"); // Remove underscores around text
  normalized = normalized.replace(/\s+_\s*$/g, ""); // Remove trailing underscore with spaces
  normalized = normalized.replace(/^\s*_\s+/g, ""); // Remove leading underscore with spaces

  // Normalize spacing
  normalized = normalized.replace(/\s+/g, " "); // Replace multiple spaces with single space
  normalized = normalized.trim();

  // Remove trailing period with space artifacts (e.g., "Evasive .")
  normalized = normalized.replace(/\s+\.\s*$/g, "");

  // Standardize punctuation - remove trailing periods from single keywords and short phrases
  const singleKeywords = [
    "Rush",
    "Ward",
    "Evasive",
    "Vanish",
    "Support",
    "Reckless",
    "Bodyguard",
    "Alert",
  ];
  for (const keyword of singleKeywords) {
    // Match keyword at start, optionally followed by period and nothing else significant
    const regex = new RegExp(`^${keyword}\\.?$`, "i");
    if (regex.test(normalized)) {
      normalized = keyword; // Use title case version
      break;
    }
  }

  // Remove trailing period from short ability patterns like "Challenger +{d}."
  const shortAbilityPatterns = [
    /^(Challenger \+{d})\.$/,
    /^(Shift {d})\.$/,
    /^(Singer {d})\.$/,
    /^(Resist \+{d})\.$/,
    /^(Boost {d})\.$/,
  ];
  for (const pattern of shortAbilityPatterns) {
    const match = normalized.match(pattern);
    if (match) {
      normalized = match[1];
      break;
    }
  }

  // Normalize ability keywords - handle both standalone and with parameters
  const keywordNormalizations = [
    { pattern: /^SHIFT {d}$/i, replacement: "Shift {d}" },
    { pattern: /^SHIFT {d} {I}$/i, replacement: "Shift {d} {I}" },
    { pattern: /^WARD$/i, replacement: "Ward" },
    { pattern: /^EVASIVE$/i, replacement: "Evasive" },
    { pattern: /^RUSH$/i, replacement: "Rush" },
    { pattern: /^SUPPORT$/i, replacement: "Support" },
    { pattern: /^BODYGUARD$/i, replacement: "Bodyguard" },
    { pattern: /^RECKLESS$/i, replacement: "Reckless" },
    { pattern: /^VANISH$/i, replacement: "Vanish" },
    { pattern: /^ALERT$/i, replacement: "Alert" },
  ];

  for (const { pattern, replacement } of keywordNormalizations) {
    if (pattern.test(normalized)) {
      normalized = replacement;
      break;
    }
  }

  return normalized;
}

/**
 * Split compound abilities into individual abilities
 * e.g., "Shift {d} Ward" -> ["Shift {d}", "Ward"]
 * e.g., "Ward GATHERER OF THE WICKED..." -> ["Ward", "GATHERER OF THE WICKED..."]
 */
function splitCompoundAbilities(ability: string): string[] {
  const keywords = [
    "Rush",
    "Ward",
    "Evasive",
    "Vanish",
    "Support",
    "Reckless",
    "Bodyguard",
    "Alert",
  ];

  const abilityKeywords = [
    "Shift {d}",
    "Challenger +{d}",
    "Singer {d}",
    "Resist +{d}",
    "Boost {d}",
    "Sing Together {d}",
  ];

  // All keywords to check (both simple and with parameters)
  const allKeywords = [...abilityKeywords, ...keywords];

  // First handle comma-separated abilities (e.g., "Bodyguard, Support")
  if (ability.includes(",")) {
    const parts = ability
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    // Check if all parts are simple keywords
    const allAreKeywords = parts.every(
      (part) => keywords.includes(part) || abilityKeywords.includes(part),
    );
    if (allAreKeywords) {
      return parts;
    }
  }

  // Check if ability starts with a keyword followed by more text
  for (const keyword of allKeywords) {
    if (ability.startsWith(keyword + " ")) {
      const remainder = ability.substring(keyword.length).trim();

      // If remainder is also a simple keyword, split it
      if (keywords.includes(remainder)) {
        return [keyword, remainder];
      }

      // If remainder is longer text (starts with uppercase letters indicating a named ability)
      // Split it out
      if (remainder.length > 0) {
        // Check if the remainder starts with an uppercase letter or special pattern
        // indicating it's a named ability (like "GATHERER OF THE WICKED")
        const startsWithNamedAbility = /^[A-Z!',]/.test(remainder);
        if (startsWithNamedAbility) {
          return [keyword, remainder];
        }
      }
    }
  }

  // No splitting needed
  return [ability];
}

/**
 * Process a single text entry by splitting abilities, replacing numbers, and filtering characters
 */
function processTextEntry(text: string): string[] {
  // Remove * and • characters
  let cleanedText = text.replaceAll("*", "").replaceAll("•", "");

  // Remove text inside _(...)_ - handle various malformed cases
  cleanedText = cleanedText.replace(/_\([^)]*\)_/g, ""); // Normal case: _(...)_
  cleanedText = cleanedText.replace(/_[^)]*\)_/g, ""); // Missing opening paren: _...)_
  cleanedText = cleanedText.replace(/_\([^_]*_/g, ""); // Missing closing paren: _(...)_

  // Remove all reminder text within parentheses (...)
  // Handle multiple passes to catch nested or overlapping cases
  let previousText = "";
  let iterations = 0;
  const maxIterations = 10; // Prevent infinite loops

  while (cleanedText !== previousText && iterations < maxIterations) {
    previousText = cleanedText;
    // Remove content within parentheses
    cleanedText = cleanedText.replace(/\([^()]*\)/g, "");
    iterations++;
  }

  // Clean up any orphaned parentheses, underscores, or brackets that might remain
  cleanedText = cleanedText.replace(/[()_]/g, "");

  // Replace <br> and <br/> with newlines
  cleanedText = cleanedText.replaceAll("<br/>", "\n");
  cleanedText = cleanedText.replaceAll("<br>", "\n");

  // Split by newlines to handle multiple abilities
  const abilities = cleanedText
    .split("\n")
    .filter((ability) => ability.trim().length > 1);

  // Replace numbers with {d} in each ability and remove leading bullets
  const processedAbilities = abilities.flatMap((ability) => {
    let trimmed = ability.trim();
    // Remove leading "- " or "· " from the beginning
    trimmed = trimmed.replace(/^[-·]\s+/, "");
    // Replace numbers with {d}
    trimmed = trimmed.replace(/\d+/g, "{d}");
    // Apply normalization
    trimmed = normalizeAbilityText(trimmed);
    // Split compound abilities
    return splitCompoundAbilities(trimmed);
  });

  return processedAbilities;
}

/**
 * Extract all unique card text from all cards in the database
 */
async function extractAllCardText(): Promise<string[]> {
  console.log("Loading all cards...");
  const allCards = await getAllCards();

  console.log(`Loaded ${allCards.length} cards`);

  const allTexts: string[] = [];

  for (const card of allCards) {
    if (card.text && card.text.trim().length > 0) {
      const processedAbilities = processTextEntry(card.text.trim());
      allTexts.push(...processedAbilities);
    }
  }

  console.log(`Extracted ${allTexts.length} text entries`);

  // Remove duplicates while preserving order
  const uniqueTexts = Array.from(new Set(allTexts));

  console.log(`Found ${uniqueTexts.length} unique text entries`);

  return uniqueTexts.sort();
}

/**
 * Generate the all-lorcana-texts.ts file
 */
async function generateAllLorcanaTexts() {
  try {
    const uniqueTexts = await extractAllCardText();

    // Sort text alphabetically
    const sortedTexts = uniqueTexts.sort((a, b) => a.length - b.length);

    // Generate the file content
    const fileContent = `
export const totalUniqueTexts = ${sortedTexts.length};
export const allCardsText: string[] = [
${sortedTexts.map((text) => `  ${JSON.stringify(text)}`).join(",\n")}
];

`;

    return fileContent;
  } catch (error) {
    console.error("Error generating all lorcana texts:", error);
    throw error;
  }
}

// Run the generation if this file is executed directly
if (require.main === module) {
  generateAllLorcanaTexts()
    .then((content) => {
      console.log("Successfully generated all-lorcana-texts.ts");

      // Write to file
      const fs = require("fs");
      const path = require("path");
      const filePath = path.join(__dirname, "all-lorcana-texts.ts");

      fs.writeFileSync(filePath, content, "utf8");
      console.log(`File written to: ${filePath}`);
      console.log(
        `Total unique texts: ${
          content
            .split("\n")
            .find((line) => line.includes("totalUniqueTexts"))
            ?.match(/\d+/)?.[0] || "unknown"
        }`,
      );
    })
    .catch((error) => {
      console.error("Failed to generate all-lorcana-texts.ts:", error);
      process.exit(1);
    });
}

export { generateAllLorcanaTexts, extractAllCardText };
