import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

import { st04King004 } from "@tcg/op-cards";
describe("ST05-009 Scarlet", () => {
  test("activates Life Trigger to play the physical Scarlet active", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST05-009"] },
      { character: [{ card: st04King004, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const scarlet = e.findCardInZone("south", "life", "ST05-009");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST04-004"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    expect(e.getView("south").players.south.lifeCount).toBe(0);
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === scarlet)).toBe(
      true,
    );
    expect(e.getView("south").players.south.hand.some((c) => c.instanceId === scarlet)).toBe(false);
    expect(e.getView("south").players.south.trash).toHaveLength(0);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declines Life Trigger and adds the physical Scarlet to hand", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST05-009"] },
      { character: [{ card: st04King004, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const scarlet = e.findCardInZone("south", "life", "ST05-009");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST04-004"), e.leader("south"));
    e.asSouth().declineLifeTrigger();
    expect(e.getView("south").players.south.lifeCount).toBe(0);
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === scarlet)).toBe(
      false,
    );
    expect(e.getView("south").players.south.hand.some((c) => c.instanceId === scarlet)).toBe(true);
    expect(e.getView("south").players.south.trash).toHaveLength(0);

    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
