import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op02Hydra090, op02LandOfWano048, op03PortgasDAce001 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-001 Portgas.D.Ace", () => {
  test("trashes only chosen Events and Stages to scale power when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03PortgasDAce001,
        hand: [op02Hydra090, op02LandOfWano048, eb01Doma005],
      },
      { hand: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const eventId = engine.findCardInZone("south", "hand", op02Hydra090);
    const stageId = engine.findCardInZone("south", "hand", op02LandOfWano048);
    const excludedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    const decision = engine.pendingDecision("effectTrashFromHandSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected Ace's controller to choose Event or Stage cards to trash.");
    }
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([eventId, stageId]);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [eventId, stageId] },
      "south",
    );

    expect(engine.pendingDecision("battleCounter", "north")).toBeDefined();
    expect(engine.getView("south").players.south.leader.power).toBe(7000);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual([
      eventId,
      stageId,
    ]);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("lets the attacked Ace's controller scale power before the counter step", () => {
    const engine = OnePieceTestEngine.create(
      {},
      {
        leaderCardId: op03PortgasDAce001,
        hand: [op02Hydra090, op02LandOfWano048, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const eventId = engine.findCardInZone("north", "hand", op02Hydra090);

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [eventId] }, "north");

    expect(engine.pendingDecision("battleCounter", "north")).toBeDefined();
    expect(engine.getView("north").players.north.leader.power).toBe(6000);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      eventId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
