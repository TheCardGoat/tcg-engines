import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st10-015-gum-gum-giant-sumo-slap", () => {
  test("Counter grants 2000 to Leader and KOs a <=2000 Character", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }, "ST01-006", "ST02-012"] },
      { hand: ["ST10-015"], activeDon: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const weak = e.findCardInZone("south", "character", "ST01-006");
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("north", "hand", "ST10-015")] },
      "north",
    );
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("north")] }, "north");
    const step = e.pendingDecision("effectTargetSelection", "north").steps[0];
    if (step?.kind !== "selectEntity") throw Error("targets");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([weak]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [weak] }, "north");
    expect(e.getView("north").players.north.lifeCount).toBe(4);
    expect(e.getView("north").players.south.trash.map((c) => c.instanceId)).toContain(weak);
    expect(e.getView("north").players.north.leader.power).toBe(5000);
  });
  test("declines the up-to power target but still resolves the KO clause", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }, "ST01-006"] },
      { hand: ["ST10-015"], activeDon: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const weak = e.findCardInZone("south", "character", "ST01-006");
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("north", "hand", "ST10-015")] },
      "north",
    );
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");
    e.resolveDecision("effectTargetSelection", { selectedIds: [weak] }, "north");
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    expect(e.getView("north").players.south.trash.map((c) => c.instanceId)).toContain(weak);
  });
});
