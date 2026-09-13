import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd05FelsiSPlea109 } from "./109-felsi-s-plea.ts";

describe("Felsi's Plea (GD05-109)", () => {
  it("draws after recovering an Academy Unit paired with a Lv.3-or-lower Pilot", () => {
    const pilot = createMockPilot({ level: 3, cost: 0 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot, gd05FelsiSPlea109],
        play: [createMockUnit({ traits: ["academy"], hp: 6 })],
        resourceArea: activeResources(3),
        deck: 5,
      },
      { play: [createMockUnit({ ap: 2 })], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    expectSuccess(p2.enterBattle(enemyId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.playCommand(gd05FelsiSPlea109));
    expectSuccess(p1.resolveEffect({ targets: [unitId] }));

    expect(p1.getHand()).toHaveLength(1);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(4);
  });

  it("recovers but does not draw when the selected Academy Unit has a Lv.4 Pilot", () => {
    const pilot = createMockPilot({ level: 4, cost: 0 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot, gd05FelsiSPlea109],
        play: [createMockUnit({ traits: ["academy"], hp: 6 })],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [createMockUnit({ ap: 2 })], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    expectSuccess(p2.enterBattle(enemyId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.playCommand(gd05FelsiSPlea109));
    expectSuccess(p1.resolveEffect({ targets: [unitId] }));

    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(5);
    expect(p1.getHand()).toHaveLength(0);
  });
});
