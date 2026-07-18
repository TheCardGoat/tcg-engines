import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op03Iceburg058, op03PeepleyLulu067 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-058 Iceburg", () => {
  test("cannot attack and can rest itself plus return DON!! to play an included Galley-La Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Iceburg058,
        hand: [op03PeepleyLulu067, eb01Doma005],
        activeDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const playId = engine.findCardInZone("south", "hand", op03PeepleyLulu067);
    const excludedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    const attackFailure = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: engine.leader("south"),
      targetId: engine.leader("north"),
    });
    expect(attackFailure.reason).toBe("The selected attacker cannot attack.");

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const decision = engine.pendingDecision("effectPlaySelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected Iceburg's controller to choose a Galley-La Character.");
    }
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([playId]);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.rested).toBe(true);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(playId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
