import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import {
  passTurnThroughPublicMoves,
  resolveUnitBattle,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd05Hashmal006 } from "./006-hashmal.ts";

function setActiveCommand() {
  return createMockCommand({
    name: "Reactivate",
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "setActive",
              target: { owner: "friendly", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "Choose 1 friendly Unit. Set it as active.",
      },
    ],
  });
}

function selfDamageCommand(amount: number) {
  return createMockCommand({
    name: "Damage Friendly Unit",
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

describe("Hashmal (GD05-006)", () => {
  /** @behavioral-proof complete: Unit/shield battle destroys, self/friendly-turn gate, once per turn, Pluma identity, and token-scaled Repair are public. */
  it("deploys an active AP2 HP1 Calamity War Pluma token after destroying an enemy Unit", () => {
    const defender = createMockUnit({ name: "Defender", ap: 0, hp: 1 });
    const engine = GundamTestEngine.create(
      { play: [gd05Hashmal006] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hashmalId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    resolveUnitBattle(engine, PLAYER_ONE, hashmalId, defenderId);

    const [, plumaId] = p1.getCardsInZone("battleArea");
    expect(plumaId).toMatch(/^token_pluma_/);
    expect(p1.getVisibleCard(plumaId!)).toMatchObject({
      effectiveAp: 2,
      effectiveHp: 1,
    });
    expect(p1.isExhausted(plumaId!)).toBe(false);
  });

  it("also deploys Pluma when its direct battle damage destroys a Shield card", () => {
    const shield = createMockUnit({ name: "Shield Card" });
    const engine = GundamTestEngine.create({ play: [gd05Hashmal006] }, { shieldArea: [shield] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hashmalId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(hashmalId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getCardsInZone("battleArea")).toHaveLength(2);
    expect(p2.getCardsInZone("shieldArea")).toHaveLength(0);
  });

  it("deploys only one Pluma after two qualifying destroys in the same turn", () => {
    const ready = setActiveCommand();
    const defenders = [
      createMockUnit({ name: "First Defender", ap: 0, hp: 1 }),
      createMockUnit({ name: "Second Defender", ap: 0, hp: 1 }),
    ];
    const engine = GundamTestEngine.create(
      {
        hand: [ready],
        play: [gd05Hashmal006],
        resourceArea: activeResources(1),
      },
      { play: defenders.map((card) => ({ card, exhausted: true })) },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hashmalId = p1.getCardsInZone("battleArea")[0]!;
    const [firstId, secondId] = p2.getCardsInZone("battleArea");

    resolveUnitBattle(engine, PLAYER_ONE, hashmalId, firstId!);
    expectSuccess(p1.playCommand(ready, { targets: [hashmalId] }));
    resolveUnitBattle(engine, PLAYER_ONE, hashmalId, secondId!);

    expect(
      p1.getCardsInZone("battleArea").filter((id) => id.startsWith("token_pluma_")),
    ).toHaveLength(1);
  });

  it("recovers 1 HP per friendly Calamity War Unit token at end of turn", () => {
    const damage = selfDamageCommand(3);
    const firstToken = createMockUnit({ name: "First Token", traits: ["calamity war"] });
    const secondToken = createMockUnit({ name: "Second Token", traits: ["calamity war"] });
    const engine = GundamTestEngine.create({
      hand: [damage],
      play: [
        gd05Hashmal006,
        { card: firstToken, isToken: true },
        { card: secondToken, isToken: true },
      ],
      resourceArea: activeResources(1),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hashmalId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(damage, { targets: [hashmalId] }));
    expect(p1.getDamage(hashmalId)).toBe(3);
    passTurnThroughPublicMoves(engine, PLAYER_ONE);

    expect(p1.getDamage(hashmalId)).toBe(1);
  });
});
