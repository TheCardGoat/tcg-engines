import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op03Iceburg058, op04Iceburg059 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function opponentAttacks(leaderCardId?: typeof op03Iceburg058) {
  const engine = OnePieceTestEngine.create(
    {
      ...(leaderCardId ? { leaderCardId } : {}),
      character: [op04Iceburg059],
      activeDon: 2,
    },
    { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
    { firstPlayer: "south", activeSeat: "north" },
  );
  const iceburgId = engine.findCardInZone("south", "character", op04Iceburg059);
  const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
  engine.declareAttack(attackerId, engine.leader("south"), "north");
  return { engine, iceburgId };
}

describe("OP04-059 Iceburg", () => {
  test("may return DON!! to gain Blocker before the attack reaches the Block Step", () => {
    const { engine, iceburgId } = opponentAttacks(op03Iceburg058);
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Iceburg's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(iceburgId);
    engine.resolveDecision("battleBlocker", { selectedIds: [iceburgId] }, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 1,
      donDeckCount: donDeckBefore + 1,
      lifeCount: lifeBefore,
    });
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline without returning DON!! or gaining Blocker", () => {
    const { engine, iceburgId } = opponentAttacks(op03Iceburg058);
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(2);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === iceburgId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay with a non-Water Seven Leader but gains no Blocker", () => {
    const { engine } = opponentAttacks();
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 1,
      lifeCount: lifeBefore - 1,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("is not offered without a DON!! card to return", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Iceburg058,
        character: [op04Iceburg059],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
