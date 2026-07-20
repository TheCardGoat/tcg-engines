import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op10Trebol070, op11Doll008, st01Usopp002 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("ST01-002 Usopp", () => {
  test("Life Trigger plays the same physical card", () => {
    const engine = OnePieceTestEngine.create(
      { life: [st01Usopp002] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const usoppId = engine.findCardInZone("south", "life", st01Usopp002);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(usoppId);
    expect(view.players.south.lifeCount).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("with two attached DON!! prevents only 5000-or-more-power Characters from blocking", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: st01Usopp002, playedOnTurn: 0 }], activeDon: 2 },
      { character: [op11Doll008, op10Trebol070] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const usoppId = engine.findCardInZone("south", "character", st01Usopp002);
    const lowBlockerId = engine.findCardInZone("north", "character", op11Doll008);
    const highBlockerId = engine.findCardInZone("north", "character", op10Trebol070);
    engine.attachDon(usoppId, 2, "south");

    engine.declareAttack(usoppId, engine.leader("north"), "south");

    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Usopp's legal blockers.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(lowBlockerId);
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).not.toContain(highBlockerId);
    engine.resolveDecision("battleBlocker", { selectedIds: [lowBlockerId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(lowBlockerId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(highBlockerId);
    expect(view.prompts).toHaveLength(0);
  });

  test("with only one attached DON!! allows the 5000-or-more-power Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: st01Usopp002, playedOnTurn: 0 }], activeDon: 1 },
      { character: [op10Trebol070] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const usoppId = engine.findCardInZone("south", "character", st01Usopp002);
    const highBlockerId = engine.findCardInZone("north", "character", op10Trebol070);
    engine.attachDon(usoppId, 1, "south");

    engine.declareAttack(usoppId, engine.leader("north"), "south");

    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected the high-power Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(highBlockerId);
    engine.resolveDecision("battleBlocker", { selectedIds: [highBlockerId] }, "north");

    const view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === highBlockerId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
