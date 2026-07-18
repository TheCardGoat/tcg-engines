import { describe, expect, test } from "vite-plus/test";
import { op01Nekomamushi048 } from "../../../../cards/src/cards/OP01/characters/048-nekomamushi.ts";
import { op13Vegapunk112 } from "../../../../cards/src/cards/OP13/characters/112-vegapunk.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

function pendingBlockerPrompt(engine: OnePieceTestEngine) {
  return engine
    .getState()
    .promptQueue.find(
      (prompt) =>
        prompt.status === "pending" && prompt.resolutionContext?.intent === "battleBlocker",
    );
}

describe("OP13-112 Vegapunk", () => {
  test("gains Blocker from attached DON!! across the field, not DON!! in the cost area", () => {
    const withGivenDon = OnePieceTestEngine.create(
      {
        character: [op13Vegapunk112, { card: op01Nekomamushi048, attachedDon: 2 }],
      },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const vegapunkId = withGivenDon.findCardInZone("south", "character", op13Vegapunk112);
    withGivenDon.declareAttack(withGivenDon.leader("north"), withGivenDon.leader("south"), "north");
    expect(pendingBlockerPrompt(withGivenDon)?.options.map((option) => option.targetId)).toContain(
      vegapunkId,
    );

    const withCostAreaDon = OnePieceTestEngine.create(
      {
        character: [op13Vegapunk112],
        activeDon: 2,
      },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    withCostAreaDon.declareAttack(
      withCostAreaDon.leader("north"),
      withCostAreaDon.leader("south"),
      "north",
    );
    expect(pendingBlockerPrompt(withCostAreaDon)).toBeUndefined();
    expect(withCostAreaDon.getState().capabilityHistory).toEqual([]);
  });
});
