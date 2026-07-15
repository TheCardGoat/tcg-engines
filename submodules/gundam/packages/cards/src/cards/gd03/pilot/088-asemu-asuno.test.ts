import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03AsemuAsuno088 } from "./088-asemu-asuno.ts";

describe("Asemu Asuno (GD03-088)", () => {
  it("【Burst】 adds this revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03AsemuAsuno088] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03AsemuAsuno088)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【During Link】 adds enough AP to destroy a 5-HP defender and Breach its Shield", () => {
    const host = createMockUnit({
      ap: 2,
      hp: 4,
      traits: ["age system"],
      linkCondition: "[Asemu Asuno]",
    });
    const defender = createMockUnit({ ap: 0, hp: 5 });
    const shield = createMockUnit({ name: "Enemy Shield" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03AsemuAsuno088],
        play: [host],
        resourceArea: activeResources(4),
      },
      { play: [{ card: defender, exhausted: true }], shieldArea: [shield] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03AsemuAsuno088, hostId));
    expectSuccess(p1.enterBattle(hostId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    expect(p2.getCardsInZone("trash")).toHaveLength(2);
  });

  it("does not grant the AP or Breach bonus to a linked non-AGE System Unit", () => {
    const host = createMockUnit({
      ap: 2,
      hp: 4,
      traits: ["earth federation"],
      linkCondition: "[Asemu Asuno]",
    });
    const defender = createMockUnit({ ap: 0, hp: 5 });
    const shield = createMockUnit({ name: "Enemy Shield" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03AsemuAsuno088],
        play: [host],
        resourceArea: activeResources(4),
      },
      { play: [{ card: defender, exhausted: true }], shieldArea: [shield] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03AsemuAsuno088, hostId));
    expectSuccess(p1.enterBattle(hostId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardsInZone("battleArea")).toContain(defenderId);
    expect(p2.getDamage(defenderId)).toBe(4);
    expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(1);
  });

  it("does not grant the AP or Breach bonus to an AGE System Unit that is not linked", () => {
    const host = createMockUnit({
      ap: 2,
      hp: 4,
      traits: ["age system"],
      linkCondition: "[Different Pilot]",
    });
    const defender = createMockUnit({ ap: 0, hp: 5 });
    const shield = createMockUnit({ name: "Enemy Shield" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03AsemuAsuno088],
        play: [host],
        resourceArea: activeResources(4),
      },
      { play: [{ card: defender, exhausted: true }], shieldArea: [shield] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03AsemuAsuno088, hostId));
    expectSuccess(p1.enterBattle(hostId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getDamage(defenderId)).toBe(4);
    expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(1);
  });
});
