import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-136 Usopp", () => {
  test("rests as payment, excludes a non-Straw-Hat Leader but permits an unrelated Character", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST02-001",
      character: ["P-136", "EB01-005"],
      restedDon: 1,
    });
    const usopp = e.findCardInZone("south", "character", "P-136");
    const doma = e.findCardInZone("south", "character", "EB01-005");
    e.activateEffect(usopp, "activateMain", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("recipient");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([usopp, doma]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [doma] }, "south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === usopp)?.rested,
    ).toBe(true);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === doma)?.attachedDon,
    ).toBe(1);
  });
  test("can give DON to a Straw Hat Leader", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      character: ["P-136"],
      restedDon: 1,
    });
    e.activateEffect(e.findCardInZone("south", "character", "P-136"), "activateMain", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    expect(e.getView("south").players.south.leader.attachedDon).toBe(1);
  });
  test("may decline optional payment and stay active", () => {
    const e = OnePieceTestEngine.create({ character: ["P-136"], restedDon: 1 });
    e.activateEffect(e.findCardInZone("south", "character", "P-136"), "activateMain", "south");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("south").players.south.restedDon).toBe(1);
  });
});
