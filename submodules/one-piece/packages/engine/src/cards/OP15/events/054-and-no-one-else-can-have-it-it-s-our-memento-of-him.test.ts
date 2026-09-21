import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-054 And No One Else Can Have It! It's Our Memento of Him!!", () => {
  test("[Main] as [Lucy]: draw 2, trash 1, and play a Dressrosa Character of cost 4 or less", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP15-002",
        hand: ["OP15-054", "OP15-014", "OP13-013"],
        activeDon: 4,
      },
      {},
    );

    engine.playCard("OP15-054");
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected the trash choice.");
    const filler = trash.candidates.find(
      (candidate) => candidate.publicInfo?.cardId === "OP13-013",
    );
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [filler!.ref.id!] },
      "south",
    );
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the play choice.");
    engine.resolveDecision(
      "effectPlaySelection",
      { selectedIds: [play.candidates[0]!.ref.id] },
      "south",
    );

    const south = engine.getView("south").players.south;
    expect(south.characters.map((card) => card?.cardId)).toContain("OP15-014");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Main] as [Lucy]: may instead return up to 1 Stage to its owner's hand", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP15-002", hand: ["OP15-054"], activeDon: 4 },
      { stage: "OP17-057" },
    );

    engine.playCard("OP15-054");
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the Stage target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [target.candidates[0]!.ref.id] },
      "south",
    );

    // The Stage left the field for the owner's hand.
    expect(() => engine.findCardInZone("north", "stage", "OP17-057")).toThrow();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
