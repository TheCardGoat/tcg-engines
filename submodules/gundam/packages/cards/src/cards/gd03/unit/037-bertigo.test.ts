import { describe, expect, it } from "vite-plus/test";
import type { UnitCard } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd03Bertigo037 } from "./037-bertigo.ts";

const destroyedEffectUnit = (name: string): UnitCard =>
  createMockUnit({
    name,
    ap: 2,
    hp: 5,
    effects: [
      {
        type: "triggered",
        activation: { timing: ["destroyed"] },
        directives: [{ action: { action: "draw", count: 1 } }],
        sourceText: "【Destroyed】Draw 1.",
      },
    ],
  });

describe("Bertigo (GD03-037)", () => {
  function setup({ enemyHasDestroyedEffect = true }: { enemyHasDestroyedEffect?: boolean } = {}) {
    const pilot = createMockPilot({ name: "Newtype Pilot", traits: ["newtype"] });
    const enemy = enemyHasDestroyedEffect
      ? destroyedEffectUnit("Enemy With Destroyed")
      : createMockUnit({ name: "Enemy Without Destroyed", ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd03Bertigo037],
        resourceArea: activeResources(5),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const bertigoId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, bertigoId));
    engine.getState().ctx.status.activePlayer = PLAYER_ONE as PlayerId;
    engine.getG().turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId: bertigoId,
      attackerPlayerId: PLAYER_ONE,
      target: enemyId,
    };

    return { engine, bertigoId };
  }

  it("gains First Strike during your turn while linked and battling an enemy Unit with a Destroyed effect", () => {
    const { engine, bertigoId } = setup();
    const framework = engine.getRuntime().getFrameworkReadAPI();

    expect(
      getEffectiveStats(bertigoId, engine.getG(), framework.cards, framework).keywords,
    ).toContain("FirstStrike");
  });

  it("does not gain First Strike when the battling enemy has no Destroyed effect", () => {
    const { engine, bertigoId } = setup({ enemyHasDestroyedEffect: false });
    const framework = engine.getRuntime().getFrameworkReadAPI();

    expect(
      getEffectiveStats(bertigoId, engine.getG(), framework.cards, framework).keywords,
    ).not.toContain("FirstStrike");
  });

  it("does not gain First Strike during the opponent's turn", () => {
    const { engine, bertigoId } = setup();
    engine.getState().ctx.status.activePlayer = PLAYER_TWO as PlayerId;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    expect(
      getEffectiveStats(bertigoId, engine.getG(), framework.cards, framework).keywords,
    ).not.toContain("FirstStrike");
  });
});
