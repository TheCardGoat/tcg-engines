import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST06-012 Garp", () => {
  test("pays discard and rest before KOing only cost<=4", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST06-012"], hand: ["ST02-002"] },
      { character: ["ST02-006", "ST02-013"] },
    );
    const id = e.findCardInZone("south", "character", "ST06-012");
    const target = e.findCardInZone("north", "character", "ST02-006");
    e.activateEffect(id, "activateMain", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("KOchoice");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.rested,
    ).toBe(true);
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("ST02-002");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(target);
  });
  test("decline leaves Garp active and hand unchanged", () => {
    const e = OnePieceTestEngine.create({ character: ["ST06-012"], hand: ["ST02-002"] });
    const id = e.findCardInZone("south", "character", "ST06-012");
    e.activateEffect(id, "activateMain", "south");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.rested,
    ).toBe(false);
    expect(e.getView("south").players.south.handCount).toBe(1);
  });
  test("cannot pay only the rest part without a hand card", () => {
    const e = OnePieceTestEngine.create({ character: ["ST06-012"] });
    const id = e.findCardInZone("south", "character", "ST06-012");
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: id,
      trigger: "activateMain",
    });
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.rested,
    ).toBe(false);
  });
});
