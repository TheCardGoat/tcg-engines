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
import { gd01SecuringTheSupplyLine102 } from "./102-securing-the-supply-line.ts";

function blocker(name: string, level: number) {
  return createMockUnit({
    name,
    level,
    ap: 2,
    hp: 6,
    keywordEffects: [{ keyword: "Blocker" }],
  });
}

describe("Securing the Supply Line (GD01-102)", () => {
  it("【Main】 recovers every friendly Lv.4-or-lower Unit and leaves other Units damaged", () => {
    const low = blocker("Lv.3", 3);
    const boundary = blocker("Lv.4", 4);
    const high = blocker("Lv.5", 5);
    const enemy = blocker("Enemy Lv.3", 3);
    const engine = GundamTestEngine.create(
      {
        hand: [gd01StrategicArms108, gd01SecuringTheSupplyLine102],
        play: [low, boundary, high],
        resourceArea: activeResources(8),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [lowId, boundaryId, highId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[1]!;

    expectSuccess(p1.playCommand(gd01StrategicArms108));
    expectSuccess(p1.playCommand(commandId));

    expect(p1.getDamage(lowId!)).toBe(0);
    expect(p1.getDamage(boundaryId!)).toBe(0);
    expect(p1.getDamage(highId!)).toBe(2);
    expect(p2.getDamage(enemyId)).toBe(2);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot be played in a legally reached Action step", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01SecuringTheSupplyLine102],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(gd01SecuringTheSupplyLine102), "WRONG_TIMING");
  });

  it("cannot be played below its printed Lv.4 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01SecuringTheSupplyLine102],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01SecuringTheSupplyLine102), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01SecuringTheSupplyLine102)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal setup leaves only 1 active Resource", () => {
    const setup = createMockCommand({
      name: "Resource Setup",
      level: 0,
      cost: 3,
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
      hand: [setup, gd01SecuringTheSupplyLine102],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [setupId, commandId] = p1.getHand();

    expectSuccess(p1.playCommand(setupId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(1);
    expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
