import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd05LandmanRodi065 } from "./065-landman-rodi.ts";

describe("Landman Rodi (GD05-065)", () => {
  it("【During Link】 gives AP+2 during its controller's turn after a legal Tekkadan pairing", () => {
    const pilot = createMockPilot({ traits: ["tekkadan"] });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd05LandmanRodi065],
        resourceArea: activeResources(2),
        deck: 5,
      },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));

    expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(gd05LandmanRodi065.ap + pilot.apBonus + 2);

    passTurnThroughPublicMoves(engine, PLAYER_ONE);

    expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(gd05LandmanRodi065.ap + pilot.apBonus);
  });
});
