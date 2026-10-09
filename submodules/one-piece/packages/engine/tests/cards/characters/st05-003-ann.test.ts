import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

import { st04King004 } from "@tcg/op-cards";
describe("ST05-003 Ann", () => {
  test("Blocker intercepts the Leader attack", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST05-003"] },
      { character: [{ card: st04King004, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const ann = e.findCardInZone("south", "character", "ST05-003");
    const life = e.getView("south").players.south.lifeCount;
    e.asNorth().attack(e.findCardInZone("north", "character", "ST04-004"), e.leader("south"));
    e.asSouth().chooseBlocker(ann);
    expect(e.getView("south").players.south.lifeCount).toBe(life);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(ann);
  });
  test("declines Blocker and keeps it active while the Leader takes damage", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST05-003"] },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blocker = e.findCardInZone("south", "character", "ST05-003");
    const life = e.getView("south").players.south.lifeCount;
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.resolveDecision("battleBlocker", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(life - 1);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === blocker)?.rested,
    ).toBe(false);
    expect(e.getView("south").players.south.trash).toHaveLength(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
