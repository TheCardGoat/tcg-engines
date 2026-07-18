import { describe, expect, test } from "vite-plus/test";
import { eb01MsMonday035, op13JewelryBonney100, op13PortgasDRouge014 } from "@tcg/op-cards";

import { processEffectAction } from "../../../src/effects/actions.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { moveCard } from "../../../src/state.ts";

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

  test("reacts when a Character plays itself from an activated Life Trigger", () => {
    const engine = OnePieceTestEngine.create(
      {},
      {
        leaderCardId: op13JewelryBonney100,
        hand: [eb01MsMonday035],
        restedDon: 2,
      },
      { activeSeat: "north" },
    );
    const state = engine.getState();
    const mondayId = engine.findCardInZone("north", "hand", eb01MsMonday035);
    moveCard(state, mondayId, "north", "resolution", {
      faceUp: true,
      publicKnowledge: true,
      actor: "north",
    });

    expect(
      processEffectAction(state, "north", mondayId, {
        action: "playThisCard",
      }),
    ).toBe(true);
    expect(
      state.resolutionQueue.some(
        (item) =>
          item.kind === "effectBlock" &&
          item.sourceInstanceId === engine.leader("north") &&
          item.trigger === "whenTriggerCharacterPlayed",
      ),
    ).toBe(true);
    expect(engine.findCardInZone("north", "character", eb01MsMonday035)).toBe(mondayId);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
