import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { op09MarshallDTeach092 } from "../../../../../cards/src/cards/OP09/characters/092-marshall-d-teach.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-092 Marshall.D.Teach", () => {
  test("at a three-card hand deficit, draws two before trashing one", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op09MarshallDTeach092],
        hand: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
      },
      { hand: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005] },
    );
    const teachId = engine.findCardInZone("south", "character", op09MarshallDTeach092);

    engine.activateEffect(teachId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const discard = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (discard?.kind !== "selectEntity") throw new Error("Expected Teach's hand discard.");
    expect(discard).toMatchObject({ min: 1, max: 1 });
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [discard.candidates[0]!.ref.id] },
      "south",
    );

    expect(engine.getView("south").players.south.hand).toHaveLength(2);
  });
});
