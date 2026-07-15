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
import { gd01TheStubbornCog103 } from "./103-the-stubborn-cog.ts";
import { gd01MidairModifications121 } from "./121-midair-modifications.ts";

function blocker(name: string) {
  return createMockUnit({ name, ap: 2, hp: 4, keywordEffects: [{ keyword: "Blocker" }] });
}

describe("Midair Modifications (GD01-121)", () => {
  it("【Burst】 activates Main, readies the attacking Blocker, and prevents another attack", () => {
    const attacker = blocker("Enemy Blocker");
    const engine = GundamTestEngine.create(
      { shieldArea: [gd01MidairModifications121] },
      { play: [attacker], shieldArea: [createMockUnit({ name: "Remaining Shield" })] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [attackerId],
    });
    expectSuccess(p1.resolveEffect({ targets: [attackerId] }));

    expect(p2.isExhausted(attackerId)).toBe(false);
    expectFailure(p2.enterBattle(attackerId, "direct"), "CANNOT_ATTACK");
  });

  it("【Main】 can ready either player's chosen rested Blocker and applies cannot-attack", () => {
    const friendly = createMockUnit({
      name: "Friendly Blocker",
      traits: ["earth federation"],
      ap: 2,
      hp: 4,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const enemy = blocker("Enemy Blocker");
    const engine = GundamTestEngine.create(
      {
        hand: [gd01TheStubbornCog103, gd01MidairModifications121],
        play: [friendly],
        resourceArea: activeResources(3),
      },
      { play: [enemy], shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const [stubbornCogId, midairId] = p1.getHand();

    expectSuccess(p1.playCommand(stubbornCogId!));
    const restChoice = p1.getBoardView().pendingChoice;
    if (restChoice?.kind !== "targetSelection") {
      throw new Error("Expected The Stubborn Cog to ask for its two target groups");
    }
    expectSuccess(p1.resolveEffect({ targets: [friendlyId, enemyId] }));
    expectSuccess(p1.playCommand(midairId!));
    const readyChoice = p1.getBoardView().pendingChoice;
    if (readyChoice?.kind !== "targetSelection") {
      throw new Error("Expected Midair Modifications to ask which rested Blocker to ready");
    }
    expect(readyChoice.legalTargetIds).toEqual(expect.arrayContaining([friendlyId, enemyId]));
    expectSuccess(p1.resolveEffect({ targets: [friendlyId] }));

    expect(p1.isExhausted(friendlyId)).toBe(false);
    expect(p2.isExhausted(enemyId)).toBe(true);
    expectFailure(p1.enterBattle(friendlyId, "direct"), "CANNOT_ATTACK");
  });

  it("rejects an active Blocker and a rested Unit without Blocker", () => {
    const activeBlocker = blocker("Active Blocker");
    const restedPlain = createMockUnit({ keywordEffects: [{ keyword: "Support", value: 1 }] });
    const engine = GundamTestEngine.create({
      hand: [gd01MidairModifications121],
      play: [activeBlocker, restedPlain],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [activeBlockerId, restedPlainId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.useSupport(restedPlainId!, activeBlockerId!));
    expectFailure(
      p1.playCommand(gd01MidairModifications121, { targets: [activeBlockerId!] }),
      "INVALID_TARGET",
    );
    expectFailure(
      p1.playCommand(gd01MidairModifications121, { targets: [restedPlainId!] }),
      "INVALID_TARGET",
    );
  });

  it("cannot use its Main effect in a legally reached Action step", () => {
    const target = blocker("Blocker");
    const engine = GundamTestEngine.create({
      hand: [gd01MidairModifications121],
      play: [target],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const targetId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(
      p1.playCommand(gd01MidairModifications121, { targets: [targetId] }),
      "WRONG_TIMING",
    );
  });

  it("cannot be played below its printed Lv.3 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01MidairModifications121],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01MidairModifications121), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01MidairModifications121)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal setup leaves only 1 active Resource", () => {
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
      hand: [setup, gd01MidairModifications121],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [setupId, commandId] = p1.getHand();

    expectSuccess(p1.playCommand(setupId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(1);
    expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
