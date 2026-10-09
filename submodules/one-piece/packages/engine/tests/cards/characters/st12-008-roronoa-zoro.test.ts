import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST12-008 Roronoa Zoro", () => {
  test("DON-gated attack rests cost six but excludes cost seven", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST12-008", attachedDon: 1, playedOnTurn: 0 }] },
      { character: ["ST04-004", "ST09-005"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST12-008"), e.leader("north"));
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("rest");
    const id = e.findCardInZone("north", "character", "ST04-004");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([id]);
    e.asSouth().chooseTargets(id);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(true);
    expect(e.getView("north").players.north.characters[1]?.rested).toBe(false);
  });
  test("declines optional target while attacking", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST12-008", attachedDon: 1, playedOnTurn: 0 }] },
      { character: ["ST12-004"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST12-008"), e.leader("north"));
    e.asSouth().chooseNoTargets();
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
  });
  test("no DON means no rest effect", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST12-008", playedOnTurn: 0 }] },
      { character: ["ST12-004"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST12-008"), e.leader("north"));
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
