import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op13Higuma013,
  op13Otama043,
  prb02BuggySt17003PirateFoil003,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST17-003 Buggy", () => {
  test("privately looks at and reorders exactly the top three deck cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [prb02BuggySt17003PirateFoil003],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op13Higuma013, op13Otama043],
      activeDon: prb02BuggySt17003PirateFoil003.cost,
    });
    const lookedIds = engine.getState().players.south.deck.slice(0, 3);
    const chosenOrder = [...lookedIds].reverse();

    engine.playCard(prb02BuggySt17003PirateFoil003, "south");

    const order = engine.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
    expect(order).toMatchObject({ kind: "orderItems", min: 3, max: 3 });
    if (order?.kind !== "orderItems") throw new Error("Expected Buggy's private deck order.");
    expect(order.candidates.map((candidate) => candidate.ref.id)).toEqual(lookedIds);
    engine.resolveDecision("effectRearrangeDeckOrder", { selectedIds: chosenOrder }, "south");

    expect(engine.getState().players.south.deck.slice(0, 3)).toEqual(chosenOrder);
    expect(
      engine
        .getView("north")
        .logs.filter(
          (entry) => entry.sourceInstanceId && lookedIds.includes(entry.sourceInstanceId),
        ),
    ).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
