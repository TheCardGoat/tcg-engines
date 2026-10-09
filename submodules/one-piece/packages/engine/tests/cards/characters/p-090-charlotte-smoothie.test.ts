import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P090 Smoothie", () => {
  test("opposing turn KO pays one and plays only eligible BigMom Character within opponent totalDON", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST15-002", { cardId: "ST02-012", attachedDon: 2 }], restedDon: 3 },
      {
        character: [{ cardId: "P-090", rested: true }],
        hand: ["ST07-004", "P-090", "ST02-006", "ST07-010"],
        restedDon: 1,
      },
    );
    const play = e.findCardInZone("north", "hand", "ST07-004");
    e.asSouth().attack(
      e.findCardInZone("south", "character", "ST15-002"),
      e.findCardInZone("north", "character", "P-090"),
    );
    e.asNorth().chooseCounter();
    e.asNorth().acceptOptional();
    const p = e.pendingDecision("effectPlaySelection", "north").steps[0];
    if (p?.kind !== "selectEntity") throw Error("play");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([play]);
    e.asNorth().choosePlay(play);
    expect(e.getView("north").players.north.restedDon).toBe(0);
    expect(e.getView("north").players.north.characters.some((c) => c?.instanceId === play)).toBe(
      true,
    );
  });
  test("declines optional DON payment with eligible play available", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST15-002"], restedDon: 4 },
      { character: [{ cardId: "P-090", rested: true }], restedDon: 1, hand: ["ST07-003"] },
    );
    e.asSouth().attack(
      e.findCardInZone("south", "character", "ST15-002"),
      e.findCardInZone("north", "character", "P-090"),
    );
    // No usable Counter remains, so the Counter Step ends automatically.
    e.asNorth().declineOptional();
    expect(e.getView("north").players.north.restedDon).toBe(1);
    expect(e.getView("north").players.north.handCount).toBe(1);
  });
  test("own-turn KO cost does not offer Smoothie effect", () => {
    const e = OnePieceTestEngine.create({
      character: ["P-090", "ST02-012", { cardId: "OP05-087", attachedDon: 1 }],
      restedDon: 1,
      hand: ["ST07-003"],
    });
    const smoothie = e.findCardInZone("south", "character", "P-090");
    e.asSouth().attack(e.findCardInZone("south", "character", "OP05-087"), e.leader("north"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostKoCharacter", { selectedIds: [smoothie] }, "south");
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("P-090");
  });

  test("opponent effect KO pays return but can decline eligible play", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP02-117", "OP04-038"], activeDon: 6 },
      { character: ["P-090"], restedDon: 1, hand: ["ST07-003"] },
    );
    const target = e.findCardInZone("north", "character", "P-090");
    e.asSouth().play("OP02-117");
    e.asSouth().chooseTargets(target);
    e.asSouth().play("OP04-038");
    e.asSouth().chooseTargets(target);
    e.asSouth().chooseTargets(target);
    e.asNorth().acceptOptional();
    e.asNorth().chooseNoPlay();
    expect(e.getView("north").players.north.restedDon).toBe(0);
    expect(e.getView("north").players.north.handCount).toBe(1);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(target);
  });
});
