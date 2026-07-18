import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025 } from "@tcg/op-cards";
import { op09Kuzan101 } from "../../../../../cards/src/cards/OP09/characters/101-kuzan.ts";
import { op09VascoShot091 } from "../../../../../cards/src/cards/OP09/characters/091-vasco-shot.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-101 Kuzan", () => {
  test("lets its controller choose top or bottom for the opposing Character added to Life", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op09Kuzan101], activeDon: op09Kuzan101.cost },
      { character: [eb01Doma005, op09VascoShot091], hand: [eb01Fourtricks025] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op09Kuzan101, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const position = engine.pendingDecision("effectLifePosition", "south").steps[0];
    if (position?.kind !== "chooseOption") {
      throw new Error("Expected Kuzan's printed top-or-bottom Life choice.");
    }
    expect(position.options.map((option) => option.id)).toEqual(["top", "bottom"]);
  });
});
