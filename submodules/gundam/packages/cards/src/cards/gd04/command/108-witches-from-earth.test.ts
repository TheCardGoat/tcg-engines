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
  restedResources,
} from "@tcg/gundam-engine";
import type { CommandCard } from "@tcg/gundam-types";
import { gd04WitchesFromEarth108 } from "./108-witches-from-earth.ts";

function damageCommand(timing: "main" | "action", owner: "friendly" | "opponent"): CommandCard {
  return createMockCommand({
    level: 1,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: [timing] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount: 3,
              target: { owner, cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: `【${timing === "main" ? "Main" : "Action"}】Deal 3 damage.`,
      },
    ],
  });
}

describe("Witches from Earth (GD04-108)", () => {
  function setup({ useEx = false, canPay = true }: { useEx?: boolean; canPay?: boolean } = {}) {
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
    const academy = createMockUnit({
      name: "Academy Unit",
      traits: ["academy"],
      ap: 1,
      hp: 10,
    });
    const enemy = createMockUnit({ name: "Enemy Counterattacker", ap: 5, hp: 10 });
    const resources = useEx
      ? activeResources(3).map((entry) => ({ ...entry, exhausted: true }))
      : canPay
        ? activeResources(4)
        : restedResources(4);
    const engine = GundamTestEngine.create(
      {
        hand: useEx ? [placeExResource, gd04WitchesFromEarth108] : [gd04WitchesFromEarth108],
        resourceArea: resources,
        play: [academy],
      },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [firstHandCardId, secondHandCardId] = p1.getHand();
    const placeExResourceId = useEx ? firstHandCardId : undefined;
    const commandId = useEx ? secondHandCardId! : firstHandCardId!;
    const academyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    return { p1, p2, academyId, enemyId, commandId, placeExResourceId };
  }

  it("reduces the next battle damage an Academy Unit receives by 2", () => {
    const { p1, p2, academyId, enemyId, commandId } = setup();

    expectSuccess(p1.playCommand(commandId, { targets: [academyId] }));
    expectSuccess(p1.enterBattle(academyId, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getDamage(academyId)).toBe(3);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("uses EX payment to reduce the next damage by 4 instead", () => {
    const { p1, p2, academyId, enemyId, commandId, placeExResourceId } = setup({ useEx: true });

    expectSuccess(p1.playCommand(placeExResourceId!));
    const exResourceId = p1.getCardsInZone("resourceArea").at(-1)!;

    expectSuccess(p1.playCommand(commandId, { targets: [academyId] }));
    expectSuccess(p1.enterBattle(academyId, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getDamage(academyId)).toBe(1);
    expect(p1.getCardZone(exResourceId!)).toBeUndefined();
    expect(p1.getCardsInZone("resourceArea")).not.toContain(exResourceId!);
    expect(p1.getCardsInZone("removalArea")).not.toContain(exResourceId!);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("consumes the reduction on the next damage event only", () => {
    const firstDamage = damageCommand("main", "friendly");
    const secondDamage = damageCommand("main", "friendly");
    const academy = createMockUnit({ traits: ["academy"], hp: 10 });
    const engine = GundamTestEngine.create({
      hand: [gd04WitchesFromEarth108, firstDamage, secondDamage],
      play: [academy],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [commandId, firstDamageId, secondDamageId] = p1.getHand();
    const academyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(commandId!, { targets: [academyId] }));
    expectSuccess(p1.playCommand(firstDamageId!, { targets: [academyId] }));
    expect(p1.getDamage(academyId)).toBe(1);
    expectSuccess(p1.playCommand(secondDamageId!, { targets: [academyId] }));

    expect(p1.getDamage(academyId)).toBe(4);
    expect(p1.getCardZone(commandId!)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("can be played during Action timing and reduces the opponent's next effect damage", () => {
    const enemyDamage = damageCommand("action", "opponent");
    const academy = createMockUnit({ traits: ["academy"], hp: 10 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04WitchesFromEarth108],
        play: [academy],
        resourceArea: activeResources(4),
      },
      { hand: [enemyDamage], resourceArea: activeResources(1) },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const academyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyCommandId = p2.getHand()[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(commandId, { targets: [academyId] }));
    expectSuccess(p2.playCommand(enemyCommandId, { targets: [academyId] }));

    expect(p1.getDamage(academyId)).toBe(1);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot target a friendly non-Academy Unit", () => {
    const nonAcademy = createMockUnit({ traits: ["earth federation"], hp: 5 });
    const engine = GundamTestEngine.create({
      hand: [gd04WitchesFromEarth108],
      resourceArea: activeResources(4),
      play: [nonAcademy],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const nonAcademyId = p1.getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.playCommand(gd04WitchesFromEarth108, { targets: [nonAcademyId] }),
      "INVALID_TARGET",
    );
  });

  it("cannot target an enemy Academy Unit", () => {
    const enemyAcademy = createMockUnit({ traits: ["academy"], hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [gd04WitchesFromEarth108], resourceArea: activeResources(4) },
      { play: [enemyAcademy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyAcademyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.playCommand(gd04WitchesFromEarth108, { targets: [enemyAcademyId] }),
      "INVALID_TARGET",
    );
  });

  it("cannot be played without enough active Resources", () => {
    const { p1, academyId, commandId } = setup({ canPay: false });

    expectFailure(p1.playCommand(commandId, { targets: [academyId] }), "INSUFFICIENT_RESOURCES");
  });

  it("can be paired as Sophie Pulone instead of activating the Command effect", () => {
    const host = createMockUnit({ name: "Pilot Host" });
    const engine = GundamTestEngine.create({
      hand: [gd04WitchesFromEarth108],
      play: [host],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
  });
});
