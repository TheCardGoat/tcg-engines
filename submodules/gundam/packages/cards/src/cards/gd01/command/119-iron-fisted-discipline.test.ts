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
import { gd01IronFistedDiscipline119 } from "./119-iron-fisted-discipline.ts";

describe("Iron-Fisted Discipline (GD01-119)", () => {
  it("【Main】 gives the chosen enemy Lv.4 Unit AP-2 for the turn", () => {
    const chosen = createMockUnit({ level: 4, ap: 4 });
    const other = createMockUnit({ level: 3, ap: 5 });
    const engine = GundamTestEngine.create(
      { hand: [gd01IronFistedDiscipline119], resourceArea: activeResources(3), deck: 5 },
      { play: [chosen, other], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [chosenId, otherId] = p2.getCardsInZone("battleArea");
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Iron-Fisted Discipline to ask which enemy Unit loses AP");
    }
    expect(choice.legalTargetIds).toContain(chosenId);
    expectSuccess(p1.resolveEffect({ targets: [chosenId!] }));

    expect(p2.getVisibleCard(chosenId!)?.effectiveAp).toBe(2);
    expect(p2.getVisibleCard(otherId!)?.effectiveAp).toBe(5);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expect(p2.getVisibleCard(chosenId!)?.effectiveAp).toBe(4);
  });

  it("can reduce AP during a legally reached Action step", () => {
    const enemy = createMockUnit({ level: 2, ap: 3 });
    const engine = GundamTestEngine.create(
      { hand: [gd01IronFistedDiscipline119], resourceArea: activeResources(3) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(gd01IronFistedDiscipline119));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Iron-Fisted Discipline to ask which enemy Unit loses AP");
    }
    expect(choice.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(1);
  });

  it("rejects an enemy Unit above Lv.4 and a qualifying friendly Unit", () => {
    const friendly = createMockUnit({ level: 4 });
    const enemy = createMockUnit({ level: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01IronFistedDiscipline119],
        play: [friendly],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.playCommand(gd01IronFistedDiscipline119, { targets: [enemyId] }),
      "INVALID_TARGET",
    );
    expectFailure(
      p1.playCommand(gd01IronFistedDiscipline119, { targets: [friendlyId] }),
      "INVALID_TARGET",
    );
  });

  it("plays as Chuatury Panlunch, applies AP+1/HP+0, and forms a Link through her printed name", () => {
    const host = createMockUnit({
      level: 0,
      cost: 0,
      ap: 2,
      hp: 3,
      linkCondition: "[Chuatury Panlunch]",
    });
    const engine = GundamTestEngine.create(
      {
        hand: [host, gd01IronFistedDiscipline119],
        resourceArea: activeResources(2),
      },
      { shieldArea: [createMockUnit({ name: "Shield" })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [hostId, commandId] = p1.getHand();

    expectSuccess(p1.deployUnit(hostId!));
    expectSuccess(p1.playCommandAsPilot(commandId!, hostId!));

    expect(p1.getPilotId(hostId!)).toBe(commandId);
    expect(p1.getCardZone(commandId!)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(hostId!)?.effectiveAp).toBe(3);
    expect(p1.getVisibleCard(hostId!)?.effectiveHp).toBe(3);
    expectSuccess(p1.enterBattle(hostId!, "direct"));
  });

  it("cannot be played below its printed Lv.2 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01IronFistedDiscipline119],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01IronFistedDiscipline119), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01IronFistedDiscipline119)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal setup leaves no active Resources", () => {
    const setup = createMockCommand({
      name: "Resource Setup",
      level: 0,
      cost: 2,
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
      hand: [setup, gd01IronFistedDiscipline119],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [setupId, commandId] = p1.getHand();

    expectSuccess(p1.playCommand(setupId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
