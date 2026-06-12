import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { cheshireCatInexplicable } from "./060-cheshire-cat-inexplicable";
import { theLibraryAGiftForBelle } from "../../005/locations/068-the-library-a-gift-for-belle";
import { calhounMarineSergeant } from "../../006/characters/191-calhoun-marine-sergeant";

const ally = createMockCharacter({
  id: "cheshire-ally",
  name: "Ally",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const opposingTarget = createMockCharacter({
  id: "cheshire-opposing-target",
  name: "Opposing Target",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const nearDeathResident = createMockCharacter({
  id: "cheshire-library-resident",
  name: "Library Resident",
  cost: 2,
  strength: 2,
  willpower: 1,
});

const damageSource = createMockCharacter({
  id: "cheshire-damage-source",
  name: "Damage Source",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const libraryDrawCard = createMockCharacter({
  id: "cheshire-draw-card",
  name: "Draw Card",
  cost: 1,
});

const deckFiller = createMockCharacter({
  id: "cheshire-deck-filler",
  name: "Deck Filler",
  cost: 1,
  strength: 1,
  willpower: 2,
});

describe("Cheshire Cat - Inexplicable", () => {
  it("has Boost 2 keyword", () => {
    const abilities = cheshireCatInexplicable.abilities ?? [];
    const ability = abilities[0];
    expect(ability).toBeDefined();
    expect(ability!.type).toBe("keyword");
    expect((ability as { keyword: string }).keyword).toBe("Boost");
    expect((ability as { value: number }).value).toBe(2);
  });

  it("has IT'S LOADS OF FUN triggered ability", () => {
    const abilities = cheshireCatInexplicable.abilities ?? [];
    const ability = abilities[1];
    expect(ability).toBeDefined();
    expect(ability!.type).toBe("triggered");
    expect((ability as { trigger: { event: string } }).trigger.event).toBe("put-card-under");
  });

  it("triggers The Library's draw when moving damage banishes a character there", () => {
    // Cheshire Cat's IT'S LOADS OF FUN moves damage TO an opposing character.
    // The Library and its resident are on Player 2's side so they qualify as the
    // opposing target. When the moved damage banishes the resident, Player 2's
    // Library fires LOST IN A BOOK and Player 2 draws a card.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: cheshireCatInexplicable, isDrying: false },
          { card: damageSource, damage: 2 },
        ],
        inkwell: 2,
        deck: 2,
      },
      {
        play: [
          theLibraryAGiftForBelle,
          { card: nearDeathResident, atLocation: theLibraryAGiftForBelle },
        ],
        deck: [libraryDrawCard],
      },
    );

    // Trigger Boost 2 to put a card under Cheshire, which fires IT'S LOADS OF FUN
    expect(
      testEngine.asPlayerOne().activateAbility(cheshireCatInexplicable),
    ).toBeSuccessfulCommand();

    // Resolve IT'S LOADS OF FUN: move 1 damage from damageSource to nearDeathResident (1 willpower → banished)
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(cheshireCatInexplicable, {
        resolveOptional: true,
        targets: [damageSource, nearDeathResident],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(nearDeathResident)).toBe("discard");

    // Library's LOST IN A BOOK should have fired; Player 2 resolves the optional draw
    expect(
      testEngine.asPlayerTwo().resolvePendingByCard(theLibraryAGiftForBelle),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(libraryDrawCard)).toBe("hand");
  });

  describe("IT'S LOADS OF FUN — Whenever you put a card under this character, you may move up to 2 damage counters from chosen character to chosen opposing character.", () => {
    it("moves damage counters from one character to an opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [cheshireCatInexplicable],
          inkwell: 2,
          deck: [deckFiller],
        },
        {
          play: [{ card: ally, damage: 2 }, opposingTarget],
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(cheshireCatInexplicable),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(bagEffect!.sourceId, {
          resolveOptional: true,
          targets: [ally, opposingTarget],
          amount: 2,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(ally)).toBe(0);
      expect(testEngine.asPlayerOne().getDamage(opposingTarget)).toBe(2);
    });

    it("move-damage bypasses Resist on the destination character", () => {
      // Calhoun Marine Sergeant has Resist +1 (willpower 2).
      // Move 1 damage counter to him: if resist were applied, 1 - 1 = 0 (nothing moved).
      // Correct behavior: resist is bypassed → Calhoun ends up with 1 damage counter.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [cheshireCatInexplicable],
          inkwell: 2,
          deck: [deckFiller],
        },
        {
          play: [{ card: ally, damage: 1 }, calhounMarineSergeant],
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(cheshireCatInexplicable),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(bagEffect!.sourceId, {
          resolveOptional: true,
          targets: [ally, calhounMarineSergeant],
          amount: 1,
        }),
      ).toBeSuccessfulCommand();

      // Source loses the damage counter
      expect(testEngine.asPlayerOne().getDamage(ally)).toBe(0);
      // Destination: Calhoun has Resist +1 but move-damage bypasses it — he takes 1 damage
      expect(testEngine.asPlayerTwo().getDamage(calhounMarineSergeant)).toBe(1);
    });

    it("auto-declines when no opposing characters are in play (THE-1035 G-01)", () => {
      // With no opposing characters in play, the optional has no valid 'to' targets
      // and should auto-decline without hanging.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [cheshireCatInexplicable],
          inkwell: 2,
          deck: [deckFiller],
        },
        {
          play: [],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(cheshireCatInexplicable),
      ).toBeSuccessfulCommand();

      // No opposing characters → optional auto-declines; bag should be empty.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does not freeze when source character has zero damage (THE-1035 G-02)", () => {
      const undamagedSource = createMockCharacter({
        id: "cheshire-undamaged-source",
        name: "Undamaged Source",
        cost: 2,
        strength: 2,
        willpower: 4,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [cheshireCatInexplicable, undamagedSource],
          inkwell: 2,
          deck: [deckFiller],
        },
        {
          play: [opposingTarget],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(cheshireCatInexplicable),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      if (bagEffect) {
        // Player can still accept and pick the undamaged source (amount = 0 = no-op).
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(bagEffect.sourceId, {
            resolveOptional: true,
            targets: [undamagedSource, opposingTarget],
            amount: 0,
          }),
        ).toBeSuccessfulCommand();
      }

      // Target should have 0 damage regardless.
      expect(testEngine.asPlayerOne().getDamage(opposingTarget)).toBe(0);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("planner enumerates a usable resolveBag candidate when no damage exists anywhere (regression: bugrepeC0YFNhAyqyulBLpwiHWT — bot freeze)", () => {
      // Mirrors the reported bot-freeze scenario: Cheshire Cat triggers
      // IT'S LOADS OF FUN with the optional move-damage; nothing on the board
      // has damage. The bot must be able to enumerate at least one resolveBag
      // candidate so the planner can advance (auto-decline or fizzle).
      const undamagedAlly = createMockCharacter({
        id: "cheshire-bot-undamaged-ally",
        name: "Undamaged Ally",
        cost: 2,
        strength: 2,
        willpower: 4,
      });
      const undamagedOpponent = createMockCharacter({
        id: "cheshire-bot-undamaged-opponent",
        name: "Undamaged Opponent",
        cost: 2,
        strength: 2,
        willpower: 4,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: cheshireCatInexplicable, isDrying: false },
            { card: undamagedAlly, isDrying: false },
          ],
          inkwell: 2,
          deck: [deckFiller],
        },
        {
          play: [{ card: undamagedOpponent, isDrying: false }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(cheshireCatInexplicable),
      ).toBeSuccessfulCommand();

      // The planner must produce at least one resolveBag candidate so the bot
      // has something to take. Zero candidates here is the freeze condition.
      const bagCandidates = testEngine
        .asPlayerOne()
        .enumerateAutomatedActions()
        .candidates.filter((candidate) => candidate.family === "resolveBag");

      expect(bagCandidates.length).toBeGreaterThan(0);
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [cheshireCatInexplicable],
          inkwell: 2,
          deck: [deckFiller],
        },
        {
          play: [{ card: ally, damage: 2 }, opposingTarget],
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(cheshireCatInexplicable),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(bagEffect!.sourceId, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(ally)).toBe(2);
      expect(testEngine.asPlayerOne().getDamage(opposingTarget)).toBe(0);
    });
  });
});
