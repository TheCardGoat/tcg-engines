import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd04FightingAlone119 } from "./119-fighting-alone.ts";

function effectDamageUnit() {
  return createMockUnit({
    name: "Enemy Effect Unit",
    effects: [
      {
        type: "activated",
        activation: { timing: ["activate:action"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount: 2,
              target: { owner: "opponent", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Activate・Action】Deal 2 damage to 1 enemy Unit.",
      },
    ],
  });
}

function effectDamageCommand() {
  return createMockCommand({
    name: "Enemy Damage Command",
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
              amount: 2,
              target: { owner: "opponent", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Action】Deal 2 damage to 1 enemy Unit.",
      },
    ],
  });
}

describe("Fighting Alone (GD04-119)", () => {
  describe("【Main】/【Action】Choose 1 friendly Unit paired with a (Newtype) Pilot. It can't receive effect damage from enemy Units during this turn.", () => {
    function setup({ pilotTrait = "newtype", canPay = true, enemyCommand = false } = {}) {
      const pilot = createMockPilot({
        name: "Test Pilot",
        traits: [pilotTrait],
        level: 1,
        cost: 1,
      });
      const protectedUnit = createMockUnit({ ap: 2, hp: 6 });
      const enemySource = enemyCommand ? effectDamageCommand() : effectDamageUnit();
      const resources = canPay
        ? activeResources(4)
        : [...activeResources(1), ...restedResources(3)];
      const engine = GundamTestEngine.create(
        {
          hand: [gd04FightingAlone119, pilot],
          play: [protectedUnit],
          resourceArea: resources,
          deck: 3,
        },
        enemyCommand
          ? { hand: [enemySource], resourceArea: activeResources(1), deck: 3 }
          : { play: [enemySource], deck: 3 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const protectedId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, protectedId));

      return { p1, p2, commandId, protectedId, enemySource };
    }

    it("prevents effect damage from an enemy Unit after being played during Main", () => {
      const { p1, p2, commandId, protectedId } = setup();
      const enemyUnitId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(commandId, { targets: [protectedId] }));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.activateAbility(enemyUnitId, 0, { targets: [protectedId] }));

      expect(p1.getDamage(protectedId)).toBe(0);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("prevents effect damage after being played through the end-phase Action window", () => {
      const { p1, p2, commandId, protectedId } = setup();
      const enemyUnitId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(commandId, { targets: [protectedId] }));
      expectSuccess(p2.activateAbility(enemyUnitId, 0, { targets: [protectedId] }));

      expect(p1.getDamage(protectedId)).toBe(0);
    });

    it("does not prevent effect damage from an enemy Command", () => {
      const { p1, p2, commandId, protectedId, enemySource } = setup({ enemyCommand: true });

      expectSuccess(p1.playCommand(commandId, { targets: [protectedId] }));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.playCommand(enemySource, { targets: [protectedId] }));

      expect(p1.getDamage(protectedId)).toBe(2);
    });

    it("cannot target a friendly Unit paired with a non-Newtype Pilot", () => {
      const { p1, commandId, protectedId } = setup({ pilotTrait: "civilian" });

      expectFailure(p1.playCommand(commandId, { targets: [protectedId] }), "INVALID_TARGET");
    });

    it("cannot be played without an active Resource remaining after pairing", () => {
      const { p1, commandId, protectedId } = setup({ canPay: false });

      expectFailure(
        p1.playCommand(commandId, { targets: [protectedId] }),
        "INSUFFICIENT_RESOURCES",
      );
    });
  });

  it("can be paired as Gael Chan instead of activating the Command effect", () => {
    const host = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create({
      hand: [gd04FightingAlone119],
      play: [host],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 4 });
  });
});
