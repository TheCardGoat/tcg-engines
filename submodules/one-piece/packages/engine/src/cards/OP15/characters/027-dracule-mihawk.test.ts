import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op15DraculeMihawk027 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-027 Dracule Mihawk", () => {
  test("rests an opposing Character that carries a DON!! card", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15DraculeMihawk027], activeDon: op15DraculeMihawk027.cost },
      {
        character: [{ card: eb01Doma005, attachedDon: 1 }, { cardId: "OP13-013" }],
      },
    );
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op15DraculeMihawk027, "south");
    const rest = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (rest?.kind !== "selectEntity") throw new Error("Expected the rest target.");
    const candidates = rest.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toContain(domaId);
    expect(candidates).not.toContain(engine.findCardInZone("north", "character", "OP13-013"));
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    const north = engine.getView("south").players.north;
    expect(north.characters.find((c) => c?.instanceId === domaId)?.rested).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the up-to rest leaves the board untouched", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15DraculeMihawk027], activeDon: op15DraculeMihawk027.cost },
      { character: [{ card: eb01Doma005, attachedDon: 1 }] },
    );
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op15DraculeMihawk027, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const north = engine.getView("south").players.north;
    expect(north.characters.find((c) => c?.instanceId === domaId)?.rested).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("offers no targets when no opposing Character carries a DON!! card", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15DraculeMihawk027], activeDon: op15DraculeMihawk027.cost },
      { character: [{ card: eb01Doma005 }] },
    );

    engine.playCard(op15DraculeMihawk027, "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getView("south").players.north.characters[0]?.rested).toBe(false);
  });
});
