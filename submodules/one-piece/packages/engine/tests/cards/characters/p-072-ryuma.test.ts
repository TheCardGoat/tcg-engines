import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-072-ryuma", () => {
  test.each(["onPlay", "onKo"])("%s can rest only opposing cost4 or less", (timing) => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST01-001",
        hand: timing === "onPlay" ? ["P-072"] : [],
        activeDon: 4,
        character: timing === "onKo" ? [{ cardId: "P-072", rested: true }] : [],
      },
      { leaderCardId: "ST01-001", activeDon: 2, character: ["ST02-002", "ST01-012"] },
      { activeSeat: timing === "onPlay" ? "south" : "north", firstPlayer: "south" },
    );
    const target = e.findCardInZone("north", "character", "ST02-002");
    if (timing === "onPlay") e.asSouth().play("P-072");
    else {
      e.asNorth().attachDon(e.leader("north"), 2);
      e.asNorth().attack(e.leader("north"), e.findCardInZone("south", "character", "P-072"));
    }
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("target");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.asSouth().chooseTargets(target);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(true);
    expect(e.getView("north").players.north.characters[1]?.rested).toBe(false);
  });
  test("OnPlay allows zero rest targets", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-072"], activeDon: 4 },
      { character: ["ST02-002"] },
    );
    e.asSouth().play("P-072");
    e.asSouth().chooseTargets();
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
