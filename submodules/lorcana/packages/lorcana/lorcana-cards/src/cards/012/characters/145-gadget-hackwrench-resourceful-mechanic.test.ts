import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { gadgetHackwrenchResourcefulMechanic } from "./145-gadget-hackwrench-resourceful-mechanic";
import { rangerPlane } from "../items/167-ranger-plane";

const cheapItem = createMockItem({
  id: "gadget-cheap-item",
  name: "Cheap Item",
  cost: 3,
});

const supportCharacter = createMockCharacter({
  id: "gadget-support-char",
  name: "Support Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  abilities: [
    {
      id: "gadget-support-char-1",
      name: "Support",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
  ],
});

const nonSupportCharacter = createMockCharacter({
  id: "gadget-non-support-char",
  name: "Non-Support Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 2,
  abilities: [],
});

describe("Gadget Hackwrench - Resourceful Mechanic", () => {
  it("TIME TO TINKER - plays an item with cost 3 or less for free when Gadget is played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [gadgetHackwrenchResourcefulMechanic, cheapItem],
        inkwell: gadgetHackwrenchResourcefulMechanic.cost,
      },
      {
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(gadgetHackwrenchResourcefulMechanic),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(gadgetHackwrenchResourcefulMechanic, {
        resolveOptional: true,
        targets: [cheapItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(cheapItem)).toBe("play");
  });

  describe("WELL SUPPLIED - Your characters with Support get +1 {L}.", () => {
    it("grants +1 lore to a Support character in play alongside Gadget", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [gadgetHackwrenchResourcefulMechanic, supportCharacter],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().getCardLore(supportCharacter)).toBe(
        supportCharacter.lore + 1,
      );
    });

    it("does NOT grant +1 lore to a non-Support character in play alongside Gadget", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [gadgetHackwrenchResourcefulMechanic, nonSupportCharacter],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().getCardLore(nonSupportCharacter)).toBe(
        nonSupportCharacter.lore,
      );
    });

    it("grants +1 lore to a character whose Support was granted by Ranger Plane (THE-1029 F-04)", () => {
      // Ranger Plane's AIR SUPPORT gives all your characters Support via a
      // gain-keyword static effect. Gadget's WELL SUPPLIED filters
      // `has-keyword: "Support"` and must observe effective (granted)
      // keywords, not just base-definition keywords.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [gadgetHackwrenchResourcefulMechanic, rangerPlane, nonSupportCharacter],
          deck: 5,
        },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().getCardLore(nonSupportCharacter)).toBe(
        nonSupportCharacter.lore + 1,
      );
    });

    it("does NOT grant +1 lore to Support character when Gadget is NOT in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [supportCharacter],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().getCardLore(supportCharacter)).toBe(supportCharacter.lore);
    });
  });
});
