import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-059 Black Rope Dragon Twister", () => {
  test("[Main] flips top Life face-up and K.O.s a cost-6-or-less and a cost-5-or-less Character when behind on board", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-059"], activeDon: 6, life: ["OP12-013", "OP12-017"] },
      { character: ["OP13-013", "OP17-012", "OP16-003"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");
    const blenheimId = engine.findCardInZone("north", "character", "OP17-012");
    const newgateId = engine.findCardInZone("north", "character", "OP16-003");

    engine.playCard("EB04-059");
    engine.acceptLeadingOptional("south");

    // The life-flip cost already turned the top Life card face-up (visible to its owner).
    expect(engine.getView("south").players.south.life[0]?.cardId).toBe("OP12-013");

    // First K.O.: up to 1 with cost 6 or less (the cost-8 Newgate is excluded).
    const first = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (first?.kind !== "selectEntity") throw new Error("Expected the first K.O. target.");
    const firstIds = first.candidates.map((c) => c.ref.id);
    expect(firstIds).toContain(higumaId);
    expect(firstIds).toContain(blenheimId);
    expect(firstIds).not.toContain(newgateId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    // Second K.O.: up to 1 with cost 5 or less (Higuma is already gone).
    const second = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (second?.kind !== "selectEntity") throw new Error("Expected the second K.O. target.");
    expect(second.candidates.map((c) => c.ref.id)).toEqual([blenheimId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [blenheimId] }, "south");

    const northCharacters = engine
      .getView("south")
      .players.north.characters.filter((c) => c !== null)
      .map((c) => c.instanceId);
    expect(northCharacters).not.toContain(higumaId);
    expect(northCharacters).not.toContain(blenheimId);
    expect(northCharacters).toContain(newgateId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Main] K.O.s nothing when not behind on Characters, but still flips the Life card", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["EB04-059"],
        character: ["OP13-013"],
        activeDon: 6,
        life: ["OP12-013"],
      },
      { character: ["OP17-012"], activeDon: 5 },
    );
    const blenheimId = engine.findCardInZone("north", "character", "OP17-012");

    engine.playCard("EB04-059");
    engine.acceptLeadingOptional("south");

    expect(engine.getView("south").players.south.life[0]?.cardId).toBe("OP12-013");
    expect(engine.getView("south").players.north.characters.map((c) => c?.instanceId)).toContain(
      blenheimId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Trigger] draws 2 and trashes 1 when taken as Life damage", () => {
    const engine = OnePieceTestEngine.create(
      { life: ["EB04-059", "OP12-013", "OP12-017"], hand: ["OP13-013"], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    // Decline the counter so damage lands; the flipped Life card asks for its [Trigger].
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.pendingDecision("lifeTrigger", "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");

    // Draw 2 fills the hand from the deck (1 original + 2 drawn).
    expect(engine.getView("south").players.south.handCount).toBe(3);

    // Trash 1 card from hand to finish the Trigger.
    const trashId = engine.getView("south").players.south.hand[0]?.instanceId;
    if (!trashId) throw new Error("Expected a hand card to trash.");
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [trashId] }, "south");

    expect(engine.getView("south").players.south.handCount).toBe(2);
    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(trashId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
