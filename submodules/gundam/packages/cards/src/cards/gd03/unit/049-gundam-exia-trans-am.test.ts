import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectCardInTrash,
  expectSuccess,
  getEffectiveStats,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03GundamExiaTransAm049 } from "./049-gundam-exia-trans-am.ts";

describe("Gundam Exia (Trans-Am) (GD03-049)", () => {
  it("has Suppression", () => {
    const engine = GundamTestEngine.create({ play: [gd03GundamExiaTransAm049] });
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    expect(getEffectiveStats(unitId, engine.getG(), framework.cards, framework).keywords).toContain(
      "Suppression",
    );
  });

  function setup({ cbTrashCount = 10 }: { cbTrashCount?: number } = {}) {
    const cbTrash = Array.from({ length: cbTrashCount }, (_, index) =>
      createMockUnit({ name: `CB Trash ${index + 1}`, traits: ["cb"] }),
    );
    const lowHpEnemy = createMockUnit({ name: "Low HP Enemy", ap: 1, hp: 2 });
    const highHpEnemy = createMockUnit({ name: "High HP Enemy", ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd03GundamExiaTransAm049], trash: cbTrash },
      {
        deck: [createMockUnit({ name: "Shield Card" })],
        play: [highHpEnemy, lowHpEnemy],
      },
    );
    seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const exiaId = p1.getCardsInZone("battleArea")[0]!;
    const [highHpEnemyId, lowHpEnemyId] = p2.getCardsInZone("battleArea");

    return { engine, exiaId, highHpEnemyId: highHpEnemyId!, lowHpEnemyId: lowHpEnemyId! };
  }

  it("destroys the lowest-HP enemy Unit after destroying a shield area card with battle damage with 10+ CB cards in trash", () => {
    const { engine, exiaId, highHpEnemyId, lowHpEnemyId } = setup();

    expectSuccess(engine.resolveCombat({ attackerId: exiaId, target: "direct" }));

    expectCardInTrash(engine, lowHpEnemyId, PLAYER_TWO);
    expect(engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")).toContain(highHpEnemyId);
  });

  it("does not destroy an enemy Unit with fewer than 10 CB cards in trash", () => {
    const { engine, exiaId, lowHpEnemyId } = setup({ cbTrashCount: 9 });

    expectSuccess(engine.resolveCombat({ attackerId: exiaId, target: "direct" }));

    expect(engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")).toContain(lowHpEnemyId);
  });
});
