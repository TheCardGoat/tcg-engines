import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02ANewSign117 } from "./117-a-new-sign.ts";

describe("A New Sign (GD02-117)", () => {
  it("【Burst】 adds the chosen AEUG Base from trash to hand", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const aeugBase = createMockBase({ traits: ["aeug"] });
    const otherBase = createMockBase({ traits: ["titans"] });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02ANewSign117], trash: [aeugBase, otherBase] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [aeugBaseId, otherBaseId] = p2.getCardsInZone("trash");

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burstChoice = p2.getBoardView().pendingChoice;
    if (burstChoice?.kind !== "optional") {
      throw new Error("Expected A New Sign's visible Burst choice");
    }
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));
    const choice = p2.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible AEUG Base choice");
    }
    expect(choice.legalTargetIds).toEqual([aeugBaseId]);
    expect(choice.legalTargetIds).not.toContain(otherBaseId);
    expectSuccess(p2.resolveEffect({ targets: [aeugBaseId!] }));

    expect(p2.getCardZone(aeugBaseId!)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【Main】 draws three, asks which two visible hand cards to discard, and keeps one", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02ANewSign117],
      resourceArea: activeResources(4),
      deck: 4,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible two-card discard choice");
    }
    expect(choice.legalTargetIds).toHaveLength(3);
    const discardedIds = choice.legalTargetIds.slice(0, 2);
    const keptId = choice.legalTargetIds[2]!;
    expectSuccess(p1.resolveEffect({ targets: discardedIds }));

    for (const discardedId of discardedIds) {
      expect(p1.getCardZone(discardedId)).toBe(`trash:${PLAYER_ONE}`);
    }
    expect(p1.getCardZone(keptId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot activate its Main effect during a legally reached Action step", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02ANewSign117],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(gd02ANewSign117), "WRONG_TIMING");
  });

  it("enforces both its printed Lv.4 and active Resource cost 3", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02ANewSign117],
      resourceArea: activeResources(3),
    });
    expectFailure(
      lowLevel.asPlayer(PLAYER_ONE).playCommand(gd02ANewSign117),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowLevel.asPlayer(PLAYER_ONE).getCardZone(gd02ANewSign117)).toBe(`hand:${PLAYER_ONE}`);

    const setup = createMockCommand({
      level: 0,
      cost: 2,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02ANewSign117],
      resourceArea: activeResources(4),
      deck: 3,
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.playCommand(gd02ANewSign117), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02ANewSign117)).toBe(`hand:${PLAYER_ONE}`);
  });
});
