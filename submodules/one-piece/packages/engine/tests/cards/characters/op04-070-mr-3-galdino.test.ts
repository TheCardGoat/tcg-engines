import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op04Mr3Galdino070 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-070 Mr.3 (Galdino)", () => {
  test("may return DON!! once per turn to reduce an opposing Character through the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Mr3Galdino070], activeDon: 1 },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const firstAttacker = engine.findCardInZone("north", "character", eb01Doma005);
    const secondAttacker = engine.findCardInZone("north", "character", eb01MountainGod018);
    const targetPower = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === secondAttacker)?.power;

    engine.declareAttack(firstAttacker, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Mr.3's power target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(secondAttacker);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [secondAttacker] }, "south");

    expect(engine.getView("south").players.south.activeDon).toBe(0);
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === secondAttacker)?.power,
    ).toBe((targetPower ?? 0) - 1000);

    engine.declareAttack(secondAttacker, engine.leader("south"), "north");
    expect(
      engine
        .getState()
        .promptQueue.some(
          (prompt) =>
            prompt.status === "pending" && prompt.resolutionContext?.intent === "effectOptional",
        ),
    ).toBe(false);
  });

  test("may decline without returning DON!! or changing power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Mr3Galdino070], activeDon: 1 },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const powerBefore = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === attackerId)?.power;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.activeDon).toBe(1);
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === attackerId)?.power,
    ).toBe(powerBefore);
  });
});
