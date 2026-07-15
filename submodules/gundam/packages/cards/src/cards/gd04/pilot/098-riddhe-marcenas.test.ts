import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04RiddheMarcenas098 } from "./098-riddhe-marcenas.ts";

function effectDamageCommand() {
  return createMockCommand({
    name: "Deal 4 Damage",
    level: 1,
    cost: 1,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount: 4,
              target: { owner: "any", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Deal 4 damage to 1 Unit.",
      },
    ],
  });
}

describe("Riddhe Marcenas (GD04-098)", () => {
  it("【Burst】adds this card to hand when its controller accepts the revealed Shield prompt", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04RiddheMarcenas098] },
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

  describe("【During Link】When this Unit receives effect damage from an enemy, reduce it by 2.", () => {
    function setup(linkCondition: string, ...commands: ReturnType<typeof effectDamageCommand>[]) {
      const host = createMockUnit({ name: "Riddhe Host", hp: 20, linkCondition });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04RiddheMarcenas098],
          play: [host],
          resourceArea: activeResources(4),
          deck: 3,
        },
        {
          hand: commands,
          resourceArea: activeResources(commands.length),
          deck: 3,
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04RiddheMarcenas098, hostId));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      return { p1, p2, hostId };
    }

    it("reduces enemy effect damage to the linked Unit by 2", () => {
      const damageCommand = effectDamageCommand();
      const { p1, p2, hostId } = setup("[Riddhe Marcenas]", damageCommand);

      expectSuccess(p2.playCommand(damageCommand, { targets: [hostId] }));

      expect(p1.getDamage(hostId)).toBe(2);
    });

    it("does not consume the constant reduction after one damage event", () => {
      const firstDamage = effectDamageCommand();
      const secondDamage = effectDamageCommand();
      const { p1, p2, hostId } = setup("[Riddhe Marcenas]", firstDamage, secondDamage);

      expectSuccess(p2.playCommand(firstDamage, { targets: [hostId] }));
      expectSuccess(p2.playCommand(secondDamage, { targets: [hostId] }));

      expect(p1.getDamage(hostId)).toBe(4);
    });

    it("does not reduce friendly effect damage", () => {
      const damageCommand = effectDamageCommand();
      const host = createMockUnit({
        name: "Riddhe Host",
        hp: 10,
        linkCondition: "[Riddhe Marcenas]",
      });
      const engine = GundamTestEngine.create({
        hand: [gd04RiddheMarcenas098, damageCommand],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04RiddheMarcenas098, hostId));
      expectSuccess(p1.playCommand(damageCommand, { targets: [hostId] }));

      expect(p1.getDamage(hostId)).toBe(4);
    });

    it("does not reduce damage while paired but not linked", () => {
      const damageCommand = effectDamageCommand();
      const { p1, p2, hostId } = setup("[Different Pilot]", damageCommand);

      expectSuccess(p2.playCommand(damageCommand, { targets: [hostId] }));

      expect(p1.getDamage(hostId)).toBe(4);
    });
  });
});
