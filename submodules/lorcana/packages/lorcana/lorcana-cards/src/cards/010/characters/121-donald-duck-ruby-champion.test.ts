import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { donaldDuckRubyChampion } from "./121-donald-duck-ruby-champion";

const rubyAllyWeakStrength = createMockCharacter({
  id: "ruby-ally-weak",
  name: "Ruby Ally Weak",
  cost: 3,
  strength: 5,
  willpower: 4,
  lore: 1,
  inkType: ["ruby"],
});

const rubyAllyStrongStrength = createMockCharacter({
  id: "ruby-ally-strong",
  name: "Ruby Ally Strong",
  cost: 5,
  strength: 7,
  willpower: 5,
  lore: 2,
  inkType: ["ruby"],
});

const amberAlly = createMockCharacter({
  id: "amber-ally",
  name: "Amber Ally",
  cost: 3,
  strength: 5,
  willpower: 4,
  lore: 1,
  // inkType defaults to ["amber"]
});

describe("Donald Duck - Ruby Champion", () => {
  describe("HIGH ENERGY — Your other Ruby characters get +1 {S}", () => {
    it("gives +1 strength to other Ruby characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [donaldDuckRubyChampion, rubyAllyWeakStrength],
      });

      expect(testEngine.asPlayerOne().getCardStrength(rubyAllyWeakStrength)).toBe(6);
    });

    it("does not buff non-Ruby (amber) characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [donaldDuckRubyChampion, amberAlly],
      });

      expect(testEngine.asPlayerOne().getCardStrength(amberAlly)).toBe(5);
    });

    it("does not buff Donald Duck himself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [donaldDuckRubyChampion],
      });

      expect(testEngine.asPlayerOne().getCardStrength(donaldDuckRubyChampion)).toBe(4);
    });
  });

  describe("POWERFUL REWARD — Your other Ruby characters with 7 {S} or more get +1 {L}", () => {
    it("gives +1 lore to Ruby characters with exactly 7 strength (base)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [donaldDuckRubyChampion, rubyAllyStrongStrength],
      });

      // rubyAllyStrongStrength has base 7 strength, meets the >= 7 threshold
      expect(testEngine.asPlayerOne().getCardLore(rubyAllyStrongStrength)).toBe(3);
    });

    it("does not give +1 lore to Ruby characters with base strength 5 (becomes 6 after HIGH ENERGY, not enough)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [donaldDuckRubyChampion, rubyAllyWeakStrength],
      });

      // rubyAllyWeakStrength has 5 base strength, HIGH ENERGY gives +1 = 6, still below 7
      expect(testEngine.asPlayerOne().getCardLore(rubyAllyWeakStrength)).toBe(1);
    });

    it("does not give +1 lore to non-Ruby characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [donaldDuckRubyChampion, amberAlly],
      });

      expect(testEngine.asPlayerOne().getCardLore(amberAlly)).toBe(1);
    });

    it("does not buff Donald Duck himself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [donaldDuckRubyChampion],
      });

      expect(testEngine.asPlayerOne().getCardLore(donaldDuckRubyChampion)).toBe(1);
    });
  });
});
