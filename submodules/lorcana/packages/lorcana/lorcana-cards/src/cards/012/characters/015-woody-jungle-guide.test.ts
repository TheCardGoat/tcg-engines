import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { woodyJungleGuide } from "./015-woody-jungle-guide";
import { bodyguard } from "../../../helpers/abilities/bodyguard";
import { rexProtectiveDinosaur } from "./010-rex-protective-dinosaur";

const toyCharacter = createMockCharacter({
  id: "woody-jg-toy-char",
  name: "Toy Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Ally", "Toy"],
});

const nonToyCharacter = createMockCharacter({
  id: "woody-jg-non-toy-char",
  name: "Non-Toy Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Ally"],
});

const cheapCharacter = createMockCharacter({
  id: "woody-jg-cheap-char",
  name: "Cheap Character",
  cost: 2,
  strength: 1,
  willpower: 1,
});

const expensiveCharacter = createMockCharacter({
  id: "woody-jg-expensive-char",
  name: "Expensive Character",
  cost: 3,
  strength: 2,
  willpower: 2,
});

const cheapBodyguard = createMockCharacter({
  id: "woody-jg-cheap-bodyguard",
  name: "Cheap Bodyguard",
  cost: 2,
  strength: 1,
  willpower: 3,
  abilities: [bodyguard],
});

