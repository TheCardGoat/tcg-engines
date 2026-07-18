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
import { gd02ThatOneLooksALotStronger108 } from "./108-that-one-looks-a-lot-stronger.ts";

describe("That One Looks A Lot Stronger? (GD02-108)", () => {
  it("lets the chosen Clan Unit attack an active enemy Unit at Lv.4 or lower", () => {
    const clan = createMockUnit({ ap: 3, hp: 5, traits: ["clan"] });
    const other = createMockUnit({ traits: ["zeon"] });
    const eligibleEnemy = createMockUnit({ level: 4, hp: 6 });
    const tooHigh = createMockUnit({ level: 5, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02ThatOneLooksALotStronger108],
        play: [clan, other],
        resourceArea: activeResources(3),
      },
      { play: [eligibleEnemy, tooHigh] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [clanId, otherId] = p1.getCardsInZone("battleArea");
    const [eligibleEnemyId, tooHighId] = p2.getCardsInZone("battleArea");
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible friendly Clan Unit choice");
    }
    expect(choice.legalTargetIds).toEqual([clanId]);
    expect(choice.legalTargetIds).not.toContain(otherId);
    expectSuccess(p1.resolveEffect({ targets: [clanId!] }));

    expect(p1.getLegalAttackTargets(clanId!)).toContain(eligibleEnemyId);
    expect(p1.getLegalAttackTargets(clanId!)).not.toContain(tooHighId);
    expectSuccess(p1.enterBattle(clanId!, eligibleEnemyId!));
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot be played without a friendly Clan Unit", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02ThatOneLooksALotStronger108],
      play: [createMockUnit({ traits: ["zeon"] })],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd02ThatOneLooksALotStronger108), "NO_LEGAL_TARGETS");
    expect(p1.getCardZone(gd02ThatOneLooksALotStronger108)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot be played during a legally reached Action step", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02ThatOneLooksALotStronger108],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(gd02ThatOneLooksALotStronger108), "WRONG_TIMING");
  });

  it("enforces both its printed Lv.3 and active Resource cost 1", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02ThatOneLooksALotStronger108],
      resourceArea: activeResources(2),
    });
    expectFailure(
      lowLevel.asPlayer(PLAYER_ONE).playCommand(gd02ThatOneLooksALotStronger108),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowLevel.asPlayer(PLAYER_ONE).getCardZone(gd02ThatOneLooksALotStronger108)).toBe(
      `hand:${PLAYER_ONE}`,
    );

    const setup = createMockCommand({
      level: 0,
      cost: 3,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02ThatOneLooksALotStronger108],
      play: [createMockUnit({ traits: ["clan"] })],
      resourceArea: activeResources(3),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.playCommand(gd02ThatOneLooksALotStronger108), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02ThatOneLooksALotStronger108)).toBe(`hand:${PLAYER_ONE}`);
  });
});
