import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectAttackRedirectedTo,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02OlbaFrost093 } from "./093-olba-frost.ts";

function destroyPairedEnemy(pilotTraits: string[]) {
  const attacker = createMockUnit({ name: "Olba Host", ap: 3, hp: 6 });
  const defender = createMockUnit({ name: "Paired Defender", ap: 1, hp: 2 });
  const defenderPilot = createMockPilot({
    name: "Defender Pilot",
    traits: pilotTraits,
    level: 1,
    cost: 1,
  });
  const openingShield = createMockUnit({ name: "Opening Shield" });
  const engine = GundamTestEngine.create(
    {
      hand: [gd02OlbaFrost093],
      play: [attacker],
      shieldArea: [openingShield],
      resourceArea: activeResources(3),
      deck: 5,
    },
    {
      hand: [defenderPilot],
      play: [defender],
      resourceArea: activeResources(2),
    },
    { initialActivePlayer: PLAYER_TWO },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const attackerId = p1.getCardsInZone("battleArea")[0]!;
  const defenderId = p2.getCardsInZone("battleArea")[0]!;

  expectSuccess(p2.assignPilot(defenderPilot, defenderId));
  expectSuccess(p2.enterBattle(defenderId, "direct"));
  expectSuccess(p1.passBlock());
  expectSuccess(p1.passBattleAction());
  expectSuccess(p2.passBattleAction());
  passTurnThroughPublicMoves(engine, PLAYER_TWO);
  expectSuccess(p1.assignPilot(gd02OlbaFrost093, attackerId));
  expectSuccess(p1.enterBattle(attackerId, defenderId));
  expectSuccess(p2.passBlock());
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());

  return { p1, p2, defenderId };
}

function fightPairedBlocker(
  options: {
    attackerFirstStrike?: boolean;
    blockerFirstStrike?: boolean;
    attackerAp?: number;
    attackerHp?: number;
    blockerAp?: number;
    blockerHp?: number;
  } = {},
) {
  const attacker = createMockUnit({
    name: "Olba Host",
    ap: options.attackerAp ?? 4,
    hp: options.attackerHp ?? 6,
    ...(options.attackerFirstStrike
      ? { keywordEffects: [{ keyword: "FirstStrike" as const }] }
      : {}),
  });
  const blocker = createMockUnit({
    name: "Paired Blocker",
    ap: options.blockerAp ?? 1,
    hp: options.blockerHp ?? 2,
    keywordEffects: [
      { keyword: "Blocker" as const },
      ...(options.blockerFirstStrike ? [{ keyword: "FirstStrike" as const }] : []),
    ],
  });
  const newtypePilot = createMockPilot({
    name: "Newtype Blocker Pilot",
    traits: ["newtype"],
    level: 1,
    cost: 1,
    apBonus: 0,
    hpBonus: 0,
  });
  const engine = GundamTestEngine.create(
    {
      hand: [gd02OlbaFrost093],
      play: [attacker],
      resourceArea: activeResources(3),
      deck: 5,
    },
    {
      hand: [newtypePilot],
      play: [blocker],
      shieldArea: [createMockUnit({ name: "Opening Shield" })],
      resourceArea: activeResources(1),
    },
    { initialActivePlayer: PLAYER_TWO },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const attackerId = p1.getCardsInZone("battleArea")[0]!;
  const blockerId = p2.getCardsInZone("battleArea")[0]!;

  expectSuccess(p2.assignPilot(newtypePilot, blockerId));
  const blockerPilotId = p2.getPilotId(blockerId)!;
  passTurnThroughPublicMoves(engine, PLAYER_TWO);
  expectSuccess(p1.assignPilot(gd02OlbaFrost093, attackerId));
  const attackerPilotId = p1.getPilotId(attackerId)!;
  const deckBeforeBattle = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

  expectSuccess(p1.enterBattle(attackerId, "direct"));
  expectSuccess(p2.declareBlock(blockerId));
  expectAttackRedirectedTo(engine, blockerId);
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());

  return {
    p1,
    p2,
    attackerId,
    attackerPilotId,
    blockerId,
    blockerPilotId,
    deckBeforeBattle,
  };
}

describe("Olba Frost (GD02-093)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02OlbaFrost093] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burstChoice = p2.getBoardView().pendingChoice;
    if (burstChoice?.kind !== "optional") {
      throw new Error("Expected Olba Frost's visible Burst choice");
    }
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02OlbaFrost093)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("draws when this Unit destroys an enemy paired with a Newtype Pilot by battle", () => {
    const { p1, p2, defenderId } = destroyPairedEnemy(["newtype"]);

    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
  });

  it("draws when this Unit destroys a blocking enemy paired with a Newtype Pilot", () => {
    const { p1, p2, attackerId, blockerId, blockerPilotId, deckBeforeBattle } =
      fightPairedBlocker();

    expect(p2.getCardZone(blockerId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getCardZone(blockerPilotId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p1.getCardZone(attackerId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBeforeBattle - 1);
  });

  it("draws once when First Strike destroys the paired Blocker before it deals damage", () => {
    const { p1, p2, attackerId, blockerId, blockerPilotId, deckBeforeBattle } = fightPairedBlocker({
      attackerFirstStrike: true,
    });

    expect(p2.getCardZone(blockerId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getCardZone(blockerPilotId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p1.getCardZone(attackerId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getDamage(attackerId)).toBe(0);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBeforeBattle - 1);
  });

  it("does not draw when a First Strike Blocker destroys this Unit first", () => {
    const { p1, p2, attackerId, attackerPilotId, blockerId, deckBeforeBattle } = fightPairedBlocker(
      { attackerHp: 4, blockerFirstStrike: true, blockerAp: 5, blockerHp: 6 },
    );

    expect(p1.getCardZone(attackerId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(attackerPilotId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p2.getCardZone(blockerId)).toBe(`battleArea:${PLAYER_TWO}`);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBeforeBattle);
  });

  it("draws exactly once when both this Unit and the paired Blocker are destroyed", () => {
    const { p1, p2, attackerId, attackerPilotId, blockerId, blockerPilotId, deckBeforeBattle } =
      fightPairedBlocker({ attackerAp: 4, attackerHp: 4, blockerAp: 5, blockerHp: 5 });

    expect(p1.getCardZone(attackerId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(attackerPilotId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p2.getCardZone(blockerId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getCardZone(blockerPilotId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBeforeBattle - 1);
  });

  it("does not draw when the destroyed enemy's Pilot is not a Newtype", () => {
    const { p1, p2, defenderId } = destroyPairedEnemy(["oldtype"]);

    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(4);
  });

  it("requires both its printed Lv.3 and one active Resource to be paired", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02OlbaFrost093],
      play: [createMockUnit({ name: "Low-Level Host" })],
      resourceArea: activeResources(2),
    });
    const lowP1 = lowLevel.asPlayer(PLAYER_ONE);
    const lowHostId = lowP1.getCardsInZone("battleArea")[0]!;

    expectFailure(lowP1.assignPilot(gd02OlbaFrost093, lowHostId), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(lowP1.getCardZone(gd02OlbaFrost093)).toBe(`hand:${PLAYER_ONE}`);
    expect(lowP1.getPilotId(lowHostId)).toBeUndefined();

    const setup = createMockCommand({
      name: "Exhaust All Resources",
      level: 0,
      cost: 3,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02OlbaFrost093],
      play: [createMockUnit({ name: "Cost-Gate Host" })],
      resourceArea: activeResources(3),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.assignPilot(gd02OlbaFrost093, hostId), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02OlbaFrost093)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getPilotId(hostId)).toBeUndefined();
  });
});
