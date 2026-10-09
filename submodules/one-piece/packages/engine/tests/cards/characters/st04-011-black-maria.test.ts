import { eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST04-011 Black Maria", () => {
  test("blocks a Leader attack and takes its battle KO", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST04-011"] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const id = e.findCardInZone("south", "character", "ST04-011");
    const life = e.getView("south").players.south.lifeCount;
    e.asNorth().attack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"));
    e.asSouth().chooseBlocker(id);
    expect(e.getView("south").players.south.lifeCount).toBe(life);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(id);
  });
  test("declines Blocker and keeps it active while the Leader takes damage", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST04-011"] },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blocker = e.findCardInZone("south", "character", "ST04-011");
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
