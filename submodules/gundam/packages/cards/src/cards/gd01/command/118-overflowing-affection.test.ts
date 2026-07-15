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
import { gd01OverflowingAffection118 } from "./118-overflowing-affection.ts";

describe("Overflowing Affection (GD01-118)", () => {
  it("【Main】 draws 2, asks which visible hand card to discard, and discards the chosen card", () => {
    const friendly = createMockUnit({ name: "Invalid Board Target" });
    const engine = GundamTestEngine.create({
      hand: [gd01OverflowingAffection118],
      play: [friendly],
      resourceArea: activeResources(2),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

    expectSuccess(p1.playCommand(commandId));
    const drawnCardIds = p1.getHand();
    expect(drawnCardIds).toHaveLength(2);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: drawnCardIds,
    });
    expectFailure(p1.resolveEffect({ targets: [friendlyId] }), "ILLEGAL_TARGET");
    expectSuccess(p1.resolveEffect({ targets: [drawnCardIds[1]!] }));

    expect(p1.getCardZone(drawnCardIds[1]!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(drawnCardIds[0]!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore - 2);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("cannot be played in a legally reached Action step", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01OverflowingAffection118],
      resourceArea: activeResources(2),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(gd01OverflowingAffection118), "WRONG_TIMING");
  });

  it("cannot be played below its printed Lv.2 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01OverflowingAffection118],
      resourceArea: activeResources(1),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01OverflowingAffection118), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01OverflowingAffection118)).toBe(`hand:${PLAYER_ONE}`);
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
      hand: [setup, gd01OverflowingAffection118],
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
