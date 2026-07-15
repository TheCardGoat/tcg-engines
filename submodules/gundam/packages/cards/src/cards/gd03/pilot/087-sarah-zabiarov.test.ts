import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03SarahZabiarov087 } from "./087-sarah-zabiarov.ts";

describe("Sarah Zabiarov (GD03-087)", () => {
  it("【Burst】 adds this revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03SarahZabiarov087] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03SarahZabiarov087)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【When Linked】 offers and rests an enemy Unit that is Lv.3 or lower", () => {
    const host = createMockUnit({ linkCondition: "[Sarah Zabiarov]" });
    const enemy = createMockUnit({ level: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03SarahZabiarov087],
        play: [host],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03SarahZabiarov087, hostId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.isExhausted(enemyId)).toBe(true);
  });

  it("does not offer an enemy Unit above Lv.3", () => {
    const host = createMockUnit({ linkCondition: "[Sarah Zabiarov]" });
    const enemy = createMockUnit({ level: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03SarahZabiarov087],
        play: [host],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03SarahZabiarov087, hostId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.isExhausted(enemyId)).toBe(false);
  });

  it("does not rest an eligible enemy Unit when Sarah's paired Unit is not linked", () => {
    const host = createMockUnit({ linkCondition: "[Paptimus Scirocco]" });
    const enemy = createMockUnit({ level: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03SarahZabiarov087],
        play: [host],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03SarahZabiarov087, hostId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.isExhausted(enemyId)).toBe(false);
  });
});
