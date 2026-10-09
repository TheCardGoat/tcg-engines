import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter, PLAYER_ONE } from "./index";

const card = createMockCharacter({ id: "drop-only-card", name: "One Ink Character", cost: 1 });

describe("standard play availability with an explicit ink-drop claim", () => {
  it("offers drop-only play when claimed and separates the cache from unclaimed play", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [card],
      inkwell: 0,
      inkDrops: 3,
    });
    const player = engine.asPlayerOne();
    expect(player.getAvailableMoves().some((move) => move.moveId === "playCard")).toBe(false);
    const id = engine.findCardInstanceId(card, "hand", PLAYER_ONE);
    expect(
      player.getAvailableMoves({ inkDrops: 3 }).find((move) => move.moveId === "playCard")
        ?.selectableCardIds,
    ).toContain(id);
    expect(player.getAvailableMoves().some((move) => move.moveId === "playCard")).toBe(false);
    expect(player.playCard(card)).not.toBeSuccessfulCommand();
    expect(player.playCard(card, { inkDrops: 3 })).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(player.getCardZone(card)).toBe("play");
  });

  it("does not offer a play when the claimed drop count exceeds held drops", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [card],
      inkwell: 0,
      inkDrops: 1,
    });
    expect(
      engine
        .asPlayerOne()
        .getAvailableMoves({ inkDrops: 2 })
        .some((move) => move.moveId === "playCard"),
    ).toBe(false);
    expect(engine.asPlayerOne().playCard(card, { inkDrops: 2 })).not.toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
  });
});
