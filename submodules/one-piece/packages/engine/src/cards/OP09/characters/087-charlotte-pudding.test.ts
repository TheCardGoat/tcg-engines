import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op09CharlottePudding087,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-087 Charlotte Pudding", () => {
  test("at five hand cards makes the opponent choose one of their cards to trash", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op09CharlottePudding087], activeDon: op09CharlottePudding087.cost },
      {
        hand: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005, eb01Fourtricks025],
      },
    );
    const selectedId = engine.findCardInZone("north", "hand", eb01MountainGod018);

    engine.playCard(op09CharlottePudding087, "south");
    const discard = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    expect(discard).toMatchObject({ kind: "selectEntity", min: 1, max: 1 });
    if (discard?.kind !== "selectEntity") throw new Error("Expected Pudding's opponent discard.");
    expect(discard.candidates).toHaveLength(5);
    expect(discard.candidates.map((candidate) => candidate.ref.id)).toContain(selectedId);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [selectedId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.handCount).toBe(4);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(selectedId);
    expect(view.prompts).toHaveLength(0);
  });

  test("below five opposing hand cards does not trash anything", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op09CharlottePudding087], activeDon: op09CharlottePudding087.cost },
      { hand: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005] },
    );

    engine.playCard(op09CharlottePudding087, "south");

    const view = engine.getView("north");
    expect(view.players.north.handCount).toBe(4);
    expect(view.players.north.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });
});
