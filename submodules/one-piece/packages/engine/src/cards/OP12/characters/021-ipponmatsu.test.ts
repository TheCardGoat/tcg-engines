import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01KouzukiOden001, eb01MountainGod018, op01Izo033 } from "@tcg/op-cards";
import { op12Ipponmatsu021 } from "../../../../../cards/src/cards/OP12/characters/021-ipponmatsu.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-021 Ipponmatsu", () => {
  test("with a Slash Leader and six rested DON!! cannot be rested by an opponent's effect", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op01Izo033], activeDon: op01Izo033.cost },
      {
        leaderCardId: eb01KouzukiOden001,
        character: [op12Ipponmatsu021, eb01Doma005],
        restedDon: 6,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const protectedId = engine.findCardInZone("north", "character", op12Ipponmatsu021);
    const legalId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op01Izo033, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Izo's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(protectedId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(legalId);
  });

  test("can become the new target of an opponent's attack as a Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op12Ipponmatsu021] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op12Ipponmatsu021);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      blockerId,
    );
  });
});
