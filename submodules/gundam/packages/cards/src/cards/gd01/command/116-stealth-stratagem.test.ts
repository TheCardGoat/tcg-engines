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
import { gd01StealthStratagem116 } from "./116-stealth-stratagem.ts";

describe("Stealth Stratagem (GD01-116)", () => {
  it("【Main】 deals 2 damage to an enemy Unit at the 2-AP boundary", () => {
    const enemy = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [gd01StealthStratagem116], resourceArea: activeResources(4) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Stealth Stratagem to ask which low-AP enemy Unit receives damage");
    }
    expect(choice.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(2);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("can deal 2 damage during a legally reached Action step", () => {
    const enemy = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [gd01StealthStratagem116], resourceArea: activeResources(4) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(gd01StealthStratagem116));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Stealth Stratagem to ask which low-AP enemy Unit receives damage");
    }
    expect(choice.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(2);
  });

  it("rejects an enemy Unit with 3 AP and a qualifying friendly Unit", () => {
    const friendly = createMockUnit({ ap: 1 });
    const enemy = createMockUnit({ ap: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01StealthStratagem116],
        play: [friendly],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.playCommand(gd01StealthStratagem116, { targets: [enemyId] }),
      "INVALID_TARGET",
    );
    expectFailure(
      p1.playCommand(gd01StealthStratagem116, { targets: [friendlyId] }),
      "INVALID_TARGET",
    );
  });

  it("plays as Nicol Amarfi, applies AP+0/HP+1, and forms a Link through his printed name", () => {
    const host = createMockUnit({
      level: 0,
      cost: 0,
      ap: 2,
      hp: 3,
      linkCondition: "[Nicol Amarfi]",
    });
    const engine = GundamTestEngine.create(
      {
        hand: [host, gd01StealthStratagem116],
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
    expect(p1.getVisibleCard(hostId!)?.effectiveAp).toBe(2);
    expect(p1.getVisibleCard(hostId!)?.effectiveHp).toBe(4);
    expectSuccess(p1.enterBattle(hostId!, "direct"));
  });

  it("cannot be played below its printed Lv.2 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01StealthStratagem116],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01StealthStratagem116), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01StealthStratagem116)).toBe(`hand:${PLAYER_ONE}`);
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
      hand: [setup, gd01StealthStratagem116],
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
