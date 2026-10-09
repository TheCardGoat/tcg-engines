import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op02Koby098,
  op09Usopp024,
  op11AfterAllTheseYearsIMLosingMyEdge097,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP11-097 After All These Years I'm Losing My Edge!!!", () => {
  test("Counter counts itself as the tenth trash card before recovering a black cost-3 Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op09Usopp024, playedOnTurn: 0 }] },
      {
        hand: [op11AfterAllTheseYearsIMLosingMyEdge097],
        trash: [op02Koby098, ...Array(8).fill(eb01Doma005)],
        activeDon: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", op09Usopp024);
    const eventId = engine.findCardInZone("north", "hand", op11AfterAllTheseYearsIMLosingMyEdge097);
    const recoveredId = engine.findCardInZone("north", "trash", op02Koby098);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recoveredId] }, "north");
    engine.asNorth().chooseCounter();

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      recoveredId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
    expect(engine.getView("south").players.south.lifeCount).toBeGreaterThanOrEqual(0);
  });
  test("FAQ: recovers the black Character just used as a Counter in the same battle", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
      {
        leaderCardId: "ST01-001",
        hand: ["OP02-098", "OP11-097"],
        trash: Array(8).fill("EB01-005"),
        activeDon: 1,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const counter = e.findCardInZone("north", "hand", "OP02-098"),
      event = e.findCardInZone("north", "hand", "OP11-097");
    e.asSouth().attack(e.findCardInZone("south", "character", "EB01-018"), e.leader("north"));
    e.resolveDecision("battleCounter", { selectedIds: [counter] }, "north");
    e.resolveDecision("battleCounter", { selectedIds: [event] }, "north");
    e.asNorth().chooseTargets(e.leader("north"));
    e.asNorth().chooseTargets(counter);
    expect(e.getView("north").players.north.hand.map((c) => c.instanceId)).toContain(counter);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).not.toContain(counter);
  });
});
