import { describe, expect, test } from "vite-plus/test";
import {
  eb01MsMonday035,
  eb03NicoRobin055,
  op13JewelryBonney100,
  op13PortgasDRouge014,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP13-100 Jewelry Bonney", () => {
  test("maps the optional Trigger-Character reaction, rested-DON count, and recipient", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op13JewelryBonney100,
      hand: [op13PortgasDRouge014],
      activeDon: 1,
      restedDon: 2,
    });
    const rougeId = engine.findCardInZone("south", "hand", op13PortgasDRouge014);

    engine.playCard(op13PortgasDRouge014, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    if (count?.kind !== "chooseOption") throw new Error("Expected Bonney's DON!! count choice.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");

    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recipient?.kind).toBe("selectEntity");
    if (recipient?.kind !== "selectEntity") throw new Error("Expected Bonney's recipient choice.");
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      rougeId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [rougeId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ restedDon: 1 });
    expect(view.players.south.characters[0]?.attachedDon).toBe(2);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("reacts when a Character plays itself from a Life Trigger during its owner's turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb03NicoRobin055, rested: true }] },
      {
        leaderCardId: op13JewelryBonney100,
        life: [eb01MsMonday035],
        character: ["EB01-018"],
        activeDon: 2,
        restedDon: 3,
      },
      { activeSeat: "north" },
    );
    const mondayId = engine.findCardInZone("north", "life", eb01MsMonday035);
    engine.asNorth().attachDon("EB01-018", 2);
    engine
      .asNorth()
      .attack("EB01-018", engine.findCardInZone("south", "character", eb03NicoRobin055));
    // Robin's On K.O. damage activates Monday's Life Trigger on Bonney's turn.
    engine.asSouth().acceptOptional();
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.asNorth().acceptOptional();
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["rested-don:0"] }, "north");
    engine.asNorth().acceptOptional();
    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [mondayId] }, "north");
    const view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === mondayId)?.attachedDon,
    ).toBe(2);
    expect(view.players.north.restedDon).toBe(0);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op13JewelryBonney100,
      hand: [op13PortgasDRouge014],
      character: [{ card: eb01MsMonday035, playedOnTurn: 0 }],
      activeDon: 1,
      restedDon: 2,
    });
    const rougeId = engine.findCardInZone("south", "hand", op13PortgasDRouge014);
    const readyId = engine.findCardInZone("south", "character", eb01MsMonday035);

    engine.playCard(op13PortgasDRouge014, "south");
    const afterPlay = engine.getView("south").players.south;
    const restedAfterPlay = afterPlay.restedDon;
    const activeAfterPlay = afterPlay.activeDon;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(activeAfterPlay);
    expect(view.players.south.restedDon).toBe(restedAfterPlay);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === rougeId)?.attachedDon,
    ).toBe(0);
    expect(view.players.south.leader.attachedDon).toBe(0);
    expect(view.prompts).toHaveLength(0);

    // whenTriggerCharacterPlayed openers include attack; keep subject-bound declareAttack visible.
    engine.declareAttack(readyId, engine.leader("north"), "south");
    expect(engine.getView("south").players.south.restedDon).toBe(restedAfterPlay);
  });
  test("does not react to a Character without a Trigger", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op13JewelryBonney100,
      hand: ["ST02-012"],
      activeDon: 1,
      restedDon: 2,
    });
    engine.playCard("ST02-012", "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getView("south").players.south.restedDon).toBe(3);
    expect(engine.getView("south").players.south.leader.attachedDon).toBe(0);
  });
});
