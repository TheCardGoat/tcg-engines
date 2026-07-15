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
import { gd04IndiscriminateViolence106 } from "./106-indiscriminate-violence.ts";

describe("Indiscriminate Violence (GD04-106)", () => {
  it("【Main】lets the chosen Academy Unit attack an active enemy with 5 AP", () => {
    const academy = createMockUnit({ traits: ["academy"] });
    const eligibleEnemy = createMockUnit({ name: "Eligible Enemy", ap: 5, hp: 6 });
    const highApEnemy = createMockUnit({ name: "High-AP Enemy", ap: 6, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04IndiscriminateViolence106],
        play: [academy],
        resourceArea: activeResources(5),
      },
      { play: [eligibleEnemy, highApEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const academyId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleEnemyId, highApEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(commandId, { targets: [academyId] }));

    expect(p1.getLegalAttackTargets(academyId)).toContain(eligibleEnemyId);
    expect(p1.getLegalAttackTargets(academyId)).not.toContain(highApEnemyId);
    expectSuccess(p1.enterBattle(academyId, eligibleEnemyId!));
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("uses EX payment to grant the option to 2 chosen Academy Units", () => {
    const placeExResource = createMockCommand({
      name: "Place EX Resource",
      level: 0,
      cost: 0,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [{ action: { action: "placeExResource", count: 1, state: "active" } }],
          sourceText: "【Main】Place 1 EX Resource.",
        },
      ],
    });
    const academyOne = createMockUnit({ name: "Academy One", traits: ["academy"] });
    const academyTwo = createMockUnit({ name: "Academy Two", traits: ["academy"] });
    const activeEnemy = createMockUnit({ name: "Active Enemy", ap: 5, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [placeExResource, gd04IndiscriminateViolence106],
        play: [academyOne, academyTwo],
        resourceArea: activeResources(4).map((entry) => ({ ...entry, exhausted: true })),
      },
      { play: [activeEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [placeExResourceId, commandId] = p1.getHand();
    const [academyOneId, academyTwoId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(placeExResourceId!));
    const exResourceId = p1.getCardsInZone("resourceArea").at(-1)!;

    expectSuccess(
      p1.playCommand(commandId!, {
        targets: [academyOneId!, academyTwoId!],
      }),
    );

    expect(p1.getLegalAttackTargets(academyOneId!)).toContain(enemyId);
    expect(p1.getLegalAttackTargets(academyTwoId!)).toContain(enemyId);
    expect(p1.getCardZone(exResourceId)).toBeUndefined();
    expect(p1.getCardsInZone("resourceArea")).not.toContain(exResourceId);
    expect(p1.getCardsInZone("removalArea")).not.toContain(exResourceId);
    expect(p1.getCardZone(commandId!)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("without EX payment, cannot choose 2 Academy Units", () => {
    const academyOne = createMockUnit({ traits: ["academy"] });
    const academyTwo = createMockUnit({ traits: ["academy"] });
    const engine = GundamTestEngine.create({
      hand: [gd04IndiscriminateViolence106],
      play: [academyOne, academyTwo],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [academyOneId, academyTwoId] = p1.getCardsInZone("battleArea");

    expectFailure(
      p1.playCommand(gd04IndiscriminateViolence106, {
        targets: [academyOneId!, academyTwoId!],
      }),
      "INVALID_TARGET",
    );
  });

  it("can be paired as Norea Du Noc instead of activating the Command effect", () => {
    const host = createMockUnit({ name: "Pilot Host" });
    const engine = GundamTestEngine.create({
      hand: [gd04IndiscriminateViolence106],
      play: [host],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
  });
});
