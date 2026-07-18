import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op03CharlottePerospero113,
  op03Napoleon117,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-113 Charlotte Perospero", () => {
  test("on K.O. searches an included Big Mom Pirates type and bottoms the remainder", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03CharlottePerospero113, rested: true, playedOnTurn: 0 }],
        deck: [op03Napoleon117, eb01Doma005, eb01Fourtricks025],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const perosperoId = engine.findCardInZone("south", "character", op03CharlottePerospero113);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const compoundTraitId = engine.findCardInZone("south", "deck", op03Napoleon117);
    const firstRemainderId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondRemainderId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.declareAttack(attackerId, perosperoId, "north");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Perospero's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === compoundTraitId)?.legal).toBe(
      true,
    );
    expect(
      search.candidates.find((candidate) => candidate.ref.id === firstRemainderId)?.legal,
    ).toBe(false);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [compoundTraitId] }, "south");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: [secondRemainderId, firstRemainderId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(perosperoId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(compoundTraitId);
    expect(engine.getState().players.south.deck).toEqual([secondRemainderId, firstRemainderId]);
    expect(view.prompts).toHaveLength(0);
  });

  test("on K.O. may reveal no card and orders all three looked cards on the deck bottom", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03CharlottePerospero113, rested: true, playedOnTurn: 0 }],
        deck: [op03Napoleon117, eb01Doma005, eb01Fourtricks025],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const perosperoId = engine.findCardInZone("south", "character", op03CharlottePerospero113);
    const lookedIds = [...engine.getState().players.south.deck];

    engine.declareAttack(attackerId, perosperoId, "north");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");

    const bottomOrder = [...lookedIds].reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(0);
    expect(engine.getState().players.south.deck).toEqual(bottomOrder);
    expect(view.prompts).toHaveLength(0);
  });

  test("trashes a hand card to play the resolving physical card from Trigger", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [eb01Doma005, eb01Fourtricks025],
        life: [op03CharlottePerospero113],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const perosperoId = engine.findCardInZone("north", "life", op03CharlottePerospero113);
    const discardId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const cost = engine.pendingDecision("effectCostTrashFromHand", "north").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Perospero's hand-trash cost.");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.north.characters.some((card) => card?.instanceId === perosperoId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the Trigger hand cost without playing the physical card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [eb01Doma005],
        life: [op03CharlottePerospero113],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const perosperoId = engine.findCardInZone("north", "life", op03CharlottePerospero113);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand).toHaveLength(1);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(perosperoId);
    expect(view.players.north.characters.some((card) => card?.instanceId === perosperoId)).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
