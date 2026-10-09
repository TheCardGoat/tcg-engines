import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-110", () => {
  test("FAQ: opponent-turn Life Trigger plays this card without its Your Turn On Play", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST07-001",
        life: ["OP17-110", "EB01-025"],
        hand: ["OP17-107"],
        deck: 5,
        activeDon: 2,
      },
      { hand: ["EB01-005"] },
      { activeSeat: "north" },
    );
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    const view = e.getView("south");
    expect(view.players.south.characters.map((c) => c?.cardId)).toContain("OP17-110");
    expect(view.players.south.hand.map((c) => c.cardId)).toEqual(["OP17-107"]);
    expect(view.players.south.deckCount).toBe(5);
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.players.south.activeDon).toBe(2);
    expect(view.players.north.handCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
  test("plays a Big Mom Character from hand then attacks immediately with Rush", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-110", "OP17-107"], activeDon: 7 },
      { life: 3 },
    );
    const child = e.findCardInZone("south", "hand", "OP17-107");
    e.asSouth().play("OP17-110");
    e.resolveDecision("effectPlaySelection", { selectedIds: [child] }, "south");
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === child)).toBe(
      true,
    );
    e.asSouth().attack("OP17-110", e.leader("north"));
    expect(
      e.getView("south").players.south.characters.find((c) => c?.cardId === "OP17-110")?.rested,
    ).toBe(true);
  });

  test("declines eligible OnPlay child but still gains Rush; excludes cost7 and Former Big Mom Pirates", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-110", "OP17-107", "OP17-105", "OP17-110"], activeDon: 7 },
      { life: 3 },
    );
    const target = e.findCardInZone("south", "hand", "OP17-107");
    e.playCard("OP17-110");
    const step = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (step.kind !== "selectEntity") throw new Error("Expected play");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");
    e.asSouth().attack("OP17-110", e.leader("north"));
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(target);
  });
});
