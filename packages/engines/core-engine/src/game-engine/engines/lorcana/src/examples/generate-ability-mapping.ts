/**
 * This script generates a complete mapping of card texts to their detected ability types.
 * The output is a JSON file that can be used for automated processing and validation.
 */

import * as fs from "fs";
import * as path from "path";
import type { AbilityType } from "../abilities/ability-types";
import { detectAbilityType, splitAbilityText } from "./ability-type-mapping";
import { cardTexts } from "./card-texts";

interface AbilityMapping {
  text: string;
  abilityType: AbilityType | null;
  subAbilities?: AbilityMapping[];
}

/**
 * Processes a card text and returns its ability mapping
 */
function processCardText(text: string): AbilityMapping {
  const abilityParts = splitAbilityText(text);

  if (abilityParts.length > 1) {
    // This is a compound ability with multiple parts
    const subAbilities = abilityParts.map((part) => ({
      text: part.trim(),
      abilityType: detectAbilityType(part.trim()),
    }));

    return {
      text,
      abilityType: detectAbilityType(text),
      subAbilities,
    };
  }
  // Single ability
  return {
    text,
    abilityType: detectAbilityType(text),
  };
}

/**
 * Generates and saves the ability mapping file
 */
function generateAbilityMapping() {
  console.log("Generating ability mapping from card texts...");

  const mapping: AbilityMapping[] = cardTexts.map(processCardText);

  // Count by type
  const byType: Record<AbilityType | "unknown" | "total", number> = {
    activated: 0,
    triggered: 0,
    static: 0,
    keyword: 0,
    replacement: 0,
    unknown: 0,
    total: mapping.length,
  };

  mapping.forEach((item) => {
    if (item.abilityType) {
      byType[item.abilityType]++;
    } else {
      byType.unknown++;
    }
  });

  console.log("Ability type distribution:");
  console.log(`- Total abilities: ${byType.total}`);
  console.log(
    `- Activated: ${byType.activated} (${Math.round((byType.activated / byType.total) * 100)}%)`,
  );
  console.log(
    `- Triggered: ${byType.triggered} (${Math.round((byType.triggered / byType.total) * 100)}%)`,
  );
  console.log(
    `- Static: ${byType.static} (${Math.round((byType.static / byType.total) * 100)}%)`,
  );
  console.log(
    `- Keyword: ${byType.keyword} (${Math.round((byType.keyword / byType.total) * 100)}%)`,
  );
  console.log(
    `- Replacement: ${byType.replacement} (${Math.round((byType.replacement / byType.total) * 100)}%)`,
  );
  console.log(
    `- Uncategorized: ${byType.unknown} (${Math.round((byType.unknown / byType.total) * 100)}%)`,
  );

  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Save mapping to file
  const outputPath = path.join(outputDir, "ability-mapping.json");
  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2));

  console.log(`\nMapping saved to: ${outputPath}`);

  // Generate separate files for each ability type
  const byTypeFolder = path.join(outputDir, "by-type");
  if (!fs.existsSync(byTypeFolder)) {
    fs.mkdirSync(byTypeFolder);
  }

  const abilityTypes: (AbilityType | "unknown")[] = [
    "activated",
    "triggered",
    "static",
    "keyword",
    "replacement",
    "unknown",
  ];

  abilityTypes.forEach((type) => {
    const typeMapping = mapping.filter((item) =>
      type === "unknown"
        ? item.abilityType === null
        : item.abilityType === type,
    );

    const typePath = path.join(byTypeFolder, `${type}.json`);
    fs.writeFileSync(typePath, JSON.stringify(typeMapping, null, 2));

    console.log(`- ${type}.json: ${typeMapping.length} abilities`);
  });

  // Generate a summary file
  const summary = {
    totalAbilities: byType.total,
    typeCounts: {
      activated: byType.activated,
      triggered: byType.triggered,
      static: byType.static,
      keyword: byType.keyword,
      replacement: byType.replacement,
      unknown: byType.unknown,
    },
    percentages: {
      activated: Math.round((byType.activated / byType.total) * 100),
      triggered: Math.round((byType.triggered / byType.total) * 100),
      static: Math.round((byType.static / byType.total) * 100),
      keyword: Math.round((byType.keyword / byType.total) * 100),
      replacement: Math.round((byType.replacement / byType.total) * 100),
      unknown: Math.round((byType.unknown / byType.total) * 100),
    },
  };

  const summaryPath = path.join(outputDir, "summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  console.log(`\nSummary saved to: ${summaryPath}`);
  console.log("\nAbility mapping generation complete!");
}

// Run the generator
generateAbilityMapping();
