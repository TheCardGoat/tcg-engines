import { eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST04-010", () => {
  test("pays DON to KO only an opposing Character with cost 3 or less", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST04-010"], activeDon: 3 + 1 },
      { character: ["ST04-013", "ST04-012", "EB01-018"] },
    );
    const low = e.findCardInZone("north", "character", "ST04-013");
    e.asSouth().play("ST04-010");

    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("KO");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([low]);
    e.asSouth().chooseTargets(low);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(low);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(2);
  });
  test("declines DON payment and leaves all opposing Characters in play", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST04-010"], activeDon: 3 + 1 },
      { character: ["ST04-013", "ST04-012", "EB01-018"] },
    );
    const low = e.findCardInZone("north", "character", "ST04-013");
    e.asSouth().play("ST04-010");

    e.asSouth().declineOptional();
    expect(e.getView("north").players.north.characters.map((c) => c?.instanceId)).toContain(low);
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(3);
  });
  test("Life Trigger plays this physical card with no DON for On Play", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST04-010"], activeDon: 0 },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const card = e.findCardInZone("south", "life", "ST04-010");
    e.asNorth().attack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === card)?.rested,
    ).toBe(false);
    expect(e.getView("south").players.south.lifeCount).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
