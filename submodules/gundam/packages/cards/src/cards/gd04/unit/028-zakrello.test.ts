import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd04Zakrello028 } from "./028-zakrello.ts";

describe("Zakrello (GD04-028)", () => {
  it("【Attack】 grants Blocker to a chosen active enemy Unit for the turn", () => {
    const enemy = createMockUnit({ ap: 2, hp: 5 });

    const engine = GundamTestEngine.create({ play: [gd04Zakrello028] }, { play: [enemy] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const zakrelloId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    // Before attack: enemy has no Blocker keyword.
    expect(
      getEffectiveStats(enemyId, engine.getG(), framework.cards, framework).keywords,
    ).not.toContain("Blocker");

    expectSuccess(p1.enterBattle(zakrelloId, "direct"));
    while (engine.getPendingChoice()) {
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    }

    // The grantKeyword directive bound Blocker to the chosen enemy Unit.
    expect(
      getEffectiveStats(enemyId, engine.getG(), framework.cards, framework).keywords,
    ).toContain("Blocker");
  });
});
