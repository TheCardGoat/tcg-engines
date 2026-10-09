import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P096 Girl", () => {
  test("OnPlay draws then trashes exact chosen hand card", () => {
    const e = OnePieceTestEngine.create({
      hand: ["P-096", "ST02-012"],
      deck: ["ST02-006", "ST02-012"],
      activeDon: 2,
    });
    const discard = e.findCardInZone("south", "hand", "ST02-012");
    e.asSouth().play("P-096");
    expect(e.getView("south").players.south.handCount).toBe(2);
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discard] }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-006"]);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(discard);
  });
  test.each(["leader", "character"] as const)(
    "Main gives restedDON to Nami %s and only once with another payable DON",
    (zone) => {
      const e = OnePieceTestEngine.create({
        leaderCardId: "OP03-040",
        character: ["P-096", "OP01-016", "ST02-012"],
        restedDon: 2,
      });
      const id = e.findCardInZone("south", "character", "P-096");
      const target =
        zone === "leader" ? e.leader("south") : e.findCardInZone("south", "character", "OP01-016");
      e.asSouth().activateMain(id);
      e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
      const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (p?.kind !== "selectEntity") throw Error("target");
      expect(
        p.candidates
          .filter((c) => c.legal)
          .map((c) => c.ref.id)
          .sort(),
      ).toEqual([e.leader("south"), e.findCardInZone("south", "character", "OP01-016")].sort());
      e.asSouth().chooseTargets(target);
      expect(e.getView("south").players.south.restedDon).toBe(1);
      const fail = e.asSouth().expectFailure({ type: "activateMain", sourceId: id });
      const saved = OnePieceTestEngine.fromState(fail.state);
      expect(saved.getView("south").players.south.restedDon).toBe(1);
      expect(
        zone === "leader"
          ? saved.getView("south").players.south.leader.attachedDon
          : saved.getView("south").players.south.characters[1]?.attachedDon,
      ).toBe(1);
    },
  );
  test("declines optional DON transfer with Nami and restedDON available", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP03-040",
      character: ["P-096"],
      restedDon: 1,
    });
    e.asSouth().activateMain(e.findCardInZone("south", "character", "P-096"));
    e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("south").players.south.leader.attachedDon).toBe(0);
  });
});
