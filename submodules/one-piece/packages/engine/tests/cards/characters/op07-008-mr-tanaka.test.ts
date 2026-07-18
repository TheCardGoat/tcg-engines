import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01Nami016, op07MrTanaka008 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-008 Mr. Tanaka", () => {
  test("plays the resolving physical card from Life with its Trigger", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op07MrTanaka008] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const mrTanakaId = engine.findCardInZone("north", "life", op07MrTanaka008);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === mrTanakaId)).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(mrTanakaId);
    expect(view.prompts).toHaveLength(0);
  });

  test("rests as a Blocker and protects the attacked Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07MrTanaka008] },
      { character: [{ card: op01Nami016, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const mrTanakaId = engine.findCardInZone("south", "character", op07MrTanaka008);
    const attackerId = engine.findCardInZone("north", "character", op01Nami016);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Mr. Tanaka as a Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(mrTanakaId);
    engine.resolveDecision("battleBlocker", { selectedIds: [mrTanakaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === mrTanakaId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
