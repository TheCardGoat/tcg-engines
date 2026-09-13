import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05GundamBarbatosLupusRex051 } from "./051-gundam-barbatos-lupus-rex.ts";

function friendlyDamageCommand(amount: number) {
  return createMockCommand({
    name: "Friendly Damage",
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount,
              target: { owner: "friendly", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: `Deal ${amount} damage to 1 friendly Unit.`,
      },
    ],
  });
}

describe("Gundam Barbatos Lupus Rex (GD05-051)", () => {
  /** @behavioral-proof complete: damage-scaled AP, end-turn timing, optional same-target damage/ready, Tekkadan gate, and decline are public. */
  it("increases its AP by the amount of damage it has received", () => {
    const damage = friendlyDamageCommand(2);
    const engine = GundamTestEngine.create({
      hand: [damage],
      play: [gd05GundamBarbatosLupusRex051],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const barbatosId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(damage, { targets: [barbatosId] }));

    expect(p1.getDamage(barbatosId)).toBe(2);
    expect(p1.getVisibleCard(barbatosId)?.effectiveAp).toBe(6);
  });

  it("may deal 1 damage to a rested Tekkadan Unit and set that same Unit active at end of turn", () => {
    const target = createMockUnit({ name: "Tekkadan Target", traits: ["tekkadan"], hp: 4 });
    const engine = GundamTestEngine.create(
      {
        play: [gd05GundamBarbatosLupusRex051, target],
        deck: 5,
      },
      { baseSection: [createMockBase({ hp: 20 })], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [, targetId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(targetId!, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p1.isExhausted(targetId!)).toBe(true);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    const optionalChoice = p1.getBoardView().pendingChoice;
    if (optionalChoice?.kind !== "targetSelection") {
      throw new Error("Expected the optional Tekkadan choice");
    }
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optionalChoice.directiveIndex]: true } }));
    expectSuccess(p1.resolveEffect({ targets: [targetId!] }));

    expect(p1.getDamage(targetId!)).toBe(1);
    expect(p1.isExhausted(targetId!)).toBe(false);
  });

  it("offers only friendly Tekkadan Units for the end-turn effect", () => {
    const tekkadan = createMockUnit({ name: "Tekkadan", traits: ["tekkadan"] });
    const other = createMockUnit({ name: "Other", traits: ["academy"] });
    const engine = GundamTestEngine.create(
      {
        play: [gd05GundamBarbatosLupusRex051, tekkadan, other],
        deck: 5,
      },
      { baseSection: [createMockBase({ hp: 20 })], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [barbatosId, tekkadanId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [barbatosId, tekkadanId],
    });
  });

  it("may decline the end-turn damage and ready effect", () => {
    const target = createMockUnit({ name: "Tekkadan Target", traits: ["tekkadan"] });
    const engine = GundamTestEngine.create(
      {
        play: [gd05GundamBarbatosLupusRex051, target],
        deck: 5,
      },
      { baseSection: [createMockBase({ hp: 20 })], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [, targetId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    const optionalChoice = p1.getBoardView().pendingChoice;
    if (optionalChoice?.kind !== "targetSelection") {
      throw new Error("Expected the optional Tekkadan choice");
    }
    expectSuccess(
      p1.resolveEffect({ optionalAnswers: { [optionalChoice.directiveIndex]: false } }),
    );

    expect(p1.getDamage(targetId!)).toBe(0);
    expect(p1.isExhausted(targetId!)).toBe(false);
  });
});
