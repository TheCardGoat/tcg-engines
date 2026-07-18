import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op11Caribou083 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-083 Caribou", () => {
  test("trashes two chosen hand cards on play, then can block an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op11Caribou083, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: op11Caribou083.cost,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const firstDiscardId = engine.findCardInZone("south", "hand", eb01Doma005);
    const secondDiscardId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const keptId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op11Caribou083, "south");
    const discard = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(discard).toMatchObject({ kind: "selectEntity", min: 2, max: 2 });
    if (discard?.kind !== "selectEntity") throw new Error("Expected Caribou's discard choice.");
    expect(discard.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstDiscardId,
      secondDiscardId,
      keptId,
    ]);
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [firstDiscardId, secondDiscardId] },
      "south",
    );

    const caribouId = engine.findCardInZone("south", "character", op11Caribou083);
    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDiscardId, secondDiscardId]),
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([keptId]);

    engine.endTurn("south");
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Caribou as Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(caribouId);
    engine.resolveDecision("battleBlocker", { selectedIds: [caribouId] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(caribouId);
  });
});
