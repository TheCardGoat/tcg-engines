import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  restedResources,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd05AbyssGundamMaMode046 } from "./046-abyss-gundam-ma-mode.ts";
import { gd05GaiaGundamMaMode041 } from "./041-gaia-gundam-ma-mode.ts";

describe("Gaia Gundam (MA Mode) (GD05-041)", () => {
  it("costs 2 less after an opposing player discards through its controller's effect", () => {
    const phantomPainPilot = createMockPilot({ traits: ["phantom pain"] });
    const enemyHand = Array.from({ length: 4 }, (_, index) =>
      createMockUnit({ name: `Enemy hand ${index + 1}` }),
    );
    const engine = GundamTestEngine.create(
      {
        hand: [phantomPainPilot, gd05GaiaGundamMaMode041],
        play: [gd05AbyssGundamMaMode046],
        resourceArea: [...activeResources(2), ...restedResources(2)],
      },
      { hand: enemyHand, deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const abyssId = p1.getCardsInZone("battleArea")[0]!;
    const discardedId = p2.getHand()[0]!;

    expectSuccess(p1.assignPilot(phantomPainPilot, abyssId));
    expectSuccess(p2.resolveEffect({ targets: [discardedId] }));
    expectSuccess(p1.deployUnit(gd05GaiaGundamMaMode041));

    expect(p1.getCardsInZone("battleArea")).toContainEqual(expect.stringContaining("GD05-041"));
    expect(p1.getCardsInZone("resourceArea").every((id) => p1.isExhausted(id))).toBe(true);
  });

  it("still costs 3 before an opposing discard caused by its controller", () => {
    const engine = GundamTestEngine.create({
      hand: [gd05GaiaGundamMaMode041],
      resourceArea: [...activeResources(1), ...restedResources(3)],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.deployUnit(gd05GaiaGundamMaMode041), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd05GaiaGundamMaMode041)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("loses the reduction after the turn in which the opponent discarded", () => {
    const phantomPainPilot = createMockPilot({ traits: ["phantom pain"] });
    const spender = createMockUnit({ name: "Two-cost spender", level: 1, cost: 2 });
    const enemyHand = Array.from({ length: 4 }, (_, index) =>
      createMockUnit({ name: `Enemy hand ${index + 1}` }),
    );
    const engine = GundamTestEngine.create(
      {
        hand: [phantomPainPilot, spender, gd05GaiaGundamMaMode041],
        play: [gd05AbyssGundamMaMode046],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { hand: enemyHand, deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const abyssId = p1.getCardsInZone("battleArea")[0]!;
    const discardedId = p2.getHand()[0]!;

    expectSuccess(p1.assignPilot(phantomPainPilot, abyssId));
    expectSuccess(p2.resolveEffect({ targets: [discardedId] }));
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.deployUnit(spender));
    expectFailure(p1.deployUnit(gd05GaiaGundamMaMode041), "INSUFFICIENT_RESOURCES");
  });
});
