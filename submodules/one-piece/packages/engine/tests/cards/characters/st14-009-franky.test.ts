import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST14-009 Franky", () => {
  test("self reaches cost six: opponent-turn power and selected effect-KO immunity", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST14-001", character: ["ST14-009"], activeDon: 2 },
      { hand: ["ST04-003"], activeDon: 7 },
    );
    const id = e.findCardInZone("south", "character", "ST14-009");
    e.attachDon(id, 1);
    e.attachDon(e.leader("south"), 1);
    e.endTurn("south");
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(6);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(8000);
    e.playCard("ST04-003", "north");
    e.asNorth().acceptOptional();
    e.asNorth().chooseTargets(id);
    expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(id);
    e.endTurn("north");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(6000);
  });
  test.each([
    { don: 0, high: true },
    { don: 1, high: false },
  ])("no immunity when DON or cost gate fails: %s", ({ don, high }) => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST14-009", attachedDon: don }, ...(high ? ["ST14-012"] : [])] },
      { hand: ["ST04-003"], activeDon: 9 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const id = e.findCardInZone("south", "character", "ST14-009");
    e.playCard("ST04-003", "north");
    e.asNorth().acceptOptional();
    e.asNorth().chooseTargets(id);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(id);
  });
  test("battle can KO protected Franky", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST14-009", attachedDon: 1, rested: true }, "ST14-012"] },
      { character: [{ cardId: "ST14-012", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const id = e.findCardInZone("south", "character", "ST14-009");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST14-012"), id);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(id);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
  });
});
