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
  test.each(["south", "north"] as const)(
    "chooses %s DON!! without moving it between owners",
    (owner) => {
      const engine = OnePieceTestEngine.create(
        { character: [op15Nezumi010], restedDon: 1 },
        { character: [eb01Doma005], restedDon: 1 },
      );
      engine.activateEffect(
        engine.findCardInZone("south", "character", op15Nezumi010),
        "activateMain",
      );
      engine.resolveDecision("effectGiveDonCount", { optionId: "1" });
      const choice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
      if (choice?.kind !== "selectEntity") throw new Error("Expected recipient choice");
      expect(choice.candidates.map((candidate) => candidate.ref.id)).toEqual(
        expect.arrayContaining([engine.leader("south"), engine.leader("north")]),
      );
      engine.resolveDecision("effectTargetSelection", { selectedIds: [engine.leader(owner)] });
      const view = engine.getView("south");
      expect(view.players[owner].restedDon).toBe(0);
      expect(view.players[owner].leader.attachedDon).toBe(1);
      const other = owner === "south" ? "north" : "south";
      expect(view.players[other].restedDon).toBe(1);
      expect(view.players[other].leader.attachedDon).toBe(0);
      expect(view.prompts).toHaveLength(0);
    },
  );

  test("offers only recipients whose owner has rested DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Nezumi010], restedDon: 0 },
      { character: [eb01Doma005], restedDon: 1 },
    );
    engine.activateEffect(
      engine.findCardInZone("south", "character", op15Nezumi010),
      "activateMain",
    );
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" });
    const choice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (choice?.kind !== "selectEntity") throw new Error("Expected recipient choice");
    expect(choice.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("north"),
      engine.findCardInZone("north", "character", eb01Doma005),
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [engine.leader("north")] });
    expect(engine.getView("south").players.north.leader.attachedDon).toBe(1);
    expect(engine.getView("south").players.south.leader.attachedDon).toBe(0);
  });
});
