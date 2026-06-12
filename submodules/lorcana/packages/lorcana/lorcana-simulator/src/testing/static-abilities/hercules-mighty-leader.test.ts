import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { fireTheCannons } from "@tcg/lorcana-cards/cards/001";
import { moanaOfMotunui } from "@tcg/lorcana-cards/cards/001";
import { bestowAGift } from "@tcg/lorcana-cards/cards/003";
import { mosquitoBite } from "@tcg/lorcana-cards/cards/006";
import { herculesMightyLeader } from "@tcg/lorcana-cards/cards/010";

// THE-937: Integration coverage for EVER VIGILANT / EVER VALIANT. Engine treats "being challenged"
// as the challenge defender only; dealt damage from actions is blocked outside that case, while
// put/move damage uses different effect types (see tests below).

const nonHeroCharacter = createMockCharacter({
  id: "hercules-test-non-hero",
  name: "Non Hero Character",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  classifications: ["Storyborn", "Villain"],
});

const genericAttacker = createMockCharacter({
  id: "hercules-test-attacker",
  name: "Generic Attacker",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
});

const strongAttacker = createMockCharacter({
  id: "hercules-test-strong-attacker",
  name: "Strong Attacker",
  cost: 6,
  strength: 7,
  willpower: 5,
  lore: 1,
});

