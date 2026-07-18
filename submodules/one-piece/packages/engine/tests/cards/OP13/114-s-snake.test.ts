import { describe, expect, test } from "vite-plus/test";
import { op01Nekomamushi048 } from "../../../../cards/src/cards/OP01/characters/048-nekomamushi.ts";
import { op01XDrake054 } from "../../../../cards/src/cards/OP01/characters/054-x-drake.ts";
import { op13SSnake114 } from "../../../../cards/src/cards/OP13/characters/114-s-snake.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

function pendingPrompt(engine: OnePieceTestEngine, intent: string) {
  return engine
    .getState()
    .promptQueue.find(
      (prompt) => prompt.status === "pending" && prompt.resolutionContext?.intent === intent,
    );
}

describe("OP13-114 S-Snake", () => {
  test("turns the top Life card face-up as cost and gives an opposing Character -2000 power", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13SSnake114],
        life: [op01Nekomamushi048],
        activeDon: 10,
      },
      { character: [op01XDrake054] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lifeId = engine.findCardInZone("south", "life", op01Nekomamushi048);
    const drakeId = engine.findCardInZone("north", "character", op01XDrake054);

    engine.playCard(op13SSnake114);
    const optionalPrompt = pendingPrompt(engine, "effectOptional");
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: optionalPrompt!.id,
      optionId: "yes",
    });
    const targetPrompt = pendingPrompt(engine, "effectTargetSelection");
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: targetPrompt!.id,
      selectedIds: [drakeId],
    });

    expect(engine.getState().cards[lifeId]?.faceUp).toBe(true);
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === drakeId)
        ?.power,
    ).toBe(4000);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });
});
