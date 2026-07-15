import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectCardInTrash,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02DecisiveLastResort111 } from "./111-decisive-last-resort.ts";
describe("Decisive Last Resort (GD02-111)", () => {
  it("【Burst】Choose 1 enemy Unit that is Lv.3 or lower. Deal 2 damage to it.", () => {
    const lowLv = createMockUnit({ level: 3, ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd02DecisiveLastResort111] },
      { play: [lowLv] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [shieldId] = p1.getCardsInZone("shieldArea");
    const [enemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p2.enterBattle(enemyId!, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));
    expect(p1.getBoardView().pendingChoice?.kind).toBe("targetSelection");
    expectSuccess(p1.resolveEffect({ targets: [enemyId!] }));

    expect(p2.getDamage(enemyId!)).toBe(2);
    expect(p1.getCardZone(shieldId!)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("【Main】Exile 6 purple Unit cards from trash, then destroy 1 enemy Unit", () => {
    const purpleUnits = Array.from({ length: 6 }, () =>
      createMockUnit({ color: "purple", ap: 1, hp: 1 }),
    );
    const enemy = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02DecisiveLastResort111],
        trash: purpleUnits,
        resourceArea: activeResources(5),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyId] = p2.getCardsInZone("battleArea");
    const purpleIds = p1.getCardsInZone("trash");
    expect(purpleIds.length).toBe(6);

    expectSuccess(p1.playCommand(gd02DecisiveLastResort111, { targets: [...purpleIds, enemyId!] }));

    // The 6 purple units moved out of trash into the shared removalArea
    // (exile). `removalArea` is not owner-scoped, so query by zone alone.
    const removed = engine.getCardsInZone({ zone: "removalArea" });
    for (const id of purpleIds) expect(removed).toContain(id);
    // The enemy Unit is destroyed (now in its owner's trash).
    expectCardInTrash(engine, enemyId!, p2.playerId);
  });
});
