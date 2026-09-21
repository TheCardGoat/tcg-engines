import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op15Higuma015 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-015 Higuma", () => {
  test("clogs an opposing Character with their rested DON!!, then debuffs a DON!!-carrying Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Higuma015], activeDon: op15Higuma015.cost },
      {
        character: [{ card: eb01Doma005 }, { cardId: "OP13-013", rested: true }],
        activeDon: 1,
        restedDon: 1,
      },
    );
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op15Higuma015, "south");
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected the give count.");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (recipient?.kind !== "selectEntity") throw new Error("Expected the clog target.");
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toContain(domaId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    // The debuff may only target a Character now carrying a DON!! card.
    const debuff = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (debuff?.kind !== "selectEntity") throw new Error("Expected the debuff target.");
    const debuffCandidates = debuff.candidates.map((candidate) => candidate.ref.id);
    expect(debuffCandidates).toContain(domaId);
    expect(debuffCandidates).not.toContain(engine.findCardInZone("north", "character", "OP13-013"));
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    const north = engine.getView("south").players.north;
    expect(north.characters.find((c) => c?.instanceId === domaId)?.attachedDon).toBe(1);
    expect(north.characters.find((c) => c?.instanceId === domaId)?.power).toBe(2000);
    expect(north.restedDon).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the clog leaves the board untouched", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Higuma015], activeDon: op15Higuma015.cost },
      { character: [{ card: eb01Doma005 }], activeDon: 1, restedDon: 1 },
    );
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);
    const before = engine.getView("south").players.north;

    engine.playCard(op15Higuma015, "south");
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected the give count.");
    engine.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");

    const after = engine.getView("south").players.north;
    expect(after.restedDon).toBe(before.restedDon);
    expect(after.characters.find((c) => c?.instanceId === domaId)?.attachedDon ?? 0).toBe(0);
    expect(after.characters.find((c) => c?.instanceId === domaId)?.power).toBe(3000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
