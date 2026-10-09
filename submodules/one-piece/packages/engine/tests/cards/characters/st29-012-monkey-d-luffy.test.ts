import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST29-012 Luffy", () => {
  test.each(["leader", "character"])(
    "gives one rested DON to named %s then enforces OPT with another DON available",
    (kind) => {
      const e = OnePieceTestEngine.create({
        leaderCardId: "ST29-001",
        character: ["ST29-012", "ST29-010"],
        restedDon: 2,
        activeDon: 1,
      });
      const source = e.findCardInZone("south", "character", "ST29-012"),
        wrong = e.findCardInZone("south", "character", "ST29-010");
      e.asSouth().activateMain(source);
      e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
      const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (p?.kind !== "selectEntity") throw Error("target");
      expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).not.toContain(wrong);
      e.asSouth().chooseTargets(kind === "leader" ? e.leader("south") : source);
      expect(e.getView("south").players.south.restedDon).toBe(1);
      expect(
        kind === "leader"
          ? e.getView("south").players.south.leader.attachedDon
          : e.getView("south").players.south.characters[0]?.attachedDon,
      ).toBe(1);
      const failure = e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: source,
        trigger: "activateMain",
      });
      expect(
        OnePieceTestEngine.fromState(failure.state).getView("south").players.south.restedDon,
      ).toBe(1);
    },
  );
  test("declines optional rested DON grant", () => {
    const e = OnePieceTestEngine.create({ character: ["ST29-012"], restedDon: 1 });
    e.asSouth().activateMain(e.findCardInZone("south", "character", "ST29-012"));
    e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("south").players.south.characters[0]?.attachedDon).toBe(0);
  });
  test("Trigger plays physical card under any Leader", () => {
    const e = OnePieceTestEngine.create(
      {},
      { leaderCardId: "ST02-001", life: ["ST29-012", "ST02-002"] },
      { activeSeat: "south", firstPlayer: "north" },
    );
    const id = e.findCardInZone("north", "life", "ST29-012");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().activateLifeTrigger();
    expect(e.getView("north").players.north.characters.map((c) => c?.instanceId)).toContain(id);
  });
});
