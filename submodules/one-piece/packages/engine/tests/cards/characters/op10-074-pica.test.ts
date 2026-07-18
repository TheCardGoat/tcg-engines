import { describe, expect, test } from "vite-plus/test";
import { op10Pica074 } from "@tcg/op-cards";

import { processEffectAction } from "../../../src/effects/actions.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-074 Pica", () => {
  test("cannot replace an effect K.O. without the required 2 active DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {},
      {
        character: [op10Pica074],
        activeDon: 1,
      },
    );
    const picaId = engine.findCardInZone("north", "character", op10Pica074);

    expect(
      processEffectAction(
        engine.getState(),
        "south",
        engine.leader("south"),
        {
          action: "ko",
          target: {
            player: "opponent",
            zones: ["character"],
            count: { amount: 1 },
          },
        },
        [picaId],
      ),
    ).toBe(true);

    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      picaId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
