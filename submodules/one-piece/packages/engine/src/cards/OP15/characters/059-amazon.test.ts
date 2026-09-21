import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op15Amazon059 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

const OPPONENTS_TURN = { firstPlayer: "south", activeSeat: "north" } as const;

describe("OP15-059 Amazon", () => {
  test("resting it offers the opponent: return 1 DON!!, or eat a -2000 power hit", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op15Amazon059, playedOnTurn: 0 }], activeDon: 2 },
      {
        character: [{ card: eb01Doma005, rested: false, playedOnTurn: 0 }],
        activeDon: 3,
      },
      OPPONENTS_TURN,
    );
    const amazonId = engine.findCardInZone("south", "character", op15Amazon059);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    // The choice belongs to the attacking player.
    const choice = engine.pendingDecision("effectActionChoice", "north").steps[0];
    if (choice?.kind !== "chooseOption") throw new Error("Expected the branch choice.");
    expect(choice.options).toHaveLength(2);
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "north");

    const north = engine.getView("south").players.north;
    expect(north.activeDon).toBe(2);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === amazonId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("the penalty branch debuffs an opposing card by 2000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op15Amazon059, playedOnTurn: 0 }], activeDon: 2 },
      {
        character: [{ card: eb01Doma005, rested: false, playedOnTurn: 0 }],
        activeDon: 3,
      },
      OPPONENTS_TURN,
    );
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the debuff target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [attackerId] }, "south");

    const north = engine.getView("south").players.north;
    expect(north.activeDon).toBe(3);
    expect(north.characters.find((c) => c?.instanceId === attackerId)?.power).toBe(1000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining keeps Amazon active and the opponent's DON!! intact", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op15Amazon059, playedOnTurn: 0 }], activeDon: 2 },
      {
        character: [{ card: eb01Doma005, rested: false, playedOnTurn: 0 }],
        activeDon: 3,
      },
      OPPONENTS_TURN,
    );
    const amazonId = engine.findCardInZone("south", "character", op15Amazon059);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.characters.find((c) => c?.instanceId === amazonId)?.rested).toBe(false);
    expect(engine.getView("south").players.north.activeDon).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
