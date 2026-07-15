import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01Jegan016 } from "./016-jegan.ts";

describe("Jegan (GD01-016)", () => {
  it("deploys for 1 active Resource while 2 Earth Federation Units are in play", () => {
    const priorDeployment = createMockUnit({ level: 1, cost: 2, traits: ["zeon"] });
    const engine = GundamTestEngine.create({
      hand: [priorDeployment, gd01Jegan016],
      play: [
        createMockUnit({ traits: ["earth federation"] }),
        createMockUnit({ traits: ["earth federation"] }),
      ],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(priorDeployment));
    expectSuccess(p1.deployUnit(gd01Jegan016));

    expect(p1.getCardZone(gd01Jegan016)).toBe(`battleArea:${PLAYER_ONE}`);
    const projectedResources = p1.getBoardView().players[PLAYER_ONE]!.resourceArea;
    expect(projectedResources.map((resource) => resource.exhausted)).toEqual([true, true, true]);
  });

  it("requires its printed cost when fewer than 2 Earth Federation Units are in play", () => {
    const priorDeployment = createMockUnit({ level: 1, cost: 2, traits: ["zeon"] });
    const engine = GundamTestEngine.create({
      hand: [priorDeployment, gd01Jegan016],
      play: [
        createMockUnit({ traits: ["earth federation"] }),
        createMockUnit({ traits: ["zeon"] }),
      ],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(priorDeployment));
    expectFailure(p1.deployUnit(gd01Jegan016), "INSUFFICIENT_RESOURCES");

    expect(p1.getCardZone(gd01Jegan016)).toBe(`hand:${PLAYER_ONE}`);
  });
});
