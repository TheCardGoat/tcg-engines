import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03InfiltratorPresent111 } from "./111-infiltrator-present.ts";

describe("Infiltrator Present (GD03-111)", () => {
  it("【Main】 gives a friendly Mafty Unit AP+3 only during the current turn", () => {
    const mafty = createMockUnit({ traits: ["mafty"], ap: 2, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03InfiltratorPresent111],
        play: [mafty],
        resourceArea: activeResources(3),
        deck: 3,
      },
      { deck: 3 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(commandId, { targets: [unitId] }));

    expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(5);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(2);
  });

  it("【Action】 gives AP+3 to a friendly Mafty Unit during battle", () => {
    const mafty = createMockUnit({ traits: ["mafty"], ap: 2, hp: 4 });
    const enemyAttacker = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03InfiltratorPresent111],
        play: [mafty],
        resourceArea: activeResources(3),
      },
      { play: [enemyAttacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const maftyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(enemyId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.playCommand(commandId, { targets: [maftyId] }));

    expect(p1.getVisibleCard(maftyId)?.effectiveAp).toBe(5);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot target a friendly Unit without the Mafty trait", () => {
    const nonMafty = createMockUnit({ traits: ["aeug"], ap: 2 });
    const engine = GundamTestEngine.create({
      hand: [gd03InfiltratorPresent111],
      play: [nonMafty],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.playCommand(commandId, { targets: [unitId] }), "INVALID_TARGET");

    expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(2);
    expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("can be paired as Emeralda Zubin instead of activating the Command effect", () => {
    const host = createMockUnit({ ap: 2, hp: 3, linkCondition: "[Emeralda Zubin]" });
    const engine = GundamTestEngine.create({
      hand: [gd03InfiltratorPresent111],
      play: [host],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 2, effectiveHp: 4 });
  });
});
