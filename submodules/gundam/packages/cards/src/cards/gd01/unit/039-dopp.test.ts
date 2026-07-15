import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01Dopp039 } from "./039-dopp.ts";

function deployAndReadTopChoice(): {
  engine: GundamTestEngine;
  revealedId: string;
  sentinel: ReturnType<typeof createMockUnit>;
  directiveIndex: number;
} {
  const sentinel = createMockUnit({ name: "Untouched Sentinel" });
  const revealed = createMockUnit({ name: "Revealed Top Card" });
  const engine = GundamTestEngine.create(
    {
      hand: [gd01Dopp039],
      resourceArea: activeResources(1),
      deck: [sentinel, revealed],
    },
    { deck: 2 },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);

  expectSuccess(p1.deployUnit(gd01Dopp039));
  const choice = p1.getBoardView().pendingChoice;
  if (choice?.kind !== "deckLook") throw new Error("Expected Dopp's visible deck-look choice");
  expect(choice.revealedCardIds).toHaveLength(1);
  const revealedId = choice.revealedCardIds[0]!;

  return { engine, revealedId, sentinel, directiveIndex: choice.directiveIndex };
}

function advanceToNextDraw(engine: GundamTestEngine): void {
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);

  expectSuccess(p1.passPhase());
  expectSuccess(p2.passActionStep());
  expectSuccess(p1.passActionStep());
  expectSuccess(p2.passPhase());
  expectSuccess(p1.passActionStep());
  expectSuccess(p2.passActionStep());
}

describe("Dopp (GD01-039)", () => {
  it("draws the untouched sentinel next turn after returning the revealed card to the bottom", () => {
    const { engine, revealedId, sentinel, directiveIndex } = deployAndReadTopChoice();
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { [directiveIndex]: { toBottom: [revealedId] } },
      }),
    );
    advanceToNextDraw(engine);

    expect(p1.getHand()).toHaveLength(1);
    expect(p1.getCardZone(sentinel)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("draws the revealed card next turn after returning it to the top", () => {
    const { engine, revealedId, directiveIndex } = deployAndReadTopChoice();
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { [directiveIndex]: { toTop: [revealedId] } },
      }),
    );
    advanceToNextDraw(engine);

    expect(p1.getHand()).toEqual([revealedId]);
  });
});
