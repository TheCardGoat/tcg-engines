import { describe, it, expect } from "vite-plus/test";
import {
  activeResources,
  createMockCommand,
  createMockUnit,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04ReyZaBurrel093 } from "./093-rey-za-burrel.ts";

function effectDamageCommand(amount = 5) {
  return createMockCommand({
    name: `Deal ${amount} Damage`,
    level: 1,
    cost: 1,
    effects: [
      {
        type: "command",
        activation: { timing: ["action"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount,
              target: { owner: "any", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: `【Action】Deal ${amount} damage to 1 Unit.`,
      },
    ],
  });
}

describe("Rey Za Burrel (GD04-093)", () => {
  it("【Burst】adds this card to hand when its controller accepts the revealed Shield prompt", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04ReyZaBurrel093] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: expect.any(String),
      directiveIndex: -1,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getHand()).toHaveLength(1);
  });

  describe("【When Linked】Choose 1 of your (ZAFT) Link Units. During this turn, reduce the next damage it receives by 2.", () => {
    function setup(...commands: ReturnType<typeof effectDamageCommand>[]) {
      const host = createMockUnit({
        name: "ZAFT Link Host",
        traits: ["zaft"],
        hp: 20,
        linkCondition: "[Rey Za Burrel]",
      });
      const engine = GundamTestEngine.create(
        {
          play: [host],
          hand: [gd04ReyZaBurrel093],
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

      expectSuccess(p1.assignPilot(gd04ReyZaBurrel093, hostId));
      expectSuccess(p1.resolveEffect({ targets: [hostId] }));
      expectSuccess(p1.passPhase());

      return { p1, p2, hostId };
    }

    it("reduces the next damage from an enemy effect by 2", () => {
      const damageCommand = effectDamageCommand();
      const { p1, p2, hostId } = setup(damageCommand);

      expectSuccess(p2.playCommand(damageCommand, { targets: [hostId] }));

      expect(p1.getDamage(hostId)).toBe(3);
    });

    it("does not reduce a later damage event in the same turn", () => {
      const firstDamage = effectDamageCommand();
      const secondDamage = effectDamageCommand();
      const { p1, p2, hostId } = setup(firstDamage, secondDamage);

      expectSuccess(p2.playCommand(firstDamage, { targets: [hostId] }));
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.playCommand(secondDamage, { targets: [hostId] }));

      expect(p1.getDamage(hostId)).toBe(8);
    });

    it("does not reduce damage from its controller's own effect", () => {
      const damageCommand = effectDamageCommand();
      const host = createMockUnit({
        name: "ZAFT Link Host",
        traits: ["zaft"],
        hp: 10,
        linkCondition: "[Rey Za Burrel]",
      });
      const engine = GundamTestEngine.create({
        play: [host],
        hand: [gd04ReyZaBurrel093, damageCommand],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04ReyZaBurrel093, hostId));
      expectSuccess(p1.resolveEffect({ targets: [hostId] }));
      expectSuccess(p1.passPhase());
      expectSuccess(engine.asPlayer(PLAYER_TWO).passActionStep());
      expectSuccess(p1.playCommand(damageCommand, { targets: [hostId] }));

      expect(p1.getDamage(hostId)).toBe(5);
    });
  });
});
