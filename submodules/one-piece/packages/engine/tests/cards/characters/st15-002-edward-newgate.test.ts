import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Shanks120, op10EdwardNewgateSp002 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST15-002 Edward.Newgate", () => {
  test("gives one rested DON!! on play, then rests itself to K.O. a 5000-power-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op10EdwardNewgateSp002],
        activeDon: op10EdwardNewgateSp002.cost,
        restedDon: 1,
      },
      { character: [eb01Doma005, op01Shanks120] },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const powerfulId = engine.findCardInZone("north", "character", op01Shanks120);

    engine.playCard(op10EdwardNewgateSp002, "south");
    const newgateId = engine.findCardInZone("south", "character", op10EdwardNewgateSp002);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (recipient?.kind !== "selectEntity") throw new Error("Expected Newgate's DON!! recipient.");
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), newgateId]),
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    engine.activateEffect(newgateId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (ko?.kind !== "selectEntity") throw new Error("Expected Newgate's K.O. target.");
    expect(ko.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(ko.candidates.map((candidate) => candidate.ref.id)).not.toContain(powerfulId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.attachedDon).toBe(1);
    expect(view.players.south.restedDon).toBe(7);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === newgateId)?.rested,
    ).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(powerfulId);
    expect(view.prompts).toHaveLength(0);
  });
});
