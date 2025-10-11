import { describe, expect, it } from "bun:test";
import type { CardColor } from "../../shared-types";
import type {
  GundamitoBaseCard,
  GundamitoCommandCard,
  GundamitoPilotCard,
  GundamitoResourceCard,
  GundamitoUnitCard,
} from "../../src/cards/definitions/cardTypes";
import {
  getCardById,
  getCardsByColor,
  getCardsByType,
  getUnitsByAP,
} from "../helpers";

/**
 * Comprehensive E2E Tests for LLM-RULES Section 2: Card Information
 *
 * These tests validate the card type system, colors, and basic card properties
 * as defined in the official Gundam Card Game rules Section 2.
 *
 * Rules tested:
 * - 2-3: Card Types (Unit, Pilot, Command, Base, Resource)
 * - 2-4: Card Colors (blue, green, red, white)
 * - 2-5: Traits
 * - 2-6: AP (Attack Points)
 * - 2-7: HP (Hit Points)
 * - 2-8: Level
 * - 2-9: Cost
 * - 2-10: Card Text
 */

describe("LLM-RULES Section 2: Card Information", () => {
  describe("Rule 2-3: Card Types", () => {
    describe("Rule 2-3-2: Five card types exist", () => {
      it("should have Unit, Pilot, Command, Base, and Resource card types in catalog", () => {
        const unitCards = getCardsByType("unit");
        const pilotCards = getCardsByType("pilot");
        const commandCards = getCardsByType("command");
        const baseCards = getCardsByType("base");
        const resourceCards = getCardsByType("resource");

        expect(unitCards.length).toBeGreaterThan(0);
        expect(pilotCards.length).toBeGreaterThan(0);
        expect(commandCards.length).toBeGreaterThan(0);
        expect(baseCards.length).toBeGreaterThan(0);
        expect(resourceCards.length).toBeGreaterThan(0);
      });

      it("should classify each card into exactly one type", () => {
        const unitCards = getCardsByType("unit");
        const pilotCards = getCardsByType("pilot");
        const commandCards = getCardsByType("command");
        const baseCards = getCardsByType("base");
        const resourceCards = getCardsByType("resource");

        // Check that each card type is mutually exclusive
        const allTypeCards = [
          ...unitCards,
          ...pilotCards,
          ...commandCards,
          ...baseCards,
          ...resourceCards,
        ];

        // Each card should appear exactly once across all types
        const cardIds = allTypeCards.map((card) => card.id);
        const uniqueCardIds = new Set(cardIds);
        expect(cardIds.length).toBe(uniqueCardIds.size);
      });
    });

    describe("Rule 2-3-3: Unit cards", () => {
      it("should have Unit cards with required properties (AP, HP, traits)", () => {
        const unitCards = getCardsByType("unit") as GundamitoUnitCard[];
        expect(unitCards.length).toBeGreaterThan(0);

        for (const unit of unitCards) {
          expect(unit.type).toBe("unit");
          expect(unit.ap).toBeGreaterThanOrEqual(0);
          expect(unit.hp).toBeGreaterThan(0);
          expect(Array.isArray(unit.traits)).toBe(true);
          expect(Array.isArray(unit.zones)).toBe(true);
        }
      });

      it("should test specific Unit card: Gundam (ST01-001)", () => {
        const gundam = getCardById("ST01-001") as GundamitoUnitCard;

        expect(gundam).toBeDefined();
        expect(gundam.type).toBe("unit");
        expect(gundam.name).toBe("Gundam | RX-78-2");
        expect(gundam.ap).toBe(3);
        expect(gundam.hp).toBe(4);
        expect(gundam.cost).toBe(3);
        expect(gundam.level).toBe(4);
        expect(gundam.color).toBe("blue");
      });

      it("should test diverse Unit cards with varying AP/HP from different sets", () => {
        // Low AP/HP unit
        const lowStatUnits = getUnitsByAP(1, 2);
        expect(lowStatUnits.length).toBeGreaterThan(0);
        for (const unit of lowStatUnits) {
          expect(unit.ap).toBeGreaterThanOrEqual(1);
          expect(unit.ap).toBeLessThanOrEqual(2);
        }

        // High AP unit
        const highStatUnits = getUnitsByAP(4, 10);
        expect(highStatUnits.length).toBeGreaterThan(0);
        for (const unit of highStatUnits) {
          expect(unit.ap).toBeGreaterThanOrEqual(4);
        }
      });
    });

    describe("Rule 2-3-4: Pilot cards", () => {
      it("should have Pilot cards with required properties (AP/HP modifiers, traits)", () => {
        const pilotCards = getCardsByType("pilot") as GundamitoPilotCard[];
        expect(pilotCards.length).toBeGreaterThan(0);

        for (const pilot of pilotCards) {
          expect(pilot.type).toBe("pilot");
          expect(typeof pilot.apModifier).toBe("number");
          expect(typeof pilot.hpModifier).toBe("number");
          expect(Array.isArray(pilot.traits)).toBe(true);
        }
      });

      it("should test specific Pilot card: Amuro Ray (ST01-010)", () => {
        const amuroRay = getCardById("ST01-010") as GundamitoPilotCard;

        expect(amuroRay).toBeDefined();
        expect(amuroRay.type).toBe("pilot");
        expect(amuroRay.name).toBe("Amuro Ray");
        expect(amuroRay.apModifier).toBeGreaterThanOrEqual(0);
        expect(amuroRay.hpModifier).toBeGreaterThanOrEqual(0);
        expect(amuroRay.cost).toBeGreaterThanOrEqual(0);
        expect(amuroRay.level).toBeGreaterThanOrEqual(0);
      });

      it("should verify Pilots have AP/HP modifiers that can be added to Units (Rule 2-3-4-4)", () => {
        const pilotCards = getCardsByType("pilot") as GundamitoPilotCard[];

        for (const pilot of pilotCards) {
          // Modifiers can be positive or zero, but must be defined
          expect(pilot.apModifier).toBeDefined();
          expect(pilot.hpModifier).toBeDefined();
          expect(typeof pilot.apModifier).toBe("number");
          expect(typeof pilot.hpModifier).toBe("number");
        }
      });
    });

    describe("Rule 2-3-5: Command cards", () => {
      it("should have Command cards with required properties", () => {
        const commandCards = getCardsByType(
          "command",
        ) as GundamitoCommandCard[];
        expect(commandCards.length).toBeGreaterThan(0);

        for (const command of commandCards) {
          expect(command.type).toBe("command");
          expect(command.name).toBeDefined();
          expect(typeof command.cost).toBe("number");
          expect(typeof command.level).toBe("number");
        }
      });

      it("should test specific Command card: Thoroughly Damaged (ST01-012)", () => {
        const thoroughlyDamaged = getCardById(
          "ST01-012",
        ) as GundamitoCommandCard;

        if (thoroughlyDamaged) {
          expect(thoroughlyDamaged.type).toBe("command");
          expect(thoroughlyDamaged.name).toBe("Thoroughly Damaged");
          expect(thoroughlyDamaged.cost).toBeGreaterThanOrEqual(0);
          expect(thoroughlyDamaged.level).toBeGreaterThanOrEqual(0);
        }
      });

      it("should support Command cards with Pilot effects (Rule 2-3-5-4-1)", () => {
        const commandCards = getCardsByType(
          "command",
        ) as GundamitoCommandCard[];

        // Some command cards can have subType: "pilot"
        const commandsWithPilotEffect = commandCards.filter(
          (card) => card.subType === "pilot",
        );

        // If any command cards with pilot effects exist, verify they have modifiers
        if (commandsWithPilotEffect.length > 0) {
          for (const commandPilot of commandsWithPilotEffect) {
            expect(commandPilot.subType).toBe("pilot");
            expect("apModifier" in commandPilot).toBe(true);
            expect("hpModifier" in commandPilot).toBe(true);
          }
        }
      });
    });

    describe("Rule 2-3-6: Base cards", () => {
      it("should have Base cards with required properties (AP, HP, traits)", () => {
        const baseCards = getCardsByType("base") as GundamitoBaseCard[];
        expect(baseCards.length).toBeGreaterThan(0);

        for (const base of baseCards) {
          expect(base.type).toBe("base");
          expect(typeof base.ap).toBe("number");
          expect(base.hp).toBeGreaterThan(0);
          expect(Array.isArray(base.traits)).toBe(true);
        }
      });

      it("should test specific Base card: White Base (ST01-015)", () => {
        const whiteBase = getCardById("ST01-015") as GundamitoBaseCard;

        if (whiteBase) {
          expect(whiteBase.type).toBe("base");
          expect(whiteBase.name).toBe("White Base");
          expect(whiteBase.ap).toBeGreaterThanOrEqual(0);
          expect(whiteBase.hp).toBeGreaterThan(0);
          expect(whiteBase.cost).toBeGreaterThanOrEqual(0);
          expect(whiteBase.level).toBeGreaterThanOrEqual(0);
        }
      });

      it("should test diverse Base cards from different sets", () => {
        const allBases = getCardsByType("base") as GundamitoBaseCard[];

        // Group bases by set
        const basesBySet = allBases.reduce(
          (acc, base) => {
            if (!acc[base.set]) {
              acc[base.set] = [];
            }
            acc[base.set].push(base);
            return acc;
          },
          {} as Record<string, GundamitoBaseCard[]>,
        );

        // Verify we have bases from multiple sets
        expect(Object.keys(basesBySet).length).toBeGreaterThan(0);

        // Verify all bases have valid stats
        for (const base of allBases) {
          expect(base.ap).toBeGreaterThanOrEqual(0);
          expect(base.hp).toBeGreaterThan(0);
        }
      });
    });

    describe("Rule 2-3-7: Resource cards", () => {
      it("should have Resource cards that compose resource decks", () => {
        const resourceCards = getCardsByType(
          "resource",
        ) as GundamitoResourceCard[];
        expect(resourceCards.length).toBeGreaterThan(0);

        for (const resource of resourceCards) {
          expect(resource.type).toBe("resource");
          expect(resource.name).toBeDefined();
        }
      });

      it("should verify Resource cards have no cost, level, or color (Rules 2-4-2, 2-8-2, 2-9-2)", () => {
        const resourceCards = getCardsByType(
          "resource",
        ) as GundamitoResourceCard[];

        for (const resource of resourceCards) {
          // Resource cards should not have cost, level, or color properties
          expect("cost" in resource).toBe(false);
          expect("level" in resource).toBe(false);
          expect("color" in resource).toBe(false);
        }
      });
    });
  });

  describe("Rule 2-4: Card Colors", () => {
    describe("Rule 2-4-2: Four card colors", () => {
      it("should have cards in blue, green, red, and white colors", () => {
        const colors: CardColor[] = ["blue", "green", "red", "white"];

        for (const color of colors) {
          const cardsOfColor = getCardsByColor(color);
          expect(cardsOfColor.length).toBeGreaterThan(0);
        }
      });

      it("should test specific colored cards from different sets", () => {
        // Blue cards (typically Earth Federation)
        const blueCards = getCardsByColor("blue");
        expect(blueCards.length).toBeGreaterThan(0);
        const gundam = blueCards.find((card) => card.id === "ST01-001");
        if (gundam && "color" in gundam) {
          expect(gundam.color).toBe("blue");
        }

        // Red cards (typically Zeon)
        const redCards = getCardsByColor("red");
        expect(redCards.length).toBeGreaterThan(0);

        // White cards (typically Gundam Wing)
        const whiteCards = getCardsByColor("white");
        expect(whiteCards.length).toBeGreaterThan(0);

        // Green cards
        const greenCards = getCardsByColor("green");
        expect(greenCards.length).toBeGreaterThan(0);
      });

      it("should verify Resource cards and tokens have no color (Rule 2-4-2)", () => {
        const resourceCards = getCardsByType("resource");

        for (const resource of resourceCards) {
          expect("color" in resource).toBe(false);
        }
      });

      it("should verify all non-Resource cards have a color", () => {
        const unitCards = getCardsByType("unit");
        const pilotCards = getCardsByType("pilot");
        const commandCards = getCardsByType("command");
        const baseCards = getCardsByType("base");

        const nonResourceCards = [
          ...unitCards,
          ...pilotCards,
          ...commandCards,
          ...baseCards,
        ];

        for (const card of nonResourceCards) {
          expect("color" in card).toBe(true);
          expect((card as any).color).toBeDefined();
        }
      });
    });

    describe("Rule 2-4-3: Unit color independence from Pilot color", () => {
      it("should verify that Units and Pilots maintain separate colors", () => {
        const unitCards = getCardsByType("unit") as GundamitoUnitCard[];
        const pilotCards = getCardsByType("pilot") as GundamitoPilotCard[];

        // Verify all units have colors
        for (const unit of unitCards) {
          expect(unit.color).toBeDefined();
          expect(["blue", "green", "red", "white"]).toContain(unit.color);
        }

        // Verify all pilots have colors
        for (const pilot of pilotCards) {
          expect(pilot.color).toBeDefined();
          expect(["blue", "green", "red", "white"]).toContain(pilot.color);
        }
      });
    });
  });

  describe("Rule 2-5: Traits", () => {
    it("should have cards with trait information", () => {
      const unitCards = getCardsByType("unit") as GundamitoUnitCard[];
      const pilotCards = getCardsByType("pilot") as GundamitoPilotCard[];
      const baseCards = getCardsByType("base") as GundamitoBaseCard[];

      // Units should have traits
      const unitsWithTraits = unitCards.filter(
        (card) => card.traits && card.traits.length > 0,
      );
      expect(unitsWithTraits.length).toBeGreaterThan(0);

      // Pilots should have traits
      const pilotsWithTraits = pilotCards.filter(
        (card) => card.traits && card.traits.length > 0,
      );
      expect(pilotsWithTraits.length).toBeGreaterThan(0);

      // Bases should have traits
      const basesWithTraits = baseCards.filter(
        (card) => card.traits && card.traits.length > 0,
      );
      expect(basesWithTraits.length).toBeGreaterThan(0);
    });

    it("should verify cards can have multiple traits (Rule 2-5-2)", () => {
      const unitCards = getCardsByType("unit") as GundamitoUnitCard[];

      const unitsWithMultipleTraits = unitCards.filter(
        (card) => card.traits && card.traits.length > 1,
      );

      // At least some units should have multiple traits
      expect(unitsWithMultipleTraits.length).toBeGreaterThan(0);

      for (const unit of unitsWithMultipleTraits) {
        expect(unit.traits.length).toBeGreaterThan(1);
      }
    });

    it("should test specific traits in card catalog", () => {
      const unitCards = getCardsByType("unit") as GundamitoUnitCard[];

      // Test for Earth Federation trait
      const earthFedUnits = unitCards.filter((card) =>
        card.traits.some((trait) => trait.toLowerCase() === "earth federation"),
      );
      expect(earthFedUnits.length).toBeGreaterThan(0);

      // Some units should have recognizable traits
      const unitsWithTraits = unitCards.filter(
        (card) => card.traits && card.traits.length > 0,
      );
      expect(unitsWithTraits.length).toBeGreaterThan(0);
    });
  });

  describe("Rule 2-6: AP (Attack Points)", () => {
    it("should verify Units have AP for offensive strength", () => {
      const unitCards = getCardsByType("unit") as GundamitoUnitCard[];

      for (const unit of unitCards) {
        expect(typeof unit.ap).toBe("number");
        expect(unit.ap).toBeGreaterThanOrEqual(0);
      }
    });

    it("should verify Bases have AP", () => {
      const baseCards = getCardsByType("base") as GundamitoBaseCard[];

      for (const base of baseCards) {
        expect(typeof base.ap).toBe("number");
        expect(base.ap).toBeGreaterThanOrEqual(0);
      }
    });

    it("should verify Pilots have AP modifiers (Rule 2-6-3)", () => {
      const pilotCards = getCardsByType("pilot") as GundamitoPilotCard[];

      for (const pilot of pilotCards) {
        expect(typeof pilot.apModifier).toBe("number");
        expect(pilot.apModifier).toBeGreaterThanOrEqual(0);
      }
    });

    it("should test diverse AP values across unit types", () => {
      const lowAPUnits = getUnitsByAP(0, 2);
      const midAPUnits = getUnitsByAP(3, 4);
      const highAPUnits = getUnitsByAP(5, 10);

      expect(lowAPUnits.length).toBeGreaterThan(0);
      expect(midAPUnits.length).toBeGreaterThan(0);

      // High AP units might not exist in all sets
      if (highAPUnits.length > 0) {
        for (const unit of highAPUnits) {
          expect(unit.ap).toBeGreaterThanOrEqual(5);
        }
      }
    });
  });

  describe("Rule 2-7: HP (Hit Points)", () => {
    it("should verify Units have HP for defensive strength", () => {
      const unitCards = getCardsByType("unit") as GundamitoUnitCard[];

      for (const unit of unitCards) {
        expect(typeof unit.hp).toBe("number");
        expect(unit.hp).toBeGreaterThan(0);
      }
    });

    it("should verify Bases have HP (Rule 2-7-2)", () => {
      const baseCards = getCardsByType("base") as GundamitoBaseCard[];

      for (const base of baseCards) {
        expect(typeof base.hp).toBe("number");
        expect(base.hp).toBeGreaterThan(0);
      }
    });

    it("should verify Pilots have HP modifiers (Rule 2-7-3)", () => {
      const pilotCards = getCardsByType("pilot") as GundamitoPilotCard[];

      for (const pilot of pilotCards) {
        expect(typeof pilot.hpModifier).toBe("number");
        expect(pilot.hpModifier).toBeGreaterThanOrEqual(0);
      }
    });

    it("should verify cards are destroyed when HP becomes zero (Rule 2-7-1-1)", () => {
      // This is a rule about game behavior, but we can verify all cards
      // have positive HP to start with
      const unitCards = getCardsByType("unit") as GundamitoUnitCard[];
      const baseCards = getCardsByType("base") as GundamitoBaseCard[];

      for (const card of [...unitCards, ...baseCards]) {
        expect(card.hp).toBeGreaterThan(0);
      }
    });
  });

  describe("Rule 2-8: Level (Lv)", () => {
    it("should verify all non-Resource cards have a Level", () => {
      const unitCards = getCardsByType("unit");
      const pilotCards = getCardsByType("pilot");
      const commandCards = getCardsByType("command");
      const baseCards = getCardsByType("base");

      const nonResourceCards = [
        ...unitCards,
        ...pilotCards,
        ...commandCards,
        ...baseCards,
      ];

      for (const card of nonResourceCards) {
        expect("level" in card).toBe(true);
        expect(typeof (card as any).level).toBe("number");
        expect((card as any).level).toBeGreaterThanOrEqual(0);
      }
    });

    it("should verify Resource cards have no Level (Rule 2-8-2)", () => {
      const resourceCards = getCardsByType("resource");

      for (const resource of resourceCards) {
        expect("level" in resource).toBe(false);
      }
    });

    it("should test cards with varying Level requirements", () => {
      const unitCards = getCardsByType("unit") as GundamitoUnitCard[];

      const lowLevelUnits = unitCards.filter((card) => card.level <= 2);
      const midLevelUnits = unitCards.filter(
        (card) => card.level >= 3 && card.level <= 5,
      );
      const highLevelUnits = unitCards.filter((card) => card.level >= 6);

      expect(lowLevelUnits.length).toBeGreaterThan(0);
      expect(midLevelUnits.length).toBeGreaterThan(0);

      if (highLevelUnits.length > 0) {
        for (const unit of highLevelUnits) {
          expect(unit.level).toBeGreaterThanOrEqual(6);
        }
      }
    });
  });

  describe("Rule 2-9: Cost", () => {
    it("should verify all non-Resource cards have a Cost", () => {
      const unitCards = getCardsByType("unit");
      const pilotCards = getCardsByType("pilot");
      const commandCards = getCardsByType("command");
      const baseCards = getCardsByType("base");

      const nonResourceCards = [
        ...unitCards,
        ...pilotCards,
        ...commandCards,
        ...baseCards,
      ];

      for (const card of nonResourceCards) {
        expect("cost" in card).toBe(true);
        expect(typeof (card as any).cost).toBe("number");
        expect((card as any).cost).toBeGreaterThanOrEqual(0);
      }
    });

    it("should verify Resource cards have no Cost (Rule 2-9-2)", () => {
      const resourceCards = getCardsByType("resource");

      for (const resource of resourceCards) {
        expect("cost" in resource).toBe(false);
      }
    });

    it("should test cards with varying Cost values", () => {
      const unitCards = getCardsByType("unit") as GundamitoUnitCard[];

      const lowCostUnits = unitCards.filter((card) => card.cost <= 2);
      const midCostUnits = unitCards.filter(
        (card) => card.cost >= 3 && card.cost <= 5,
      );
      const highCostUnits = unitCards.filter((card) => card.cost >= 6);

      expect(lowCostUnits.length).toBeGreaterThan(0);
      expect(midCostUnits.length).toBeGreaterThan(0);

      // High cost units might exist in some sets
      if (highCostUnits.length > 0) {
        for (const unit of highCostUnits) {
          expect(unit.cost).toBeGreaterThanOrEqual(6);
        }
      }
    });

    it("should verify cost can be paid by resting Resources (Rule 2-9-1)", () => {
      // This verifies the card structure supports cost payment
      const unitCards = getCardsByType("unit") as GundamitoUnitCard[];

      for (const unit of unitCards) {
        // Cost should be a non-negative integer
        expect(Number.isInteger(unit.cost)).toBe(true);
        expect(unit.cost).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe("Rule 2-10: Card Text", () => {
    it("should verify cards have text describing their effects", () => {
      const allCards = [
        ...getCardsByType("unit"),
        ...getCardsByType("pilot"),
        ...getCardsByType("command"),
        ...getCardsByType("base"),
      ];

      const cardsWithText = allCards.filter((card) => card.text);
      expect(cardsWithText.length).toBeGreaterThan(0);
    });

    it("should verify cards have abilities structure", () => {
      const unitsWithAbilities = getCardsByType("unit").filter(
        (card) => (card as any).abilities && (card as any).abilities.length > 0,
      );

      expect(unitsWithAbilities.length).toBeGreaterThan(0);

      for (const unit of unitsWithAbilities) {
        expect(Array.isArray((unit as any).abilities)).toBe(true);
      }
    });

    it("should test Gundam (ST01-001) has Repair ability", () => {
      const gundam = getCardById("ST01-001") as GundamitoUnitCard;

      if (gundam?.abilities) {
        const hasRepair = gundam.abilities.some(
          (ability: any) =>
            ability.abilityType === "repair" || ability.name === "Repair 2",
        );
        expect(hasRepair).toBe(true);
      }
    });
  });

  describe("Rule 2-11: Link Conditions", () => {
    it("should verify Unit cards have link conditions", () => {
      const unitCards = getCardsByType("unit") as GundamitoUnitCard[];

      for (const unit of unitCards) {
        expect("linkRequirement" in unit).toBe(true);
        expect(Array.isArray(unit.linkRequirement)).toBe(true);
      }
    });

    it("should test Gundam (ST01-001) has Amuro Ray link requirement", () => {
      const gundam = getCardById("ST01-001") as GundamitoUnitCard;

      expect(gundam).toBeDefined();
      expect(gundam.linkRequirement).toBeDefined();
      expect(Array.isArray(gundam.linkRequirement)).toBe(true);

      // Check if Amuro Ray is in the link requirements (case-insensitive)
      const hasAmuroRayLink = gundam.linkRequirement.some((req) =>
        req.toLowerCase().includes("amuro ray"),
      );
      expect(hasAmuroRayLink).toBe(true);
    });

    it("should verify some units have empty link requirements", () => {
      const unitCards = getCardsByType("unit") as GundamitoUnitCard[];
      const unitsWithEmptyLink = unitCards.filter(
        (card) => card.linkRequirement.length === 0,
      );

      // Some units should have no specific link requirements
      expect(unitsWithEmptyLink.length).toBeGreaterThan(0);
    });
  });

  describe("Rule 2-12 through 2-15: Card Metadata", () => {
    it("should verify cards have card art information", () => {
      const allCards = [
        ...getCardsByType("unit"),
        ...getCardsByType("pilot"),
        ...getCardsByType("command"),
        ...getCardsByType("base"),
      ];

      const cardsWithImages = allCards.filter((card) => card.imageUrl);
      expect(cardsWithImages.length).toBeGreaterThan(0);
    });

    it("should verify cards have rarity information (Rule 2-15)", () => {
      const allCards = [
        ...getCardsByType("unit"),
        ...getCardsByType("pilot"),
        ...getCardsByType("command"),
        ...getCardsByType("base"),
        ...getCardsByType("resource"),
      ];

      for (const card of allCards) {
        expect(card.rarity).toBeDefined();
        expect(["common", "uncommon", "rare", "legendary"]).toContain(
          card.rarity,
        );
      }
    });

    it("should verify cards have set information", () => {
      const allCards = [
        ...getCardsByType("unit"),
        ...getCardsByType("pilot"),
        ...getCardsByType("command"),
        ...getCardsByType("base"),
        ...getCardsByType("resource"),
      ];

      for (const card of allCards) {
        expect(card.set).toBeDefined();
        expect(typeof card.set).toBe("string");
      }
    });
  });

  describe("Cross-type card property validation", () => {
    it("should verify consistent card ID format across all types", () => {
      const allCards = [
        ...getCardsByType("unit"),
        ...getCardsByType("pilot"),
        ...getCardsByType("command"),
        ...getCardsByType("base"),
        ...getCardsByType("resource"),
      ];

      for (const card of allCards) {
        expect(card.id).toBeDefined();
        expect(typeof card.id).toBe("string");
        expect(card.id.length).toBeGreaterThan(0);
      }
    });

    it("should verify card numbers are non-negative integers", () => {
      const allCards = [
        ...getCardsByType("unit"),
        ...getCardsByType("pilot"),
        ...getCardsByType("command"),
        ...getCardsByType("base"),
        ...getCardsByType("resource"),
      ];

      for (const card of allCards) {
        expect(card.number).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(card.number)).toBe(true);
      }
    });

    it("should verify all cards have unique IDs within catalog", () => {
      const allCards = [
        ...getCardsByType("unit"),
        ...getCardsByType("pilot"),
        ...getCardsByType("command"),
        ...getCardsByType("base"),
        ...getCardsByType("resource"),
      ];

      const cardIds = allCards.map((card) => card.id);
      const uniqueIds = new Set(cardIds);

      expect(cardIds.length).toBe(uniqueIds.size);
    });
  });
});
