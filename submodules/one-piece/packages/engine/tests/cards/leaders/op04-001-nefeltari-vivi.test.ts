import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04NefeltariVivi001,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-001 Nefeltari Vivi", () => {
  test("cannot attack and can draw before granting Rush to a just-played Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04NefeltariVivi001,
        hand: [eb01Doma005],
        deck: [eb01MountainGod018, eb01Fourtricks025],
        activeDon: 3,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const drawnId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    const leaderAttackFailure = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: engine.leader("south"),
      targetId: engine.leader("north"),
    });
    expect(leaderAttackFailure.reason).toBe("The selected attacker cannot attack.");

    engine.playCard(eb01Doma005, "south");
    const characterId = engine.findCardInZone("south", "character", eb01Doma005);
    const earlyAttackFailure = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: characterId,
      targetId: engine.leader("north"),
    });
    expect(earlyAttackFailure.reason).toBe("The selected attacker cannot attack.");

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    const decision = engine.pendingDecision("effectTargetSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected Nefeltari Vivi's controller to choose a Rush recipient.");
    }
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([characterId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [characterId] }, "south");

    engine.declareAttack(characterId, engine.leader("north"), "south");
    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 3 });
    expect(
      view.players.south.characters.find((card) => card?.instanceId === characterId)?.rested,
    ).toBe(true);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