describe("Woody - Jungle Guide", () => {
  describe("LET'S GET MOVIN' - Whenever this character quests, draw a card. Then, you may play a character with cost 2 or less for free.", () => {
    it("draws a card and lets you play a cost-2-or-less character for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: woodyJungleGuide, isDrying: false }],
          hand: [cheapCharacter],
          inkwell: 0,
          deck: 10,
        },
        { deck: 5 },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count;

      expect(testEngine.asPlayerOne().quest(woodyJungleGuide)).toBeSuccessfulCommand();

      // Resolve draw + optional play for free
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(woodyJungleGuide, {
          resolveOptional: true,
          targets: [cheapCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Drew 1 card and played the cheap character (hand = before + 1 drawn - 1 played)
      expect(testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count).toBe(handBefore);
      expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("play");
    });

    it("can decline to play a character and still draws", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: woodyJungleGuide, isDrying: false }],
          hand: [cheapCharacter],
          deck: 10,
        },
        { deck: 5 },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count;

      expect(testEngine.asPlayerOne().quest(woodyJungleGuide)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(woodyJungleGuide, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Drew one, didn't play the free character
      expect(testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count).toBe(
        handBefore + 1,
      );
      expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("hand");
    });

    it("plays a Bodyguard summoned via the optional in the ready state (CR 8.3.2 default; player choice not yet wired)", () => {
      // CR 8.3.2: Bodyguard "may enter play with the exerted state rather than
      // the ready state." Default is ready. THE-1029 F-03 reports Bodyguards
      // not entering exerted when summoned via Woody — the underlying gap is
      // the missing player-choice prompt, not the default. This test pins the
      // current rule-correct default behaviour; the choice prompt is a
      // separate enhancement.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: woodyJungleGuide, isDrying: false }],
          hand: [cheapBodyguard],
          inkwell: 0,
          deck: 10,
        },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().quest(woodyJungleGuide)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(woodyJungleGuide, {
          resolveOptional: true,
          targets: [cheapBodyguard],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cheapBodyguard)).toBe("play");
      const bodyguardId = testEngine.findCardInstanceId(cheapBodyguard, "play");
      expect(testEngine.asServer().getCard(bodyguardId).exerted).toBe(false);
    });

    it("cleanly resolves with no eligible cost-2-or-less card in hand (THE-1029 F-02)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: woodyJungleGuide, isDrying: false }],
          hand: [expensiveCharacter],
          deck: 10,
        },
        { deck: 5 },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count;

      expect(testEngine.asPlayerOne().quest(woodyJungleGuide)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(woodyJungleGuide, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Drew one card; expensive character stays in hand; turn is not stuck.
      expect(testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count).toBe(
        handBefore + 1,
      );
      expect(testEngine.asPlayerOne().getCardZone(expensiveCharacter)).toBe("hand");
      expect(testEngine.asPlayerOne().getPendingEffects().length).toBe(0);
    });

    it("cannot play a character costing 3+ for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: woodyJungleGuide, isDrying: false }],
          hand: [expensiveCharacter],
          inkwell: 0,
          deck: 10,
        },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().quest(woodyJungleGuide)).toBeSuccessfulCommand();

      // Auto-drain runs the mandatory draw and reaches the optional play-card step.
      // The expensive character (cost 3) does not satisfy the cost-2-or-less
      // restriction, so the optional has no eligible candidates and auto-declines.
      expect(testEngine.asPlayerOne().getCardZone(expensiveCharacter)).toBe("hand");
    });
  });

  describe("LET'S GET MOVIN' + EVERYONE GATHER 'ROUND interaction (player report)", () => {
    it("buffs the freely-played Toy character with Woody's +1 {W} and leaves the turn unblocked", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: woodyJungleGuide, isDrying: false }],
          hand: [toyCharacter],
          inkwell: 0,
          deck: 10,
        },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().quest(woodyJungleGuide)).toBeSuccessfulCommand();

      const toyIdInHand = testEngine.findCardInstanceId(toyCharacter, "hand", "p1");
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(woodyJungleGuide, {
          resolveOptional: true,
          targets: [toyIdInHand],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(toyCharacter)).toBe("play");

      const toyIdInPlay = testEngine.findCardInstanceId(toyCharacter, "play", "p1");
      expect(testEngine.asServer().getCard(toyIdInPlay).willpower).toBe(
        (toyCharacter.willpower ?? 0) + 1,
      );

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    });

    it("prompts player to choose which ≤2-cost character to play when multiple are eligible (does not auto-pick)", () => {
      const altToyCharacter = createMockCharacter({
        id: "woody-jg-toy-char-alt",
        name: "Toy Buddy",
        cost: 2,
        strength: 1,
        willpower: 2,
        classifications: ["Storyborn", "Ally", "Toy"],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: woodyJungleGuide, isDrying: false }],
          hand: [toyCharacter, altToyCharacter, expensiveCharacter],
          inkwell: 0,
          deck: 10,
        },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().quest(woodyJungleGuide)).toBeSuccessfulCommand();

      // Neither eligible card should be in play yet — engine must wait for the player's pick.
      expect(testEngine.asPlayerOne().getCardZone(toyCharacter)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(altToyCharacter)).toBe("hand");

      const altToyId = testEngine.findCardInstanceId(altToyCharacter, "hand", "p1");
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(woodyJungleGuide, {
          resolveOptional: true,
          targets: [altToyId],
        }),
      ).toBeSuccessfulCommand();

      // The chosen card (altToyCharacter), not the first one (toyCharacter), is in play.
      expect(testEngine.asPlayerOne().getCardZone(altToyCharacter)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(toyCharacter)).toBe("hand");

      const inPlayId = testEngine.findCardInstanceId(altToyCharacter, "play", "p1");
      expect(testEngine.asServer().getCard(inPlayId).willpower).toBe(
        (altToyCharacter.willpower ?? 0) + 1,
      );

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    });
  });

  describe("EVERYONE GATHER 'ROUND - Your other Toy characters get +1 {W}.", () => {
    it("grants +1 willpower to other Toy characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [woodyJungleGuide, toyCharacter], deck: 5 },
        { deck: 5 },
      );

      const toyId = testEngine.findCardInstanceId(toyCharacter, "play");
      expect(testEngine.asServer().getCard(toyId).willpower).toBe(
        (toyCharacter.willpower ?? 0) + 1,
      );
    });

    it("does not buff non-Toy characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [woodyJungleGuide, nonToyCharacter], deck: 5 },
        { deck: 5 },
      );

      const nonToyId = testEngine.findCardInstanceId(nonToyCharacter, "play");
      expect(testEngine.asServer().getCard(nonToyId).willpower).toBe(
        nonToyCharacter.willpower ?? 0,
      );
    });

    it("does not buff Woody himself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [woodyJungleGuide], deck: 5 },
        { deck: 5 },
      );

      const woodyId = testEngine.findCardInstanceId(woodyJungleGuide, "play");
      expect(testEngine.asServer().getCard(woodyId).willpower).toBe(woodyJungleGuide.willpower);
    });
  });

  describe("Regression", () => {
    it("plays the only Bodyguard card ready unless the player chooses exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: woodyJungleGuide }],
        hand: [],
        deck: [rexProtectiveDinosaur],
        lore: 0,
      });

      expect(testEngine.asPlayerOne().getCardZone(rexProtectiveDinosaur)).toBe("deck");

      expect(testEngine.asPlayerOne().quest(woodyJungleGuide)).toBeSuccessfulCommand();
      // Given there's only one mandatory trigger being added to the bag, it auto-drains.
      // But given its sequence contains an optional effect, the optional effect needs player's confirmation.
      expect(testEngine.asPlayerOne().getCardZone(rexProtectiveDinosaur)).toBe("hand");

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const rexId = testEngine.findCardInstanceId(rexProtectiveDinosaur, "hand", "p1");

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(woodyJungleGuide, {
          resolveOptional: true,
          targets: [rexId],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(rexProtectiveDinosaur)).toBe("play");
      expect(testEngine.asPlayerOne().isExerted(rexProtectiveDinosaur)).toBe(false);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("surfaces the Bodyguard free-play choice directly as a skippable target selection", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: woodyJungleGuide }],
        hand: [],
        deck: [rexProtectiveDinosaur],
        lore: 0,
      });

      expect(testEngine.asPlayerOne().quest(woodyJungleGuide)).toBeSuccessfulCommand();

      const rexId = testEngine.findCardInstanceId(rexProtectiveDinosaur, "hand", "p1");
      const selectionContext = testEngine.asPlayerOne().getBoard().bagEffects[0]?.selectionContext;

      expect(selectionContext?.kind).toBe("target-selection");
      if (selectionContext?.kind !== "target-selection") {
        throw new Error("Expected Woody's optional Bodyguard play to expose a target selection");
      }

      expect(selectionContext.originatesFromOptional).toBe(true);
      expect(selectionContext.canDeclineSelection).toBe(true);
      expect(selectionContext.cardCandidateIds).toEqual([rexId]);
      expect(selectionContext.playCardEntryModeCandidateIds).toEqual([rexId]);
    });

    it("can play the only Bodyguard card exerted when resolving Woody's free play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: woodyJungleGuide }],
        hand: [],
        deck: [rexProtectiveDinosaur],
        lore: 0,
      });

      expect(testEngine.asPlayerOne().quest(woodyJungleGuide)).toBeSuccessfulCommand();
      const rexId = testEngine.findCardInstanceId(rexProtectiveDinosaur, "hand", "p1");

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(woodyJungleGuide, {
          resolveOptional: true,
          enterPlayExerted: true,
          targets: [rexId],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(rexProtectiveDinosaur)).toBe("play");
      expect(testEngine.asPlayerOne().isExerted(rexProtectiveDinosaur)).toBe(true);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
