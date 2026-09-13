import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd05AbyssGundamMaMode046 } from "./046-abyss-gundam-ma-mode.ts";

describe("Abyss Gundam (MA Mode) (GD05-046)", () => {
  it("when paired with a Phantom Pain Pilot makes an enemy with 4 cards choose their discard", () => {
    const pilot = createMockPilot({ traits: ["phantom pain"] });
    const enemyHand = Array.from({ length: 4 }, (_, index) =>
      createMockUnit({ name: `Enemy hand ${index + 1}` }),
    );
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd05AbyssGundamMaMode046],
        resourceArea: activeResources(1),
      },
      { hand: enemyHand },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const discardedId = p2.getHand()[2]!;

    expectSuccess(p1.assignPilot(pilot, sourceId));
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      controllerId: PLAYER_TWO,
      legalTargetIds: p2.getHand(),
    });
    expectFailure(p1.resolveEffect({ targets: [discardedId] }), "NOT_ACTIVE_PLAYER");
    expectSuccess(p2.resolveEffect({ targets: [discardedId] }));

    expect(p2.getCardZone(discardedId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getHand()).toHaveLength(3);
  });

  it("does not trigger when the enemy has fewer than 4 cards", () => {
    const pilot = createMockPilot({ traits: ["phantom pain"] });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd05AbyssGundamMaMode046],
        resourceArea: activeResources(1),
      },
      { hand: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.assignPilot(pilot, p1.getCardsInZone("battleArea")[0]!));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(engine.asPlayer(PLAYER_TWO).getHand()).toHaveLength(1);
  });
});
