import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op02Vista011 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-011 Vista", () => {
  test("K.O.s only an opposing Character at the 3000-power boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op02Vista011],
        activeDon: op02Vista011.cost,
      },
      {
        character: [eb01Doma005, eb01Fourtricks025],
      },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const ineligibleId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op02Vista011, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Vista's K.O. target.");
    expect(target.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.some((card) => card?.instanceId === ineligibleId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
