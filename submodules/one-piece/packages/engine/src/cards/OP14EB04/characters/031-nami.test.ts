import { eb01Doma005, eb01MountainGod018, op01Kaido094 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Nami031 } from "../../../../../cards/src/cards/OP14EB04/characters/031-nami.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-031 Nami", () => {
  test("on play rests up to two cost-8-or-less opponents and activates up to five DON!! at end of turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04Nami031],
        activeDon: op14eb04Nami031.cost,
        restedDon: 5,
      },
      { character: [eb01Doma005, eb01MountainGod018, op01Kaido094] },
    );
    const firstId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const expensiveId = engine.findCardInZone("north", "character", op01Kaido094);

    engine.playCard(op14eb04Nami031, "south");
    const rest = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (rest?.kind !== "selectEntity") throw new Error("Expected Nami's rest targets.");
    expect(rest).toMatchObject({ min: 0, max: 2 });
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([firstId, secondId]),
    );
    expect(rest.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [firstId, secondId] }, "south");

    let view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === firstId)?.rested).toBe(
      true,
    );
    expect(
      view.players.north.characters.find((card) => card?.instanceId === secondId)?.rested,
    ).toBe(true);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 9 });

    engine.endTurn("south");
    const count = engine.pendingDecision("effectSetActiveDon", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected Nami's delayed DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1", "2", "3", "4", "5"]);
    engine.resolveDecision("effectSetActiveDon", { optionId: "5" }, "south");

    view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 5, restedDon: 4 });
    expect(view.prompts).toHaveLength(0);
  });

  test("rests as a Blocker and redirects an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04Nami031], hand: [] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }], hand: [] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const namiId = engine.findCardInZone("south", "character", op14eb04Nami031);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Nami's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(namiId);
    engine.resolveDecision("battleBlocker", { selectedIds: [namiId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(namiId);
    expect(view.prompts).toHaveLength(0);
  });
});
