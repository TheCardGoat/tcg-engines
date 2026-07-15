import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01AShowOfResolve100 } from "./100-a-show-of-resolve.ts";

describe("A Show of Resolve (GD01-100)", () => {
  it("【Main】 draws 2 and moves the resolved Command to trash", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01AShowOfResolve100],
      resourceArea: activeResources(4),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;
    const handBefore = p1.getHand().length;
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

    expectSuccess(p1.playCommand(commandId));

    expect(p1.getHand()).toHaveLength(handBefore + 1);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore - 2);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot be played in a legally reached Action step", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01AShowOfResolve100],
      resourceArea: activeResources(4),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(gd01AShowOfResolve100), "WRONG_TIMING");
    expect(p1.getHand()).toHaveLength(1);
  });

  it("cannot be played below its printed Lv.4 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01AShowOfResolve100],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01AShowOfResolve100), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01AShowOfResolve100)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal setup leaves only 2 active Resources", () => {
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
      hand: [setup, gd01AShowOfResolve100],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [setupId, commandId] = p1.getHand();

    expectSuccess(p1.playCommand(setupId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(2);
    expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
