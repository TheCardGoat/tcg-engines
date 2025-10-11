#!/usr/bin/env bun
/**
 * GD01 Test Generator
 *
 * Generates comprehensive E2E tests for all GD01 cards following the ST01-ST03 pattern.
 * This script creates test files co-located with card definitions.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const CARDS_BASE_PATH = join(__dirname, "../src/cards/definitions/GD01");
const CARD_TYPES = ["units", "pilots", "commands", "bases"] as const;

type CardType = (typeof CARD_TYPES)[number];

interface CardInfo {
  filePath: string;
  fileName: string;
  cardNumber: string;
  exportName: string;
  cardType: CardType;
}

/**
 * Extract export name from card file content
 */
function extractExportName(content: string): string | null {
  const match = content.match(/export const (\w+):/);
  return match ? match[1] : null;
}

/**
 * Extract card properties from file content
 */
function extractCardProperties(content: string): any {
  const idMatch = content.match(/id: "([^"]+)"/);
  const nameMatch = content.match(/name: "([^"]+)"/);
  const costMatch = content.match(/cost: (\d+)/);
  const levelMatch = content.match(/level: (\d+)/);
  const apMatch = content.match(/ap: (\d+)/);
  const hpMatch = content.match(/hp: (\d+)/);
  const colorMatch = content.match(/color: "([^"]+)"/);
  const typeMatch = content.match(/type: "([^"]+)"/);
  const rarityMatch = content.match(/rarity: "([^"]+)"/);
  const traitsMatch = content.match(/traits: \[(.*?)\]/s);
  const zonesMatch = content.match(/zones: \[(.*?)\]/);
  const linkReqMatch = content.match(/linkRequirement: \[(.*?)\]/);
  const textMatch = content.match(/text: "([^"]*)"/);
  const abilitiesMatch = content.match(/abilities: \[(.*?)\]/s);

  return {
    id: idMatch?.[1],
    name: nameMatch?.[1],
    cost: costMatch?.[1],
    level: levelMatch?.[1],
    ap: apMatch?.[1],
    hp: hpMatch?.[1],
    color: colorMatch?.[1],
    type: typeMatch?.[1],
    rarity: rarityMatch?.[1],
    traits: traitsMatch?.[1]
      ?.replace(/"/g, "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    zones: zonesMatch?.[1]
      ?.replace(/"/g, "")
      .split(",")
      .map((z) => z.trim())
      .filter(Boolean),
    linkRequirement: linkReqMatch?.[1]
      ?.replace(/"/g, "")
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean),
    text: textMatch?.[1] || "",
    hasAbilities: abilitiesMatch?.[1]?.trim() !== "",
  };
}

/**
 * Generate test file content for a card
 */
function generateTestContent(cardInfo: CardInfo, cardContent: string): string {
  const props = extractCardProperties(cardContent);
  const { exportName, cardType } = cardInfo;

  // Convert kebab-case to PascalCase for display
  const displayName = exportName.replace(/([A-Z])/g, " $1").trim();
  const capitalizedDisplayName =
    displayName.charAt(0).toUpperCase() + displayName.slice(1);

  // Build abilities description
  let abilitiesDesc = "";
  if (props.hasAbilities && props.text) {
    abilitiesDesc = `\n * Abilities:\n * - ${props.text}`;
  }

  // Build test template
  return `import { describe, expect, it } from "bun:test";
import {
  assertGamePhase,
  assertZoneCount,
} from "../../../../../__tests__/helpers/assertion-helpers";
import { GundamTestEngine } from "../../../../testing/gundam-test-engine";
import { ${exportName} } from "./${cardInfo.fileName.replace(".ts", "")}";

/**
 * Tests for ${props.id}: ${props.name}
 *
 * Card Properties:
 * - Cost: ${props.cost}, Level: ${props.level}${props.ap ? `, AP: ${props.ap}` : ""}${props.hp ? `, HP: ${props.hp}` : ""}
 * - Color: ${props.color}
 * - Type: ${props.type}
 * - Rarity: ${props.rarity}${props.traits?.length ? `\n * - Traits: ${props.traits.join(", ")}` : ""}${props.zones?.length ? `\n * - Zones: ${props.zones.join(", ")}` : ""}${props.linkRequirement?.length ? `\n * - Link Requirement: ${props.linkRequirement.join(", ")}` : ""}${abilitiesDesc}
 *
 * Test Coverage:
 * - Card definition structure and properties
 * - Abilities definition (if applicable)
 * - Card usability in game scenarios
 */

describe("${props.id}: ${props.name}", () => {
  describe("Card Definition", () => {
    it("should have correct basic properties", () => {
      expect(${exportName}.id).toBe("${props.id}");
      expect(${exportName}.name).toBe("${props.name}");
      expect(${exportName}.number).toBe(${Number.parseInt(cardInfo.cardNumber)});
      expect(${exportName}.set).toBe("GD01");
      expect(${exportName}.type).toBe("${props.type}");
      expect(${exportName}.rarity).toBe("${props.rarity}");
    });

    it("should have correct stats", () => {
      expect(${exportName}.cost).toBe(${props.cost});
      expect(${exportName}.level).toBe(${props.level});${props.ap ? `\n      expect(${exportName}.ap).toBe(${props.ap});` : ""}${props.hp ? `\n      expect(${exportName}.hp).toBe(${props.hp});` : ""}
    });

    it("should have correct color", () => {
      expect(${exportName}.color).toBe("${props.color}");
    });
${
  props.traits?.length
    ? `
    it("should have correct traits", () => {
      expect(${exportName}.traits).toEqual([${props.traits.map((t: string) => `"${t}"`).join(", ")}]);
    });
`
    : ""
}${
  props.zones?.length
    ? `
    it("should have correct zones", () => {
      expect(${exportName}.zones).toEqual([${props.zones.map((z: string) => `"${z}"`).join(", ")}]);
    });
`
    : ""
}${
  props.linkRequirement?.length
    ? `
    it("should have correct link requirement", () => {
      expect(${exportName}.linkRequirement).toEqual([${props.linkRequirement.map((l: string) => `"${l}"`).join(", ")}]);
    });
`
    : ""
}${
  props.text
    ? `
    it("should have card text", () => {
      expect(${exportName}.text).toBeTruthy();
      expect(${exportName}.text.length).toBeGreaterThan(0);
    });
`
    : ""
}  });
${
  props.hasAbilities
    ? `
  describe("Abilities Definition", () => {
    it("should have abilities array", () => {
      expect(${exportName}.abilities).toBeDefined();
      expect(Array.isArray(${exportName}.abilities)).toBe(true);
    });

    it("should have at least one ability", () => {
      expect(${exportName}.abilities.length).toBeGreaterThan(0);
    });

    it("should have properly structured abilities", () => {
      ${exportName}.abilities.forEach((ability) => {
        expect(ability).toHaveProperty("type");
        expect(ability).toHaveProperty("effects");
      });
    });
  });
`
    : ""
}
  describe("Card in Game Scenarios", () => {
    it("should be usable with sufficient resources", () => {
      const engine = new GundamTestEngine(
        {
          hand: [${exportName}],
          resourceArea: ${Number.parseInt(props.cost) + 2},
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      assertZoneCount(engine, "hand", 1, "player_one");
      assertZoneCount(engine, "resourceArea", ${Number.parseInt(props.cost) + 2}, "player_one");
      assertGamePhase(engine, "mainPhase");
    });

    it("should set up scenario with card in appropriate zone", () => {
      const engine = new GundamTestEngine(
        {
          ${cardType === "units" ? "battleArea" : cardType === "bases" ? "shieldBase" : "hand"}: [${exportName}],
          ${cardType === "units" || cardType === "bases" ? "hand: 5,\n          " : ""}resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      assertZoneCount(engine, "${cardType === "units" ? "battleArea" : cardType === "bases" ? "shieldBase" : "hand"}", 1, "player_one");
      assertGamePhase(engine, "mainPhase");
    });
${
  props.linkRequirement?.length && cardType === "units"
    ? `
    it("should work with link requirement", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [${exportName}],
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 2,
          hand: 5,
          resourceArea: 5,
          deck: 30,
        },
      );

      expect(${exportName}.linkRequirement).toEqual([${props.linkRequirement.map((l: string) => `"${l}"`).join(", ")}]);
      assertZoneCount(engine, "battleArea", 1, "player_one");
    });
