import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST07-003 Charlotte Katakuri", () => {
  test("skipping Life look still grants Rush when behind in Life", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST07-003"], activeDon: 4, life: 2 },
      { life: 3 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().play("ST07-003");
    e.resolveDecision("effectLookAtLifeOwner", { optionId: "skip" }, "south");
    const card = e.findCardInZone("south", "character", "ST07-003");
    e.asSouth().attack(card, e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(2);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
  });
  test("privately moves opposing top Life to bottom but gains no Rush at equal Life", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST07-003"], activeDon: 4, life: 2 },
      { life: ["ST07-002", "ST07-006"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const top = e.findCardInZone("north", "life", "ST07-002");
    e.asSouth().play("ST07-003");
    e.resolveDecision("effectLookAtLifeOwner", { optionId: "opponent" }, "south");
    expect(e.pendingDecision("effectLookAtLifePosition", "south").message).toContain(
      "Charlotte Anana",
    );
    expect(JSON.stringify(e.getView("north").decisions)).not.toContain("Charlotte Anana");
    e.resolveDecision("effectLookAtLifePosition", { optionId: "bottom" }, "south");
    expect(e.getView("judge").players.north.life.at(-1)?.instanceId).toBe(top);
    e.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: e.findCardInZone("south", "character", "ST07-003"),
      targetId: e.leader("north"),
    });
  });
});
