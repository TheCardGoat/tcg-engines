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
import { gd02HeartSetOnRevenge118 } from "./118-heart-set-on-revenge.ts";

function reachBlockedBattle(attackerHp: number) {
  const blocker = createMockUnit({
    ap: 2,
    hp: 6,
    keywordEffects: [{ keyword: "Blocker" }],
  });
  const attacker = createMockUnit({ ap: 4, hp: attackerHp });
  const engine = GundamTestEngine.create(
    {
      hand: [gd02HeartSetOnRevenge118],
      play: [blocker],
      resourceArea: activeResources(3),
      deck: 3,
    },
    { play: [attacker], deck: 3 },
    { initialActivePlayer: PLAYER_TWO },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const blockerId = p1.getCardsInZone("battleArea")[0]!;
  const attackerId = p2.getCardsInZone("battleArea")[0]!;

  expectSuccess(p2.enterBattle(attackerId, "direct"));
  expectSuccess(p1.declareBlock(blockerId));

  return { p1, p2, blockerId, attackerId };
}

describe("Heart Set on Revenge (GD02-118)", () => {
  it("returns the chosen 4-HP enemy battling a friendly Blocker to its owner's hand", () => {
    const { p1, p2, blockerId, attackerId } = reachBlockedBattle(4);

    expectSuccess(p1.playCommand(gd02HeartSetOnRevenge118));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected the battling enemy Unit choice");
    }
    expect(choice.legalTargetIds).toEqual([attackerId]);
    expectSuccess(p1.resolveEffect({ targets: [attackerId] }));
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getBoardView().pendingCombat).toBeUndefined();
    expect(p2.getCardZone(attackerId)).toBe(`hand:${PLAYER_TWO}`);
    expect(p1.getDamage(blockerId)).toBe(0);
    expect(p1.getCardZone(gd02HeartSetOnRevenge118)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot target a battling enemy Unit with more than 4 HP", () => {
    const { p1, p2, attackerId } = reachBlockedBattle(5);

    expectFailure(p1.playCommand(gd02HeartSetOnRevenge118), "NO_LEGAL_TARGETS");
    expect(p2.getCardZone(attackerId)).toBe(`battleArea:${PLAYER_TWO}`);
  });

  it("can be paired as Ein Dalton instead of activating the Command", () => {
    const host = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd02HeartSetOnRevenge118],
      play: [host],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 4 });
  });

  it("cannot activate during Main", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02HeartSetOnRevenge118],
      resourceArea: activeResources(3),
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).playCommand(gd02HeartSetOnRevenge118),
      "WRONG_TIMING",
    );
  });

  it("enforces its printed Lv.3 and active Resource cost 1 in a legal Action step", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02HeartSetOnRevenge118],
      resourceArea: activeResources(2),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);
    expectSuccess(lowP1.passPhase());
    expectSuccess(lowLevel.asPlayer(PLAYER_TWO).passActionStep());
    expectFailure(lowP1.playCommand(gd02HeartSetOnRevenge118), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02HeartSetOnRevenge118)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      level: 0,
      cost: 3,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02HeartSetOnRevenge118],
      resourceArea: activeResources(3),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    expectSuccess(p1.passPhase());
    expectSuccess(insufficient.asPlayer(PLAYER_TWO).passActionStep());
    expectFailure(p1.playCommand(gd02HeartSetOnRevenge118), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02HeartSetOnRevenge118)).toBe(`hand:${PLAYER_ONE}`);
  });
});
