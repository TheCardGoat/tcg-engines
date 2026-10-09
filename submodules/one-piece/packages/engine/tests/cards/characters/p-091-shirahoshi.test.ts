import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("P091 Shirahoshi", () => {
  test("OnPlay filters both traits and Main grants Character-only immediate attack", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-091", "OP11-027", "OP11-026", "ST02-012"], activeDon: 4 },
      { character: [{ cardId: "ST02-012", rested: true }] },
    );
    const fish = e.findCardInZone("south", "hand", "OP11-027");
    e.asSouth().play("P-091");
    const p = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("play");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([fish]);
    e.asSouth().choosePlay(fish);
    const source = e.findCardInZone("south", "character", "P-091");
    e.asSouth().activateMain(source);
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets(fish);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === source)?.rested,
    ).toBe(true);
    e.asSouth().expectFailure({ type: "attack", attackerId: fish, targetId: e.leader("north") });
    const target = e.findCardInZone("north", "character", "ST02-012");
    e.asSouth().attack(fish, target);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(target);
  });
  test("declines optional self-rest and optional OnPlay with eligible Fish-Man Island Character", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-091", "OP11-109"], activeDon: 4 });
    e.asSouth().play("P-091");
    e.asSouth().chooseNoPlay();
    const source = e.findCardInZone("south", "character", "P-091");
    e.asSouth().activateMain(source);
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("south").players.south.handCount).toBe(1);
  });

  test("OnPlay also plays Fish-Man Island without Neptunian type", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-091", "OP11-109"], activeDon: 4 });
    const target = e.findCardInZone("south", "hand", "OP11-109");
    e.asSouth().play("P-091");
    e.asSouth().choosePlay(target);
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === target)).toBe(
      true,
    );
  });
});
