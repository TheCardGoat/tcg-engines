import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04LunamariaHawke095 } from "./095-lunamaria-hawke.ts";

describe("Lunamaria Hawke (GD04-095)", () => {
  it("【Burst】adds this card to hand when its controller accepts the revealed Shield prompt", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04LunamariaHawke095] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const shieldId = p1.getCardsInZone("shieldArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getHand()).toContain(shieldId);
  });

  describe("【When Linked】Choose 1 of your (Minerva Squad) Units. During this turn, battle damage it would receive is dealt to this Unit instead.", () => {
    function setup(protectedTraits: string[]) {
      const host = createMockUnit({
        name: "Lunamaria Host",
        ap: 1,
        hp: 8,
        linkCondition: "[Lunamaria Hawke]",
      });
      const protectedUnit = createMockUnit({
        name: "Protected Unit",
        traits: protectedTraits,
        hp: 8,
      });
      const enemy = createMockUnit({ name: "Enemy Attacker", ap: 2, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04LunamariaHawke095],
          play: [host, protectedUnit],
          resourceArea: activeResources(3),
          deck: 3,
        },
        { play: [{ card: enemy, exhausted: true }], deck: 3 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [hostId, protectedId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04LunamariaHawke095, hostId!));
      if (protectedTraits.includes("minerva squad")) {
        expectSuccess(p1.resolveEffect({ targets: [protectedId!] }));
      }
      expectSuccess(p1.enterBattle(protectedId!, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      return { p1, hostId: hostId!, protectedId: protectedId! };
    }

    it("redirects battle damage from the chosen Minerva Squad Unit to the linked host", () => {
      const { p1, hostId, protectedId } = setup(["minerva squad"]);

      expect(p1.getDamage(protectedId)).toBe(0);
      expect(p1.getDamage(hostId)).toBe(2);
    });

    it("does not redirect damage from a Unit outside the Minerva Squad", () => {
      const { p1, hostId, protectedId } = setup(["zaft"]);

      expect(p1.getDamage(protectedId)).toBe(2);
      expect(p1.getDamage(hostId)).toBe(0);
    });
  });
});
