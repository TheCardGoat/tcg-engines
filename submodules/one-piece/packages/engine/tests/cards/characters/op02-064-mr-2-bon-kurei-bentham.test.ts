import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op02Mr2BonKureiBentham064 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-064 Mr.2.Bon.Kurei (Bentham)", () => {
  test("with DON!!, trashes a hand card, bottom-decks an eligible Character, then bottom-decks itself after battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op02Mr2BonKureiBentham064, attachedDon: 1, playedOnTurn: 0 }],
        hand: [eb01Doma005],
      },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const bentham = engine.findCardInZone("south", "character", op02Mr2BonKureiBentham064);
    const target = engine.findCardInZone("north", "character", eb01Doma005);
    const discarded = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.declareAttack(bentham, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discarded);
    expect(view.players.north.characters.some((card) => card?.instanceId === target)).toBe(false);
    expect(view.players.south.characters.some((card) => card?.instanceId === bentham)).toBe(false);
    expect(engine.getState().players.north.deck.at(-1)).toBe(target);
    expect(engine.getState().players.south.deck.at(-1)).toBe(bentham);
  });

  test("declining the paid attack effect leaves Mr.2 and all Characters in play", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op02Mr2BonKureiBentham064, attachedDon: 1, playedOnTurn: 0 }],
        hand: [eb01Doma005],
      },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const bentham = engine.findCardInZone("south", "character", op02Mr2BonKureiBentham064);
    const target = engine.findCardInZone("north", "character", eb01Doma005);
    const preservedHandCard = engine.findCardInZone("south", "hand", eb01Doma005);
    const southDeckBefore = [...engine.getState().players.south.deck];
    const northDeckBefore = [...engine.getState().players.north.deck];

    engine.declareAttack(bentham, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === bentham)).toBe(true);
    expect(view.players.north.characters.some((card) => card?.instanceId === target)).toBe(true);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(preservedHandCard);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(
      preservedHandCard,
    );
    expect(engine.getState().players.south.deck).toEqual(southDeckBefore);
    expect(engine.getState().players.north.deck).toEqual(northDeckBefore);
  });

  test("the delayed self-return does not move a new incarnation of Mr.2", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op02Mr2BonKureiBentham064, attachedDon: 1, playedOnTurn: 0 }],
        hand: [eb01Doma005],
      },
      {
        character: [{ card: eb01Doma005, rested: true }],
        hand: [eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const bentham = engine.findCardInZone("south", "character", op02Mr2BonKureiBentham064);
    const target = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(bentham, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(engine.pendingDecision("battleCounter", "north")).toBeDefined();

    // Re-entry is not publicly commandable during this battle window. Incrementing the
    // identity counter models the same physical card leaving and returning before cleanup.
    const reincarnatedState = structuredClone(engine.getState());
    reincarnatedState.cards[bentham]!.zoneChangeCounter += 1;
    const reincarnatedEngine = OnePieceTestEngine.fromState(reincarnatedState);
    reincarnatedEngine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    expect(
      reincarnatedEngine
        .getView("south")
        .players.south.characters.some((card) => card?.instanceId === bentham),
    ).toBe(true);
  });
});
