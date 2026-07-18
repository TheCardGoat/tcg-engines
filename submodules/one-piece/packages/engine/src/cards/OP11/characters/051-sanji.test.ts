import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01Hannyabal021,
  eb01MountainGod018,
  op01Shanks120,
  op11CharlotteLola052,
  op11TonyTonyChopper053,
  op14eb04SilversRayleigh108,
} from "@tcg/op-cards";
import { op11Sanji051 } from "../../../../../cards/src/cards/OP11/characters/051-sanji.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-051 Sanji", () => {
  test("after an opponent-effect K.O., plays only a cost-5-or-less Straw Hat Crew Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op11Sanji051],
        deck: [
          op11TonyTonyChopper053,
          op11CharlotteLola052,
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
          eb01Doma005,
        ],
        life: 3,
      },
      {
        leaderCardId: eb01Hannyabal021,
        hand: [op14eb04SilversRayleigh108],
        activeDon: op14eb04SilversRayleigh108.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const sanjiId = engine.findCardInZone("south", "character", op11Sanji051);
    const chopperId = engine.findCardInZone("south", "deck", op11TonyTonyChopper053);
    const wrongTraitId = engine.findCardInZone("south", "deck", op11CharlotteLola052);

    engine.playCard(op14eb04SilversRayleigh108, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [sanjiId] }, "north");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (search?.kind !== "selectEntity") throw new Error("Expected Sanji's play search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === chopperId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongTraitId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [chopperId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Sanji's remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sanjiId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(chopperId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not activate its search after a battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op11Sanji051, rested: true }], deck: [op11TonyTonyChopper053] },
      { character: [{ card: op01Shanks120, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const sanjiId = engine.findCardInZone("south", "character", op11Sanji051);
    const attackerId = engine.findCardInZone("north", "character", op01Shanks120);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.declareAttack(attackerId, sanjiId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sanjiId);
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.prompts).toHaveLength(0);
  });

  test("on play may return a controller-owned base-power-5000-or-less Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op11Sanji051],
      character: [eb01Doma005],
      activeDon: op11Sanji051.cost,
    });
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op11Sanji051, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Sanji's return target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(ownId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(ownId);
    expect(view.prompts).toHaveLength(0);
  });
});
