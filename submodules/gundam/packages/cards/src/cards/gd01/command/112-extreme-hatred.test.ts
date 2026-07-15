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
import { gd01ExtremeHatred112 } from "./112-extreme-hatred.ts";

describe("Extreme Hatred (GD01-112)", () => {
  it("【Main】 rests exactly two chosen active friendly Units, then damages the chosen enemy", () => {
    const firstFriendly = createMockUnit();
    const secondFriendly = createMockUnit();
    const untouchedFriendly = createMockUnit();
    const enemy = createMockUnit({ hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01ExtremeHatred112],
        play: [firstFriendly, secondFriendly, untouchedFriendly],
        resourceArea: activeResources(6),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [firstFriendlyId, secondFriendlyId, untouchedFriendlyId] =
      p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const restChoice = p1.getBoardView().pendingChoice;
    if (restChoice?.kind !== "targetSelection") {
      throw new Error("Expected Extreme Hatred to ask which two friendly Units to rest");
    }
    expect(restChoice.legalTargetIds).toEqual(
      expect.arrayContaining([firstFriendlyId, secondFriendlyId, untouchedFriendlyId]),
    );
    expectSuccess(p1.resolveEffect({ targets: [firstFriendlyId!, secondFriendlyId!] }));

    expect(p1.isExhausted(firstFriendlyId!)).toBe(true);
    expect(p1.isExhausted(secondFriendlyId!)).toBe(true);
    expect(p1.isExhausted(untouchedFriendlyId!)).toBe(false);
    expect(p2.getDamage(enemyId)).toBe(0);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(3);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("does not rest or damage anything when two active friendly Units cannot be chosen", () => {
    const activeFriendly = createMockUnit();
    const restedFriendly = createMockUnit({ keywordEffects: [{ keyword: "Support", value: 1 }] });
    const enemy = createMockUnit({ hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01ExtremeHatred112],
        play: [activeFriendly, restedFriendly],
        resourceArea: activeResources(6),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [activeFriendlyId, restedFriendlyId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.useSupport(restedFriendlyId!, activeFriendlyId!));
    expectFailure(
      p1.playCommand(gd01ExtremeHatred112, {
        targets: [activeFriendlyId!, restedFriendlyId!],
      }),
      "INVALID_TARGET",
    );

    expect(p1.isExhausted(activeFriendlyId!)).toBe(false);
    expect(p2.getDamage(enemyId)).toBe(0);
    expect(p1.getHand()).toHaveLength(1);
  });

  it("cannot be played in a legally reached Action step", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01ExtremeHatred112],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(gd01ExtremeHatred112), "WRONG_TIMING");
  });

  it("plays as Loni Garvey, applies AP+1/HP+0, and forms a Link through her printed name", () => {
    const host = createMockUnit({
      level: 0,
      cost: 0,
      ap: 2,
      hp: 3,
      linkCondition: "[Loni Garvey]",
    });
    const engine = GundamTestEngine.create(
      {
        hand: [host, gd01ExtremeHatred112],
        resourceArea: activeResources(6),
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

  it("cannot be played below its printed Lv.6 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01ExtremeHatred112],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01ExtremeHatred112), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01ExtremeHatred112)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal setup leaves no active Resources", () => {
    const setup = createMockCommand({
      name: "Resource Setup",
      level: 0,
      cost: 6,
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
      hand: [setup, gd01ExtremeHatred112],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [setupId, commandId] = p1.getHand();

    expectSuccess(p1.playCommand(setupId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
