/**
 * Tests for GameRulesAnalyzer
 */

import { describe, expect, it } from "bun:test";
import { GameRulesAnalyzer } from "../game-rules-analyzer";

describe("GameRulesAnalyzer", () => {
  const analyzer = new GameRulesAnalyzer();

  const sampleRulesText = `
# Gundam Card Game Rules

## Timing Keywords

【Main】- During main phase
【Action】- During action steps  
【Deploy】- When card enters battle area
【Attack】- When unit declares attack
【Destroyed】- When unit/base is destroyed
【When Paired】- When pilot is paired
【During Pair】- While pilot is paired
【Burst】- When shield is destroyed
【Activate･Main】- Activated during main phase
【Activate･Action】- Activated during action steps

## Keyword Effects

<Repair> - Recovers HP at end of turn
<Breach> - Deals damage to shield when destroying enemy unit
<Support> - Gives AP to friendly unit when rested
<Blocker> - Can block attacks
<First-Strike> - Deals damage first in battle
<High-Maneuver> - Can attack without being blocked

## Game Mechanics

Battle damage is calculated when units attack.
Shield destruction occurs when damage is dealt.
Pilot pairing allows pilots to enhance units.
Resource area contains resources for paying costs.
Turn phases include main phase and action steps.
`;

  describe("extractTimingKeywords", () => {
    it("should extract timing keywords from rules text", () => {
      const keywords = analyzer.extractTimingKeywords(sampleRulesText);

      expect(keywords).toContain("Main");
      expect(keywords).toContain("Action");
      expect(keywords).toContain("Deploy");
      expect(keywords).toContain("Attack");
      expect(keywords).toContain("Destroyed");
      expect(keywords).toContain("When Paired");
      expect(keywords).toContain("During Pair");
      expect(keywords).toContain("Burst");
      expect(keywords).toContain("Activate･Main");
      expect(keywords).toContain("Activate･Action");
    });

    it("should handle empty rules text", () => {
      const keywords = analyzer.extractTimingKeywords("");
      expect(keywords).toEqual([]);
    });

    it("should extract unique keywords only", () => {
      const duplicateText = "【Main】 and 【Main】 again";
      const keywords = analyzer.extractTimingKeywords(duplicateText);
      expect(keywords.filter((k) => k === "Main")).toHaveLength(1);
    });
  });

  describe("extractKeywordEffects", () => {
    it("should extract keyword effects from rules text", () => {
      const effects = analyzer.extractKeywordEffects(sampleRulesText);

      expect(effects).toContain("Repair");
      expect(effects).toContain("Breach");
      expect(effects).toContain("Support");
      expect(effects).toContain("Blocker");
      expect(effects).toContain("First-Strike");
      expect(effects).toContain("High-Maneuver");
    });

    it("should handle text without keyword effects", () => {
      const noEffectsText = "This is just regular text without any effects.";
      const effects = analyzer.extractKeywordEffects(noEffectsText);
      expect(effects).toEqual([]);
    });

    it("should extract unique effects only", () => {
      const duplicateText = "<Repair> and <Repair> again";
      const effects = analyzer.extractKeywordEffects(duplicateText);
      expect(effects.filter((e) => e === "Repair")).toHaveLength(1);
    });
  });

  describe("identifyGameMechanics", () => {
    it("should identify game mechanics from rules text", () => {
      const mechanics = analyzer.identifyGameMechanics(sampleRulesText);

      expect(mechanics.some((m) => m.includes("battle damage"))).toBe(true);
      expect(mechanics.some((m) => m.includes("shield"))).toBe(true);
      expect(mechanics.some((m) => m.includes("pilot"))).toBe(true);
      expect(mechanics.some((m) => m.includes("resource"))).toBe(true);
      expect(mechanics.some((m) => m.includes("turn"))).toBe(true);
    });

    it("should handle empty rules text", () => {
      const mechanics = analyzer.identifyGameMechanics("");
      expect(mechanics).toEqual([]);
    });
  });

  describe("findMissingImplementations", () => {
    it("should find missing implementations in current types", () => {
      const mechanics = [
        "battle damage",
        "shield destruction",
        "pilot pairing",
      ];
      const currentTypes = ["BattleDamage", "ShieldArea"];

      const missing = analyzer.findMissingImplementations(
        mechanics,
        currentTypes,
      );

      expect(missing.length).toBeGreaterThan(0);
      expect(missing.some((m) => m.includes("pilot"))).toBe(true);
    });

    it("should return empty array when all mechanics are implemented", () => {
      const mechanics = ["battle damage"];
      const currentTypes = ["BattleDamage", "BattleDamageCalculation"];

      const missing = analyzer.findMissingImplementations(
        mechanics,
        currentTypes,
      );
      expect(missing).toEqual([]);
    });
  });

  describe("parseGameRules", () => {
    it("should parse game rules from file", async () => {
      // This test would require actual file system interaction
      // For now, we'll test the structure
      const analysis = await analyzer.parseGameRules("mock-rules.md");

      expect(analysis).toHaveProperty("timingKeywords");
      expect(analysis).toHaveProperty("keywordEffects");
      expect(analysis).toHaveProperty("gameMechanics");
      expect(analysis).toHaveProperty("missingImplementations");
    });

    it("should handle file read errors gracefully", async () => {
      const analysis = await analyzer.parseGameRules("nonexistent-file.md");

      expect(analysis.timingKeywords).toEqual([]);
      expect(analysis.keywordEffects).toEqual([]);
      expect(analysis.gameMechanics).toEqual([]);
      expect(analysis.missingImplementations).toEqual([]);
    });
  });
});
