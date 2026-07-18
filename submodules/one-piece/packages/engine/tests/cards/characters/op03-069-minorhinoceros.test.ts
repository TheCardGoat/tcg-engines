import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01RoronoaZoro001,
  op02Magellan071,
  op03Minorhinoceros069,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function koMinorhinoceros(leaderCardId: typeof op02Magellan071) {
  const engine = OnePieceTestEngine.create(
    {
      leaderCardId,
      character: [{ card: op03Minorhinoceros069, rested: true }],
      hand: [eb01Doma005],
      deck: [eb01Doma005, eb01Doma005],
    },
    { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
    { firstPlayer: "south", activeSeat: "north" },
  );
  const targetId = engine.findCardInZone("south", "character", op03Minorhinoceros069);
  const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
  engine.declareAttack(attackerId, targetId, "north");
  engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
  return engine;
}

describe("OP03-069 Minorhinoceros", () => {
  test("with an included Impel Down Leader draws two, then trashes the chosen hand card", () => {
    const engine = koMinorhinoceros(op02Magellan071);
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Minorhinoceros's hand trash.");
    const selectedId = trash.candidates[0]!.ref.id;
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [selectedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.handCount).toBe(2);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(selectedId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not draw or trash from hand without an Impel Down Leader", () => {
    const engine = koMinorhinoceros(op01RoronoaZoro001);
    const view = engine.getView("south");
    expect(view.players.south.handCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
});