describe("Hercules - Mighty Leader", () => {
  describe("EVER VIGILANT - This character can't be dealt damage unless he's being challenged.", () => {
    describe("deal-damage actions", () => {
      it("should prevent Hercules from taking damage from Fire the Cannons (deal-damage)", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [fireTheCannons],
            inkwell: fireTheCannons.cost,
          },
          {
            play: [herculesMightyLeader],
          },
        );

        expect(
          testEngine.asPlayerOne().playCard(fireTheCannons, {
            targets: [herculesMightyLeader],
          }),
        ).toBeSuccessfulCommand();

        expect(testEngine.asPlayerTwo().getDamage(herculesMightyLeader)).toBe(0);
      });
    });

    describe("put-damage actions", () => {
      it("should still place damage counters from Mosquito Bite (put-damage is not dealt damage)", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [mosquitoBite],
            inkwell: mosquitoBite.cost,
          },
          {
            play: [herculesMightyLeader],
          },
        );

        expect(
          testEngine.asPlayerOne().playCard(mosquitoBite, {
            targets: [herculesMightyLeader],
          }),
        ).toBeSuccessfulCommand();

        expect(testEngine.asPlayerTwo().getDamage(herculesMightyLeader)).toBe(1);
      });
    });

    describe("move-damage actions", () => {
      it("should still add moved damage counters via Bestow a Gift (move-damage is not dealt damage)", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [bestowAGift],
            inkwell: bestowAGift.cost,
            play: [{ card: genericAttacker, damage: 1 }],
          },
          {
            play: [herculesMightyLeader],
          },
        );

        expect(
          testEngine.asPlayerOne().playCard(bestowAGift, {
            targets: [genericAttacker, herculesMightyLeader],
          }),
        ).toBeSuccessfulCommand();

        expect(testEngine.asPlayerOne().getDamage(genericAttacker)).toBe(0);
        expect(testEngine.asPlayerTwo().getDamage(herculesMightyLeader)).toBe(1);
      });
    });

    it("THE-937: as challenge defender, Hercules takes lethal strike damage and is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: genericAttacker, isDrying: false }],
          deck: 2,
        },
        {
          play: [{ card: herculesMightyLeader, exerted: true }],
          deck: 2,
        },
      );

      // genericAttacker (str 3) challenges Hercules (wp 3) — Hercules should take lethal damage
      expect(
        testEngine.asPlayerOne().challenge(genericAttacker, herculesMightyLeader),
      ).toBeSuccessfulCommand();

      // Hercules is being challenged as defender, so EVER VIGILANT does NOT protect him
      expect(testEngine.asPlayerTwo().getCardZone(herculesMightyLeader)).toBe("discard");
    });

    it("should prevent return damage when Hercules is the ATTACKER (EVER VIGILANT)", () => {
      // Hercules (strength 5) challenges a character with enough strength to deal damage back.
      // EVER VIGILANT card text says "unless he's being challenged" — being challenged means
      // being the DEFENDER. As attacker, Hercules is also "in a challenge" but not "being challenged".
      // Per card text, only the challenged (defending) role lifts protection.
      // Hercules (str 5, wp 3) attacks genericAttacker (str 3, wp 4).
      // genericAttacker deals 3 damage back to Hercules (wp 3) => Hercules banished.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: herculesMightyLeader, isDrying: false }],
          deck: 2,
        },
        {
          play: [{ card: genericAttacker, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(herculesMightyLeader, genericAttacker),
      ).toBeSuccessfulCommand();

      // Hercules is the attacker; he is NOT being challenged (the defender is).
      // EVER VIGILANT should still apply — Hercules should NOT take damage as attacker.
      expect(testEngine.asPlayerOne().getDamage(herculesMightyLeader)).toBe(0);
      // genericAttacker should take Hercules's full strength (5) => banished (wp 4)
      expect(testEngine.asPlayerTwo().getCardZone(genericAttacker)).toBe("discard");
    });
  });

  describe("EVER VALIANT - While this character is exerted, your other Hero characters can't be dealt damage unless they're being challenged.", () => {
    describe("deal-damage actions", () => {
      it("should protect friendly Hero characters from Fire the Cannons when Hercules is exerted", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [fireTheCannons],
            inkwell: fireTheCannons.cost,
          },
          {
            play: [{ card: herculesMightyLeader, exerted: true }, moanaOfMotunui],
          },
        );

        expect(
          testEngine.asPlayerOne().playCard(fireTheCannons, {
            targets: [moanaOfMotunui],
          }),
        ).toBeSuccessfulCommand();

        expect(testEngine.asPlayerTwo().getDamage(moanaOfMotunui)).toBe(0);
      });
    });

    describe("put-damage actions", () => {
      it("should still place damage on a friendly Hero from Mosquito Bite (put-damage)", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [mosquitoBite],
            inkwell: mosquitoBite.cost,
          },
          {
            play: [{ card: herculesMightyLeader, exerted: true }, moanaOfMotunui],
          },
        );

        expect(
          testEngine.asPlayerOne().playCard(mosquitoBite, {
            targets: [moanaOfMotunui],
          }),
        ).toBeSuccessfulCommand();

        expect(testEngine.asPlayerTwo().getDamage(moanaOfMotunui)).toBe(1);
      });
    });

    describe("move-damage actions", () => {
      it("should still add moved damage to a friendly Hero via Bestow a Gift (move-damage)", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [bestowAGift],
            inkwell: bestowAGift.cost,
            play: [{ card: genericAttacker, damage: 1 }],
          },
          {
            play: [{ card: herculesMightyLeader, exerted: true }, moanaOfMotunui],
          },
        );

        expect(
          testEngine.asPlayerOne().playCard(bestowAGift, {
            targets: [genericAttacker, moanaOfMotunui],
          }),
        ).toBeSuccessfulCommand();

        expect(testEngine.asPlayerOne().getDamage(genericAttacker)).toBe(0);
        expect(testEngine.asPlayerTwo().getDamage(moanaOfMotunui)).toBe(1);
      });
    });

    it("should NOT protect friendly Hero characters when Hercules is NOT exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
        },
        {
          play: [herculesMightyLeader, moanaOfMotunui],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(fireTheCannons, {
          targets: [moanaOfMotunui],
        }),
      ).toBeSuccessfulCommand();

      // Hercules is ready (not exerted) so EVER VALIANT is not active
      expect(testEngine.asPlayerTwo().getDamage(moanaOfMotunui)).toBe(2);
    });

    it("should NOT protect non-Hero characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
        },
        {
          play: [{ card: herculesMightyLeader, exerted: true }, nonHeroCharacter],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(fireTheCannons, {
          targets: [nonHeroCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Non-Hero character is not protected by EVER VALIANT
      expect(testEngine.asPlayerTwo().getDamage(nonHeroCharacter)).toBe(2);
    });

    it("should prevent return damage on a friendly Hero attacker while Hercules is exerted (EVER VALIANT)", () => {
      // Moana (str 1) challenges genericAttacker (str 3, wp 4). Return strike would deal 3 to Moana
      // if EVER VALIANT did not apply; she is the challenger, not the challenged character.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: herculesMightyLeader, exerted: true },
            { card: moanaOfMotunui, isDrying: false },
          ],
          deck: 2,
        },
        {
          play: [{ card: genericAttacker, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(moanaOfMotunui, genericAttacker),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(moanaOfMotunui)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(genericAttacker)).toBe(1);
    });

    it("should allow Hero characters to take challenge damage when defended and Hercules is exerted", () => {
      // strongAttacker (str 7) challenges Moana (wp 6); Hercules is exerted (EVER VALIANT active)
      // Moana is the defender so "NOT being-challenged" is false — restriction lifts, she takes damage
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: strongAttacker, isDrying: false }],
          deck: 2,
        },
        {
          play: [
            { card: herculesMightyLeader, exerted: true },
            { card: moanaOfMotunui, exerted: true },
          ],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(strongAttacker, moanaOfMotunui),
      ).toBeSuccessfulCommand();

      // Moana is being challenged (is defender), so EVER VALIANT does NOT protect her
      // strongAttacker (str 7) vs Moana (wp 6) => Moana banished
      expect(testEngine.asPlayerTwo().getCardZone(moanaOfMotunui)).toBe("discard");
    });
  });
});
