import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb02RoronoaZoro019,
  op01RoronoaZoro001,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-019 Roronoa Zoro", () => {
  test("rests through a compound Straw Hat Leader and loses Character Rush when the board drops below two", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01RoronoaZoro001,
        hand: [eb02RoronoaZoro019],
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        activeDon: 4,
      },
      {
        character: [
          { card: eb01Doma005, rested: true, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const defeatedId = engine.findCardInZone("north", "character", eb01Doma005);
    const remainingId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(eb02RoronoaZoro019, "south");
    const zoroId = engine.findCardInZone("south", "character", eb02RoronoaZoro019);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [remainingId] }, "south");

    const actions = engine
      .getView("south")
      .decisions.flatMap((decision) => decision.steps)
      .find((step) => step.kind === "chooseAction");
    expect(actions?.kind).toBe("chooseAction");
    if (actions?.kind !== "chooseAction") throw new Error("Expected public action mapping.");
    const zoroAttack = actions.actions.find(
      (action) => action.commandType === "declareAttack" && action.source?.id === zoroId,
    );
    expect(zoroAttack?.targets?.map((target) => target.id)).toEqual(
      expect.arrayContaining([defeatedId, remainingId]),
    );

    engine.declareAttack(attackerId, defeatedId, "south");
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      defeatedId,
    );
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: zoroId,
        targetId: remainingId,
      }).reason,
    ).toBe("The selected attacker cannot attack.");
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
