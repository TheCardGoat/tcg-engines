import { describe, expect, test } from "vite-plus/test";
import {
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03SSnake059,
  op07Atlas098,
  op07IReQuasarHelllp115,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP07-115 I Re-Quasar Helllp!!", () => {
  test("Counter grants +3000 at the two-Life boundary", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op07IReQuasarHelllp115], life: 2, activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attacker = engine.findCardInZone("south", "character", eb01MountainGod018);
    const event = engine.findCardInZone("north", "hand", op07IReQuasarHelllp115);
    const before = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attacker, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [event] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    expect(engine.getView("north").players.north.lifeCount).toBe(before);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("Life Trigger plays only a cost-5-or-less included Egghead Character from trash", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op07IReQuasarHelllp115],
        trash: [op07Atlas098, eb01Fourtricks025, eb03SSnake059],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attacker = engine.findCardInZone("south", "character", eb01MountainGod018);
    const playId = engine.findCardInZone("north", "trash", op07Atlas098);
    const nonEggheadId = engine.findCardInZone("north", "trash", eb01Fourtricks025);
    const overCostId = engine.findCardInZone("north", "trash", eb03SSnake059);
    engine.declareAttack(attacker, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const play = engine.pendingDecision("effectPlaySelection", "north").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected the Egghead play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(playId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonEggheadId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(overCostId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playId] }, "north");
    expect(
      engine.getView("north").players.north.characters.some((c) => c?.instanceId === playId),
    ).toBe(true);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
