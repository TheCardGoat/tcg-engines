import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01StrategicArms108 } from "./108-strategic-arms.ts";

describe("Strategic Arms (GD01-108)", () => {
  it("【Main】 deals 2 damage to every Unit with Blocker on both sides", () => {
    const friendlyBlocker = createMockUnit({ hp: 5, keywordEffects: [{ keyword: "Blocker" }] });
    const friendlyPlain = createMockUnit({ hp: 5 });
    const enemyBlocker = createMockUnit({ hp: 2, keywordEffects: [{ keyword: "Blocker" }] });
    const enemyPlain = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01StrategicArms108],
        play: [friendlyBlocker, friendlyPlain],
        resourceArea: activeResources(6),
      },
      { play: [enemyBlocker, enemyPlain] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [friendlyBlockerId, friendlyPlainId] = p1.getCardsInZone("battleArea");
    const [enemyBlockerId, enemyPlainId] = p2.getCardsInZone("battleArea");
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));

    expect(p1.getDamage(friendlyBlockerId!)).toBe(2);
    expect(p1.getDamage(friendlyPlainId!)).toBe(0);
    expect(p2.getCardZone(enemyBlockerId!)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getDamage(enemyPlainId!)).toBe(0);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("resolves without damaging Units when no Blocker is in play", () => {
    const friendly = createMockUnit({ hp: 5 });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01StrategicArms108],
        play: [friendly],
        resourceArea: activeResources(6),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd01StrategicArms108));

    expect(p1.getDamage(friendlyId)).toBe(0);
    expect(p2.getDamage(enemyId)).toBe(0);
  });

  it("cannot be played in a legally reached Action step", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01StrategicArms108],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(gd01StrategicArms108), "WRONG_TIMING");
  });

  it("cannot be played below its printed Lv.6 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01StrategicArms108],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01StrategicArms108), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01StrategicArms108)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal setup leaves only 5 active Resources", () => {
    const setup = createMockCommand({
      name: "Resource Setup",
      level: 0,
      cost: 1,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [],
          sourceText: "【Main】Do nothing.",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      hand: [setup, gd01StrategicArms108],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [setupId, commandId] = p1.getHand();

    expectSuccess(p1.playCommand(setupId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(5);
    expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
