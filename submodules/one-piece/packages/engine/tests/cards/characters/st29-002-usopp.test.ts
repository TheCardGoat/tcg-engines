import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST29-002 Usopp", () => {
  test.each(["play", "attack"])("%s rests only opposing cost within opposing Life", (mode) => {
    const e = OnePieceTestEngine.create(
      {
        hand: mode === "play" ? ["ST29-002"] : [],
        character: mode === "attack" ? ["ST29-002"] : [],
        activeDon: 3,
        life: 5,
      },
      { life: 2, character: ["ST01-006", "ST29-011", "ST29-002"] },
      { activeSeat: "south", firstPlayer: "north" },
    );
    const low = e.findCardInZone("north", "character", "ST29-011"),
      high = e.findCardInZone("north", "character", "ST29-002");
    if (mode === "play") e.asSouth().play("ST29-002");
    else e.asSouth().attack(e.findCardInZone("south", "character", "ST29-002"), e.leader("north"));
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("target");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toContain(low);
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).not.toContain(high);
    e.asSouth().chooseTargets(low);
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === low)?.rested,
    ).toBe(true);
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === high)?.rested,
    ).toBe(false);
  });
  test("declines optional rest with legal candidate", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST29-002"], activeDon: 3 },
      { life: 1, character: ["ST01-006"] },
    );
    e.asSouth().play("ST29-002");
    e.asSouth().chooseTargets();
    expect(e.getView("south").players.north.characters[0]?.rested).toBe(false);
  });
});
