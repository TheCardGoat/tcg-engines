import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005 } from "@tcg/op-cards";
import { op15Enel060 } from "../../../../../cards/src/cards/characters/op15-060-enel.ts";
import { op15GanFall102 } from "../../../../../cards/src/cards/characters/op15-102-gan-fall.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-102 Gan Fall", () => {
  test("costs 3 less in hand beside a 7000+ Sky Island Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Enel060], hand: [op15GanFall102], activeDon: 4 },
      {},
    );

    engine.playCard(op15GanFall102);

    // Base cost 4, reduced by 3 in hand: only 1 DON!! is spent.
    expect(engine.getView("south").players.south.activeDon).toBe(3);
  });

  test("[On Play] rests an opposing Character with cost up to the opponent's Life count", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15GanFall102], activeDon: 4 },
      { character: [eb01Doma005], life: 3 },
    );
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op15GanFall102);

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([domaId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === domaId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
