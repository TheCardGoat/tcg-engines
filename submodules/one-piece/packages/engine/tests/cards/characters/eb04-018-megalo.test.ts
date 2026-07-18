import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op01Shanks120, op14eb04Megalo018 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-018 Megalo", () => {
  test("optionally rests itself to K.O. only a rested opposing Character with 8000 power or less", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04Megalo018],
        activeDon: op14eb04Megalo018.cost,
      },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: op01Shanks120, rested: true },
          eb01Fourtricks025,
        ],
      },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooPowerfulId = engine.findCardInZone("north", "character", op01Shanks120);
    const activeId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op14eb04Megalo018, "south");
    const megaloId = engine.findCardInZone("south", "character", op14eb04Megalo018);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Megalo's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooPowerfulId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(activeId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === megaloId)?.rested,
    ).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });
});
