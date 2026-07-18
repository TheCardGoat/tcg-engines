import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { op12KouzukiOden004 } from "../../../../../cards/src/cards/OP12/characters/004-kouzuki-oden.ts";
import { op12Buggy012 } from "../../../../../cards/src/cards/OP12/characters/012-buggy.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-012 Buggy", () => {
  test("gives another Roger Pirates Character Blocker through the opponent's next End Phase", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op12Buggy012],
        character: [op12KouzukiOden004, eb01Doma005],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
        activeDon: op12Buggy012.cost,
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const odenId = engine.findCardInZone("south", "character", op12KouzukiOden004);
    const unrelatedId = engine.findCardInZone("south", "character", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op12Buggy012, "south");
    const buggyId = engine.findCardInZone("south", "character", op12Buggy012);
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Buggy's Blocker target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    const candidates = target.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toContain(odenId);
    expect(candidates).not.toContain(buggyId);
    expect(candidates).not.toContain(unrelatedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [odenId] }, "south");

    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Oden's granted Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(odenId);
    engine.resolveDecision("battleBlocker", { selectedIds: [] }, "south");

    engine.endTurn("north");
    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    expect(() => engine.pendingDecision("battleBlocker", "south")).toThrow();
  });
});
