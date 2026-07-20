import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13KouzukiOden063 } from "../../../../../cards/src/cards/OP13/characters/063-kouzuki-oden.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-063 Kouzuki Oden", () => {
  test("with a given DON!! may add one rested DON!! on play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13KouzukiOden063],
      character: [{ card: eb01Doma005, attachedDon: 1 }],
      activeDon: op13KouzukiOden063.cost,
    });

    engine.playCard(op13KouzukiOden063, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.restedDon).toBe(op13KouzukiOden063.cost + 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("without a given DON!! skips the on-play DON!! action", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13KouzukiOden063],
      activeDon: op13KouzukiOden063.cost,
    });

    engine.playCard(op13KouzukiOden063, "south");

    const view = engine.getView("south");
    expect(view.players.south.restedDon).toBe(op13KouzukiOden063.cost);
    expect(view.prompts).toHaveLength(0);
  });

  test("can become the target of an opponent's attack as a Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op13KouzukiOden063] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op13KouzukiOden063);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Oden's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(blockerId);
  });
});
