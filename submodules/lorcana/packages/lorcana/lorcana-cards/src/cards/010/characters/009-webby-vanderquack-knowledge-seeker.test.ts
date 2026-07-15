import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { webbyVanderquackKnowledgeSeeker } from "./009-webby-vanderquack-knowledge-seeker";
import { flynnRiderSpectralScoundrel } from "./081-flynn-rider-spectral-scoundrel";

const plainCharacter = createMockCharacter({
  id: "plain-char",
  name: "Plain Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Webby Vanderquack - Knowledge Seeker", () => {
  describe("base stats", () => {
    it("should have correct base stats", () => {
      expect(webbyVanderquackKnowledgeSeeker.cost).toBe(3);
      expect(webbyVanderquackKnowledgeSeeker.strength).toBe(1);
      expect(webbyVanderquackKnowledgeSeeker.willpower).toBe(6);
      expect(webbyVanderquackKnowledgeSeeker.lore).toBe(1);
      expect(webbyVanderquackKnowledgeSeeker.inkable).toBe(true);
      expect(webbyVanderquackKnowledgeSeeker.inkType).toEqual(["amber"]);
      expect(webbyVanderquackKnowledgeSeeker.set).toBe("010");
      expect(webbyVanderquackKnowledgeSeeker.cardNumber).toBe(9);
      expect(webbyVanderquackKnowledgeSeeker.rarity).toBe("uncommon");
    });
  });

  describe("I'VE READ ABOUT THIS - static ability", () => {
    it("should have exactly one ability named I'VE READ ABOUT THIS", () => {
      const abilities = webbyVanderquackKnowledgeSeeker.abilities ?? [];
      expect(abilities).toHaveLength(1);

      const ability = abilities[0];
      expect(ability).toBeDefined();
      expect(ability?.name).toBe("I'VE READ ABOUT THIS");
    });

    it("should be a static ability", () => {
      const ability = webbyVanderquackKnowledgeSeeker.abilities?.[0];
      expect(ability?.type).toBe("static");
    });

    it("should have a modify-stat lore +1 effect targeting SELF", () => {
      const ability = webbyVanderquackKnowledgeSeeker.abilities?.[0];
      expect(ability?.type).toBe("static");

      if (ability?.type === "static") {
        expect(ability.effect.type).toBe("modify-stat");
        if (ability.effect.type === "modify-stat") {
          expect(ability.effect.stat).toBe("lore");
          expect(ability.effect.modifier).toBe(1);
          expect(ability.effect.target).toBe("SELF");
        }
      }
    });

    it("should have a target-query condition checking for cards with cards under them (owned by you)", () => {
      const ability = webbyVanderquackKnowledgeSeeker.abilities?.[0];
      expect(ability?.type).toBe("static");

      if (ability?.type === "static") {
        expect(ability.condition).toBeDefined();
        const condition = ability.condition;
        expect(condition?.type).toBe("target-query");

        if (condition?.type === "target-query") {
          expect(condition.comparison?.operator).toBe("gte");
          expect(condition.comparison?.value).toBe(1);

          const query = condition.query as { owner?: string; zones?: string[] };
          expect(query.owner).toBe("you");
          expect(query.zones).toEqual(["play"]);
        }
      }
    });

    it("lore stays at base value when no cards have cards under them", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [webbyVanderquackKnowledgeSeeker, plainCharacter],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const webbyCard = testEngine.asPlayerOne().getCard(webbyVanderquackKnowledgeSeeker);
      expect(webbyCard.lore).toBe(webbyVanderquackKnowledgeSeeker.lore);
    });

    it("gets +1 lore when a friendly character has a card under them (via Boost)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [webbyVanderquackKnowledgeSeeker, flynnRiderSpectralScoundrel],
          deck: 3,
          inkwell: 2,
        },
        {
          deck: 5,
        },
      );

      // Before Boost: Webby should have base lore
      const webbyBefore = testEngine.asPlayerOne().getCard(webbyVanderquackKnowledgeSeeker);
      expect(webbyBefore.lore).toBe(webbyVanderquackKnowledgeSeeker.lore);

      // Use Flynn's Boost to put a card under him
      expect(
        testEngine.asPlayerOne().activateAbility(flynnRiderSpectralScoundrel, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      // After Boost: Flynn has a card under him, so Webby should get +1 lore
      const webbyAfter = testEngine.asPlayerOne().getCard(webbyVanderquackKnowledgeSeeker);
      expect(webbyAfter.lore).toBe(webbyVanderquackKnowledgeSeeker.lore + 1);
    });
  });
});
