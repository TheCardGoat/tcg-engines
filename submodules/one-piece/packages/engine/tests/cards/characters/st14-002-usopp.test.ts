import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST14-002 Usopp", () => {
  test("FAQ counts Usopp's own modified cost eight for attack KO", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST14-001",
        character: [{ cardId: "ST14-002", playedOnTurn: 0 }, "ST14-004", "ST14-011"],
        activeDon: 2,
      },
      { character: ["ST12-008", "ST12-013"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const id = e.findCardInZone("south", "character", "ST14-002");
    e.attachDon(e.leader("south"), 1);
    e.attachDon(id, 1);
    e.activateEffect(e.findCardInZone("south", "character", "ST14-004"), "activateMain");
    e.asSouth().chooseTargets(id);
    e.activateEffect(e.findCardInZone("south", "character", "ST14-011"), "activateMain");
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets(id);
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(8);
    e.asSouth().attack(id, e.leader("north"));
    const target = e.findCardInZone("north", "character", "ST12-008"),
      p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("KO");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.asSouth().chooseTargets(target);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(target);
  });
  test("declines optional attack KO", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST14-002", attachedDon: 1, playedOnTurn: 0 }, "ST14-012"] },
      { character: ["ST12-008"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST14-002"), e.leader("north"));
    e.asSouth().chooseNoTargets();
    expect(e.getView("north").players.north.characters[0]?.cardId).toBe("ST12-008");
    expect(e.getView("north").players.north.trash).toHaveLength(0);
  });
  test.each([
    { don: 0, other: "ST14-012" },
    { don: 1, other: "ST14-005" },
  ])("needs DON and cost-eight Character: %s", ({ don, other }) => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST14-002", attachedDon: don, playedOnTurn: 0 }, other] },
      { character: ["ST12-008"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST14-002"), e.leader("north"));
    expect(e.getView("north").players.north.characters[0]?.cardId).toBe("ST12-008");
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
