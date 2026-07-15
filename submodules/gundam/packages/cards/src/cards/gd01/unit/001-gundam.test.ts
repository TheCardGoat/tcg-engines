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
import { gd01Gundam001 } from "./001-gundam.ts";
import {
  passTurnThroughPublicMoves,
  resolveUnitBattle,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Gundam (GD01-001)", () => {
  it("repairs only friendly White Base Team Units at the end of its controller's turn", () => {
    const ally = createMockUnit({ traits: ["white base team"], hp: 4 });
    const outsider = createMockUnit({ traits: ["earth federation"], hp: 4 });
    const defenders = Array.from({ length: 3 }, (_, index) =>
      createMockUnit({ name: `Damage Defender ${index + 1}`, ap: 2, hp: 10 }),
    );
    const engine = GundamTestEngine.create(
      {
        play: [gd01Gundam001, ally, outsider],
        shieldArea: [createMockUnit(), createMockUnit(), createMockUnit()],
        deck: 5,
      },
      { play: defenders, deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [gundamId, allyId, outsiderId] = p1.getCardsInZone("battleArea");
    const defenderIds = p2.getCardsInZone("battleArea");

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, defenderIds);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    resolveUnitBattle(engine, PLAYER_ONE, gundamId!, defenderIds[0]!);
    resolveUnitBattle(engine, PLAYER_ONE, allyId!, defenderIds[1]!);
    resolveUnitBattle(engine, PLAYER_ONE, outsiderId!, defenderIds[2]!);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getDamage(gundamId!)).toBe(1);
    expect(p1.getDamage(allyId!)).toBe(1);
    expect(p1.getDamage(outsiderId!)).toBe(2);
  });

  it("draws 1 when paired while 2 other friendly Units are in play", () => {
    const amuro = createMockPilot({ name: "Amuro Ray", level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [amuro],
      play: [gd01Gundam001, createMockUnit(), createMockUnit()],
      resourceArea: activeResources(4),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const before = p1.getBoardView().players[PLAYER_ONE]!;

    expectSuccess(p1.assignPilot(amuro, gd01Gundam001));

    const after = p1.getBoardView().players[PLAYER_ONE]!;
    expect(after.deckCount).toBe(before.deckCount - 1);
    expect(after.handCount).toBe(before.handCount);
  });

  it("does not draw when fewer than 2 other friendly Units are in play", () => {
    const pilot = createMockPilot({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [gd01Gundam001, createMockUnit()],
      resourceArea: activeResources(4),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

    expectSuccess(p1.assignPilot(pilot, gd01Gundam001));

    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore);
  });
});
