import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op15Nezumi010 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-010 Nezumi", () => {
  test("attaches a rested DON!! to its owner's Character, once per turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-001",
        character: [op15Nezumi010, { card: eb01Doma005 }],
        restedDon: 2,
      },
      {},
    );
    const domaId = engine.findCardInZone("south", "character", eb01Doma005);
    const attachedBefore =
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === domaId)
        ?.attachedDon ?? 0;

    engine.activateEffect(
      engine.findCardInZone("south", "character", op15Nezumi010),
      "activateMain",
      "south",
    );
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected the give count.");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the recipient choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(domaId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    const view = engine.getView("south").players.south;
    expect(view.characters.find((c) => c?.instanceId === domaId)?.attachedDon).toBe(
      attachedBefore + 1,
    );
    expect(view.restedDon).toBe(1);
    expect(() =>
      engine.activateEffect(
        engine.findCardInZone("south", "character", op15Nezumi010),
        "activateMain",
        "south",
      ),
    ).toThrow();
  });

  test("declining the give leaves the DON!! pool untouched", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-001",
        character: [op15Nezumi010, { card: eb01Doma005 }],
        restedDon: 2,
      },
      {},
    );

    engine.activateEffect(
      engine.findCardInZone("south", "character", op15Nezumi010),
      "activateMain",
      "south",
    );
    engine.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");

    const view = engine.getView("south").players.south;
    expect(view.restedDon).toBe(2);
    expect(view.characters.find((c) => c?.cardId === eb01Doma005.id)?.attachedDon ?? 0).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