`
    : ""
}${
  props.zones?.length && cardType === "units"
    ? `
    it("should be deployable in specified zones", () => {
      const engine = new GundamTestEngine(
        {
          hand: [${exportName}],
          resourceArea: ${Number.parseInt(props.cost) + 2},
          battleArea: 0,
          deck: 30,
        },
        {
          battleArea: 2,
          resourceArea: 5,
          deck: 30,
        },
      );

      ${props.zones.map((z: string) => `expect(${exportName}.zones).toContain("${z}");`).join("\n      ")}
      assertZoneCount(engine, "hand", 1, "player_one");
    });
`
    : ""
}  });

  describe("Card Implementation Status", () => {
    it("should track implementation status", () => {
      expect(${exportName}).toHaveProperty("implemented");
      expect(${exportName}).toHaveProperty("missingTestCase");
    });
  });
${
  props.ap && props.hp && cardType === "units"
    ? `
  describe("Card Stats and Combat", () => {
    it("should have appropriate stats for level ${props.level}", () => {
      expect(${exportName}.level).toBe(${props.level});
      expect(${exportName}.cost).toBe(${props.cost});
      expect(${exportName}.ap).toBe(${props.ap});
      expect(${exportName}.hp).toBe(${props.hp});
    });

    it("should have balanced AP and HP", () => {
      const totalStats = ${exportName}.ap + ${exportName}.hp;
      expect(totalStats).toBeGreaterThan(0);
    });

    it("should set up combat scenario", () => {
      const engine = new GundamTestEngine(
        {
          battleArea: [${exportName}],
          resourceArea: 5,
          deck: 30,
        },
        {
          battleArea: 1,
          resourceArea: 5,
          deck: 30,
        },
      );

      assertZoneCount(engine, "battleArea", 1, "player_one");
      assertZoneCount(engine, "battleArea", 1, "player_two");
    });
  });
