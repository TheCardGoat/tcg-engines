import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import type { CommandCard } from "@tcg/gundam-types";
import { gd04NeoZeong033 } from "./033-neo-zeong.ts";

describe("Neo Zeong (GD04-033)", () => {
  function restNeoZeonCommand(): CommandCard {
    return createMockCommand({
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            {
              action: {
                action: "rest",
                target: {
                  owner: "friendly",
                  cardType: "unit",
                  count: 1,
                  attributeFilters: [
                    { attribute: "trait", comparison: "includes", value: "neo zeon" },
                  ],
                },
              },
            },
          ],
          sourceText: "【Main】Rest 1 friendly Neo Zeon Unit.",
        },
      ],
    });
  }

  it("treats every friendly Unit already in play as Neo Zeon while linked", () => {
    const fullFrontal = createMockPilot({
      name: "Full Frontal",
      level: 1,
      cost: 1,
      apBonus: 0,
      hpBonus: 0,
    });
    const civilian = createMockUnit({ name: "Friendly Civilian", traits: ["civilian"] });
    const command = restNeoZeonCommand();
    const engine = GundamTestEngine.create({
      hand: [fullFrontal, command],
      play: [gd04NeoZeong033, civilian],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [neoZeongId, civilianId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(fullFrontal, neoZeongId!));
    expectSuccess(p1.playCommand(command, { targets: [civilianId!] }));

    expect(p1.isExhausted(civilianId!)).toBe(true);
  });

  it("treats a friendly Unit deployed after linking as Neo Zeon", () => {
    const fullFrontal = createMockPilot({
      name: "Full Frontal",
      level: 1,
      cost: 1,
      apBonus: 0,
      hpBonus: 0,
    });
    const civilian = createMockUnit({ name: "Friendly Civilian", traits: ["civilian"] });
    const command = restNeoZeonCommand();
    const enemy = createMockUnit({ name: "Enemy Target", hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [fullFrontal, civilian, command],
        play: [gd04NeoZeong033],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const neoZeongId = p1.getCardsInZone("battleArea")[0]!;
    const civilianId = p1.getHand()[1]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(fullFrontal, neoZeongId));
    expectSuccess(p1.deployUnit(civilianId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      controllerId: PLAYER_ONE,
      sourceCardId: neoZeongId,
      minTargets: 1,
      maxTargets: 1,
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    expectSuccess(p1.playCommand(command, { targets: [civilianId] }));

    expect(p2.getDamage(enemyId)).toBe(3);
    expect(p1.isExhausted(civilianId)).toBe(true);
  });

  it("deals 3 damage when another friendly Neo Zeon Unit is deployed", () => {
    const neoZeonUnit = createMockUnit({ name: "Neo Zeon Reinforcement", traits: ["neo zeon"] });
    const enemy = createMockUnit({ name: "Enemy Target", hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [neoZeonUnit],
        play: [gd04NeoZeong033],
        resourceArea: activeResources(9),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const neoZeongId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(neoZeonUnit));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      controllerId: PLAYER_ONE,
      sourceCardId: neoZeongId,
      minTargets: 1,
      maxTargets: 1,
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(3);
  });

  it("deals 3 damage when this Unit is deployed", () => {
    const enemy = createMockUnit({ name: "Enemy Target", hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04NeoZeong033],
        resourceArea: activeResources(9),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd04NeoZeong033));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      controllerId: PLAYER_ONE,
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(engine.asPlayer(PLAYER_TWO).getDamage(enemyId)).toBe(3);
  });
});
