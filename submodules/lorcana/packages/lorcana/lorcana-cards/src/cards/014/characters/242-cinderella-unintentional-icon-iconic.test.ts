import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { cinderellaKnightInTraining } from "../../002/characters/176-cinderella-knight-in-training";
import { cinderellaUnintentionalIcon } from "./157-cinderella-unintentional-icon";
import { cinderellaUnintentionalIconIconic } from "./242-cinderella-unintentional-icon-iconic";

describe("Cinderella - Unintentional Icon (Iconic)", () => {
  it("accepts its end-turn ability on an empty deck before the final loss", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [cinderellaUnintentionalIconIconic], deck: [], inkwell: 2 },
      { deck: 6 },
    );
    const owner = engine.asPlayerOne();
    expect(owner.passTurn()).toBeSuccessfulCommand();
    expect(owner.getBagCount()).toBe(1);
    expect(engine.asServer().getWinner()).toBeUndefined();
    expect(
      owner.resolvePendingByCard(cinderellaUnintentionalIconIconic, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(owner.getBagCount()).toBe(0);
    expect(owner.getPendingEffects()).toHaveLength(0);
    expect(engine.asServer().getWinner()).toBe(PLAYER_TWO);
    expect(engine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(2);
  });

  it("rejects a card below the looked-at pair and permits exact retry", () => {
    const below = createMockCharacter({ id: "iconic-unseen", name: "Unseen", cost: 1 });
    const kept = createMockCharacter({ id: "iconic-looked-kept", name: "Kept", cost: 1 });
    const inked = createMockCharacter({ id: "iconic-looked-inked", name: "Inked", cost: 1 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [cinderellaUnintentionalIconIconic], deck: [below, inked, kept] },
      { deck: 6 },
    );
    const owner = engine.asPlayerOne();
    const before = engine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(owner.passTurn()).toBeSuccessfulCommand();
    expect(
      owner.resolvePendingByCard(cinderellaUnintentionalIconIconic, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      owner.resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [below] },
          { zone: "deck-bottom", cards: [] },
          { zone: "inkwell", cards: [inked] },
        ],
      }).success,
    ).toBe(false);
    expect(engine.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(before);
    expect(engine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(0);
    expect(owner.getPendingEffects()).toHaveLength(1);
    expect(
      owner.resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [kept] },
          { zone: "deck-bottom", cards: [] },
          { zone: "inkwell", cards: [inked] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([below.id, kept.id]);
    expect(owner.getCardZone(inked)).toBe("inkwell");
    expect(owner.getPendingEffects()).toHaveLength(0);
  });

  it("keeps duplicate instances separate and rejects assigning one twice", () => {
    const copy = createMockCharacter({
      id: "iconic-duplicate",
      name: "Copy",
      cost: 1,
      inkable: false,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [cinderellaUnintentionalIconIconic], deck: [copy, copy] },
      { deck: 6 },
    );
    const owner = engine.asPlayerOne();
    const [keptId, inkId] = engine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(keptId).not.toBe(inkId);
    expect(owner.passTurn()).toBeSuccessfulCommand();
    expect(
      owner.resolvePendingByCard(cinderellaUnintentionalIconIconic, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      owner.resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [keptId!] },
          { zone: "deck-bottom", cards: [] },
          { zone: "inkwell", cards: [keptId!] },
        ],
      }).success,
    ).toBe(false);
    expect(engine.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual([keptId!, inkId!]);
    expect(engine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(0);
    expect(owner.getPendingEffects()).toHaveLength(1);
    expect(
      owner.resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [keptId!] },
          { zone: "deck-bottom", cards: [] },
          { zone: "inkwell", cards: [inkId!] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual([keptId!]);
    expect(engine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toEqual([inkId!]);
    expect(engine.isCardFaceDown(inkId!, "inkwell", PLAYER_ONE)).toBe(true);
    expect(owner.isExerted(inkId!)).toBe(true);
    expect(owner.getPendingEffects()).toHaveLength(0);
  });

  for (const isDrying of [false, true]) {
    for (const exerted of [false, true]) {
      it(`Shift inherits drying ${isDrying} and exertion ${exerted} from a real Cinderella`, () => {
        const engine = LorcanaMultiplayerTestEngine.createWithFixture({
          hand: [cinderellaUnintentionalIconIconic],
          play: [{ card: cinderellaKnightInTraining, damage: 1, isDrying, exerted }],
          inkwell: 5,
          deck: 6,
        });
        const owner = engine.asPlayerOne();
        const shiftTarget = engine.findCardInstanceId(
          cinderellaKnightInTraining,
          "play",
          PLAYER_ONE,
        );
        expect(
          owner.playCard(cinderellaUnintentionalIconIconic, {
            cost: { cost: "shift", shiftTarget },
          }),
        ).toBeSuccessfulCommand();
        expect(owner.getAvailableInk(PLAYER_ONE)).toBe(0);
        expect(owner.getDamage(cinderellaUnintentionalIconIconic)).toBe(1);
        expect(owner.isExerted(cinderellaUnintentionalIconIconic)).toBe(exerted);
        expect(owner.getCardZone(cinderellaKnightInTraining)).not.toBe("play");
        expect(owner.quest(cinderellaUnintentionalIconIconic).success).toBe(!isDrying && !exerted);
        expect(engine.getLore(PLAYER_ONE)).toBe(!isDrying && !exerted ? 3 : 0);
      });
    }
  }

  it("rejects Shift without five ink and preserves its damaged exerted base", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cinderellaUnintentionalIconIconic],
      play: [{ card: cinderellaKnightInTraining, damage: 1, exerted: true, isDrying: false }],
      inkwell: 4,
      deck: 6,
    });
    const owner = engine.asPlayerOne();
    const shiftTarget = engine.findCardInstanceId(cinderellaKnightInTraining, "play", PLAYER_ONE);
    expect(
      owner.playCard(cinderellaUnintentionalIconIconic, { cost: { cost: "shift", shiftTarget } })
        .success,
    ).toBe(false);
    expect(owner.getAvailableInk(PLAYER_ONE)).toBe(4);
    expect(owner.getCardZone(cinderellaUnintentionalIconIconic)).toBe("hand");
    expect(owner.getCardZone(cinderellaKnightInTraining)).toBe("play");
    expect(owner.getDamage(cinderellaKnightInTraining)).toBe(1);
    expect(owner.isExerted(cinderellaKnightInTraining)).toBe(true);
    expect(owner.getBagCount()).toBe(0);
  });

  for (const targetOwner of [PLAYER_ONE, PLAYER_TWO]) {
    it(`rejects an invalid Shift target owned by ${targetOwner} without payment`, () => {
      const other = createMockCharacter({
        id: "iconic-shift-wrong-name",
        name: "Other Character",
        cost: 1,
      });
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [cinderellaUnintentionalIconIconic], play: [other], inkwell: 5, deck: 6 },
        { play: [cinderellaKnightInTraining], deck: 6 },
      );
      const target = targetOwner === PLAYER_ONE ? other : cinderellaKnightInTraining;
      const shiftTarget = engine.findCardInstanceId(target, "play", targetOwner);
      const owner = engine.asPlayerOne();
      expect(
        owner.playCard(cinderellaUnintentionalIconIconic, { cost: { cost: "shift", shiftTarget } })
          .success,
      ).toBe(false);
      expect(owner.getAvailableInk(PLAYER_ONE)).toBe(5);
      expect(owner.getCardZone(cinderellaUnintentionalIconIconic)).toBe("hand");
      expect(owner.getCardZone(target)).toBe("play");
      expect(owner.getBagCount()).toBe(0);
    });
  }

  it("requires one ink destination after looking at two and allows a valid retry", () => {
    const kept = createMockCharacter({ id: "iconic-required-kept", name: "Kept", cost: 1 });
    const inked = createMockCharacter({
      id: "iconic-required-ink",
      name: "Uninkable",
      cost: 1,
      inkable: false,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [cinderellaUnintentionalIconIconic], deck: [inked, kept], inkwell: 2 },
      { deck: 6 },
    );
    const owner = engine.asPlayerOne();
    const before = engine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(owner.passTurn()).toBeSuccessfulCommand();
    expect(
      owner.resolvePendingByCard(cinderellaUnintentionalIconIconic, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      owner.resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [kept] },
          { zone: "deck-bottom", cards: [inked] },
          { zone: "inkwell", cards: [] },
        ],
      }).success,
    ).toBe(false);
    expect(engine.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(before);
    expect(engine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(2);
    expect(owner.getPendingEffects()).toHaveLength(1);
    expect(
      owner.resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [kept] },
          { zone: "deck-bottom", cards: [] },
          { zone: "inkwell", cards: [inked] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(owner.getCardZone(inked)).toBe("inkwell");
    expect(engine.isCardFaceDown(before[0]!, "inkwell", PLAYER_ONE)).toBe(true);
    expect(owner.isExerted(inked)).toBe(true);
    expect(owner.getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(owner.getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(owner.isExerted(inked)).toBe(false);
    expect(engine.isCardFaceDown(before[0]!, "inkwell", PLAYER_ONE)).toBe(true);
    expect(owner.getPendingEffects()).toHaveLength(0);
  });

  it("normal inking does not create Bespoke Design", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [cinderellaUnintentionalIconIconic], deck: 6 },
      { deck: 6 },
    );
    const owner = engine.asPlayerOne();
    expect(
      owner.putIntoInkwell(PLAYER_ONE, cinderellaUnintentionalIconIconic),
    ).toBeSuccessfulCommand();
    expect(owner.getCardZone(cinderellaUnintentionalIconIconic)).toBe("inkwell");
    expect(owner.getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(owner.getBagCount()).toBe(0);
    expect(owner.passTurn()).toBeSuccessfulCommand();
    expect(owner.getPendingEffects()).toHaveLength(0);
    expect(engine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(1);
  });

  it("rejects a six-ink normal play without moving or paying", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cinderellaUnintentionalIconIconic],
      inkwell: 6,
      deck: 6,
    });
    const owner = engine.asPlayerOne();
    expect(owner.playCard(cinderellaUnintentionalIconIconic).success).toBe(false);
    expect(owner.getCardZone(cinderellaUnintentionalIconIconic)).toBe("hand");
    expect(owner.getAvailableInk(PLAYER_ONE)).toBe(6);
    expect(owner.getBagCount()).toBe(0);
  });

  it("uses Player Two's deck and inkwell on Player Two's end turn", () => {
    const kept = createMockCharacter({ id: "iconic-p2-kept", name: "Kept", cost: 1 });
    const inked = createMockCharacter({
      id: "iconic-p2-inked",
      name: "Inked",
      cost: 1,
      inkable: false,
    });
    const drawn = createMockCharacter({ id: "iconic-p2-drawn", name: "Drawn", cost: 1 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6, inkwell: 1 },
      { play: [cinderellaUnintentionalIconIconic], deck: [inked, kept, drawn], inkwell: 2 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getBagCount()).toBe(0);
    const player = engine.asPlayerTwo();
    expect(player.passTurn()).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(cinderellaUnintentionalIconIconic, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    const deckBefore = engine.getCardInstanceIdsInZone("deck", PLAYER_TWO);
    const inkId = deckBefore[0]!;
    const destinations = [
      { zone: "deck-top", cards: [] },
      { zone: "deck-bottom", cards: [kept] },
      { zone: "inkwell", cards: [inked] },
    ];
    expect(engine.asPlayerOne().resolveNextPending({ destinations }).success).toBe(false);
    expect(engine.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(deckBefore);
    expect(engine.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toHaveLength(2);
    expect(player.getPendingEffects()).toHaveLength(1);
    expect(player.resolveNextPending({ destinations })).toBeSuccessfulCommand();
    expect(player.getCardZone(inked)).toBe("inkwell");
    expect(engine.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toContain(inkId);
    expect(engine.isCardFaceDown(inkId, "inkwell", PLAYER_TWO)).toBe(true);
    expect(player.isExerted(inked)).toBe(true);
    expect(player.getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(engine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(1);
    expect(engine.getCardDefinitionIdsInZone("deck", PLAYER_TWO)).toEqual([kept.id]);
    expect(player.getPendingEffects()).toHaveLength(0);
    expect(player.hasGameEnded()).toBe(false);
  });

  it("declines Bespoke Design without moving deck cards or adding ink", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [cinderellaUnintentionalIconIconic], deck: 6, inkwell: 2 },
      { deck: 6 },
    );
    const deckBefore = engine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    const player = engine.asPlayerOne();
    expect(player.passTurn()).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(cinderellaUnintentionalIconIconic, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(engine.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(deckBefore);
    expect(engine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(2);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(player.getPendingEffects()).toHaveLength(0);
    expect(player.hasGameEnded()).toBe(false);
  });

  it("shifts for five ink onto a ready Cinderella and can quest immediately", () => {
    const base = cinderellaKnightInTraining;
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cinderellaUnintentionalIconIconic],
      play: [{ card: base, isDrying: false, damage: 1 }],
      inkwell: 5,
      deck: 6,
    });
    const shiftTarget = engine.findCardInstanceId(base, "play", PLAYER_ONE);
    const player = engine.asPlayerOne();
    expect(
      player.playCard(cinderellaUnintentionalIconIconic, { cost: { cost: "shift", shiftTarget } }),
    ).toBeSuccessfulCommand();
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(player.getCardZone(base)).not.toBe("play");
    expect(player.getCard(cinderellaUnintentionalIconIconic).damage).toBe(1);
    expect(player.quest(cinderellaUnintentionalIconIconic)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(3);
    expect(player.isExerted(cinderellaUnintentionalIconIconic)).toBe(true);
  });

  it("can keep its only deck card without being forced to add ink", () => {
    const onlyCard = createMockCharacter({
      id: "iconic-cinderella-only",
      name: "Only Card",
      cost: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [cinderellaUnintentionalIconIconic], deck: [onlyCard], inkwell: 2 },
      { deck: 6 },
    );
    const player = engine.asPlayerOne();
    expect(player.passTurn()).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(cinderellaUnintentionalIconIconic, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      player.resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [onlyCard] },
          { zone: "deck-bottom", cards: [] },
          { zone: "inkwell", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([onlyCard.id]);
    expect(engine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(2);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(player.getPendingEffects()).toHaveLength(0);
    expect(player.hasGameEnded()).toBe(false);
  });

  for (const keptZone of ["deck-top", "deck-bottom"] as const) {
    it(`Bespoke Design keeps one card on ${keptZone} and inks the other facedown and exerted`, () => {
      const below = createMockCharacter({ id: "iconic-cinderella-below", name: "Below", cost: 1 });
      const kept = createMockCharacter({ id: "iconic-cinderella-kept", name: "Kept", cost: 1 });
      const inked = createMockCharacter({ id: "iconic-cinderella-inked", name: "Inked", cost: 1 });
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [cinderellaUnintentionalIconIconic], deck: [below, inked, kept], inkwell: 2 },
        { deck: 6 },
      );
      const inkId = engine.getCardInstanceIdsInZone("deck", PLAYER_ONE)[1]!;
      const player = engine.asPlayerOne();
      expect(player.passTurn()).toBeSuccessfulCommand();
      expect(
        player.resolvePendingByCard(cinderellaUnintentionalIconIconic, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        player.resolveNextPending({
          destinations: [
            { zone: "deck-top", cards: keptZone === "deck-top" ? [kept] : [] },
            { zone: "deck-bottom", cards: keptZone === "deck-bottom" ? [kept] : [] },
            { zone: "inkwell", cards: [inked] },
          ],
        }),
      ).toBeSuccessfulCommand();
      expect(engine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual(
        keptZone === "deck-top" ? [below.id, kept.id] : [kept.id, below.id],
      );
      expect(player.getCardZone(inked)).toBe("inkwell");
      expect(engine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toContain(inkId);
      expect(engine.isCardFaceDown(inkId, "inkwell", PLAYER_ONE)).toBe(true);
      expect(player.isExerted(inked)).toBe(true);
      expect(player.getAvailableInk(PLAYER_ONE)).toBe(2);
      expect(player.getPendingEffects()).toHaveLength(0);
      expect(player.hasGameEnded()).toBe(false);
    });
  }

  it("copies the base card's abilities verbatim (variant rule G-07)", () => {
    expect(cinderellaUnintentionalIconIconic.abilities).toEqual(
      cinderellaUnintentionalIcon.abilities,
    );
  });

  it("is playable from hand for its printed cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cinderellaUnintentionalIconIconic],
      inkwell: cinderellaUnintentionalIconIconic.cost,
      deck: 1,
    });

    expect(
      testEngine.asPlayerOne().playCard(cinderellaUnintentionalIconIconic),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(cinderellaUnintentionalIconIconic)).toBe("play");
    expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().quest(cinderellaUnintentionalIconIconic).success).toBe(false);
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });
});