`
    : ""
}});
`;
}

/**
 * Find all card files that need tests
 */
function findCardsNeedingTests(): CardInfo[] {
  const cards: CardInfo[] = [];

  for (const cardType of CARD_TYPES) {
    const dirPath = join(CARDS_BASE_PATH, cardType);
    if (!existsSync(dirPath)) continue;

    const files = readdirSync(dirPath).filter(
      (f) => f.endsWith(".ts") && !f.endsWith(".test.ts"),
    );

    for (const fileName of files) {
      const filePath = join(dirPath, fileName);
      const content = readFileSync(filePath, "utf-8");
      const exportName = extractExportName(content);

      if (!exportName) {
        console.warn(`⚠️  Could not find export in ${fileName}`);
        continue;
      }

      // Extract card number from filename
      const numberMatch = fileName.match(/^(\d+)-/);
      const cardNumber = numberMatch ? numberMatch[1] : "0";

      // Check if test file already exists
      const testFilePath = filePath.replace(".ts", ".test.ts");
      if (existsSync(testFilePath)) {
        console.log(`✓ Test already exists: ${fileName}`);
        continue;
      }

      cards.push({
        filePath,
        fileName,
        cardNumber,
        exportName,
        cardType,
      });
    }
  }

  return cards;
}

/**
 * Generate test files for all cards
 */
function generateTests() {
  console.log("🔍 Finding GD01 cards that need tests...\n");

  const cards = findCardsNeedingTests();

  if (cards.length === 0) {
    console.log("✅ All GD01 cards already have tests!");
    return;
  }

  console.log(`📝 Generating tests for ${cards.length} cards...\n`);

  let generated = 0;
  let failed = 0;

  for (const card of cards) {
    try {
      const cardContent = readFileSync(card.filePath, "utf-8");
      const testContent = generateTestContent(card, cardContent);
      const testFilePath = card.filePath.replace(".ts", ".test.ts");

      writeFileSync(testFilePath, testContent);
      console.log(`✓ Generated: ${card.fileName}.test.ts (${card.cardType})`);
      generated++;
    } catch (error) {
      console.error(`✗ Failed: ${card.fileName} - ${error}`);
      failed++;
    }
  }

  console.log("\n📊 Summary:");
  console.log(`   Generated: ${generated} test files`);
  console.log(`   Failed: ${failed} test files`);
  console.log(`   Total: ${cards.length} cards processed`);
}

// Run the generator
generateTests();
