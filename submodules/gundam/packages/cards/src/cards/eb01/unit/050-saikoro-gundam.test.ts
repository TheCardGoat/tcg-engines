import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb01SaikoroGundam050 } from "./050-saikoro-gundam.ts";

describe("Saikoro Gundam (EB01-050)", () => {
  /** @behavioral-proof complete: attack mill provenance, Lv.3 gate, enemy choice, AP modifier, and battle duration are public. */
  it("mills a Lv.3 card and gives the chosen enemy Unit AP-2 during that battle", () => {
    const milled = createMockUnit({ name: "Lv.3 Top Card", level: 3 });
    const deckFiller = createMockUnit({ name: "Deck Filler" });
    const firstEnemy = createMockUnit({ name: "First Enemy", ap: 4 });
    const secondEnemy = createMockUnit({ name: "Second Enemy", ap: 4 });
    const engine = GundamTestEngine.create(
      { play: [eb01SaikoroGundam050], deck: [deckFiller, milled] },
      { play: [firstEnemy, secondEnemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const saikoroId = p1.getCardsInZone("battleArea")[0]!;
    const milledId = p1.getCardsInZone("deck")[1]!;
    const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(saikoroId, "direct"));
    expect(p1.getCardZone(milledId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [firstEnemyId, secondEnemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [secondEnemyId!] }));
    expect(p2.getVisibleCard(secondEnemyId!)?.effectiveAp).toBe(2);
    expect(p2.getVisibleCard(firstEnemyId!)?.effectiveAp).toBe(4);

    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getVisibleCard(secondEnemyId!)?.effectiveAp).toBe(4);
  });

  it("mills a Lv.2 card without offering an AP-reduction target", () => {
    const milled = createMockUnit({ name: "Lv.2 Top Card", level: 2 });
    const deckFiller = createMockUnit({ name: "Deck Filler" });
    const enemy = createMockUnit({ name: "Enemy", ap: 4 });
    const engine = GundamTestEngine.create(
      { play: [eb01SaikoroGundam050], deck: [deckFiller, milled] },
      { play: [enemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const saikoroId = p1.getCardsInZone("battleArea")[0]!;
    const milledId = p1.getCardsInZone("deck")[1]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(saikoroId, "direct"));

    expect(p1.getCardZone(milledId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(4);
  });
});
