import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST25-004 Buggy", () => {
  test("discards then self-trashes before playing eligible Cross Guild cost six or less", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP09-042",
      character: ["ST25-004"],
      hand: ["ST01-006", "OP16-051", "ST25-003", "ST22-010"],
    });
    const buggy = e.findCardInZone("south", "character", "ST25-004"),
      paid = e.findCardInZone("south", "hand", "ST01-006"),
      target = e.findCardInZone("south", "hand", "OP16-051");
    e.asSouth().activateMain(buggy);
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostTrashFromHand", { selectedIds: [paid] }, "south");
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toEqual([paid, buggy]);
    const step = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("play");
    expect(step.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([target]);
    e.asSouth().choosePlay(target);
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === target)).toBe(
      true,
    );
    expect(e.getView("south").players.south.handCount).toBe(4);
  });
  test("wrong Leader still pays both costs but cannot play", () => {
    const e = OnePieceTestEngine.create({
      character: ["ST25-004", "EB01-047"],
      deck: 10,
      hand: ["ST01-006", "ST25-002"],
    });
    const b = e.findCardInZone("south", "character", "ST25-004"),
      paid = e.findCardInZone("south", "hand", "ST01-006");
    e.asSouth().activateMain(b);
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostTrashFromHand", { selectedIds: [paid] }, "south");
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toEqual([paid, b]);
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST25-002"]);
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.deckCount).toBe(10); // Laboon did not see a K.O.
  });
  test("declines optional cost and retains source and hand", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP09-042",
      character: ["ST25-004"],
      hand: ["ST01-006", "ST25-002"],
    });
    e.asSouth().activateMain(e.findCardInZone("south", "character", "ST25-004"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("south").players.south.handCount).toBe(2);
  });
});
