import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op12LuffyIsTheManWhoWillBecomeTheKingOfPirates039,
  op12RoronoaZoro020,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP12-039 Luffy Is the Man Who Will Become the King of Pirates!!!", () => {
  test("Main sets only the Roronoa Zoro Leader active after it attacks", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op12RoronoaZoro020,
        hand: [op12LuffyIsTheManWhoWillBecomeTheKingOfPirates039],
        activeDon: 3,
      },
      {},
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    expect(engine.getView("south").players.south.leader.rested).toBe(true);
    engine.playCard(op12LuffyIsTheManWhoWillBecomeTheKingOfPirates039);

    expect(engine.getView("south").players.south.leader.rested).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger gives the chosen Leader +1000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op12LuffyIsTheManWhoWillBecomeTheKingOfPirates039] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    expect(engine.getView("north").players.north.leader.power).toBe(6000);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
