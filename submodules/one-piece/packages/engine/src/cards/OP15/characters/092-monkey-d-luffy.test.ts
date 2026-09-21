import { describe, expect, test } from "vite-plus/test";
import { op15MonkeyDLuffy092 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

function createEngine(trashCount: number, activeSeat: "north" | "south" = "south") {
  return OnePieceTestEngine.create(
    {
      leaderCardId: "OP16-001",
      character: [{ card: op15MonkeyDLuffy092 }],
      trash: Array.from({ length: trashCount }, () => "OP13-013"),
      activeDon: 7,
    },
    {},
    { activeSeat },
  );
}

const luffy = (engine: OnePieceTestEngine) =>
  engine
    .getView("south")
    .players.south.characters.find((c) => c?.cardId === op15MonkeyDLuffy092.id);

describe("OP15-092 Monkey.D.Luffy", () => {
  test("at 10-19 trash its base power becomes 9000 and cost +10", () => {
    const engine = createEngine(10);
    expect(luffy(engine)?.power).toBe(9000);
    expect(luffy(engine)?.cost).toBe(17);
  });

  test("stays at base 7000 / cost 7 below 10 trash", () => {
    const engine = createEngine(9);
    expect(luffy(engine)?.power).toBe(7000);
    expect(luffy(engine)?.cost).toBe(7);
  });

  test("at 20+ trash the Leader reads 7000 during the opponent's turn", () => {
    const engine = createEngine(20, "north");
    expect(engine.getView("south").players.south.leader?.power).toBe(7000);

    // On its own controller's turn the Leader boost is absent.
    engine.endTurn("north");
    expect(engine.getView("south").players.south.leader?.power).toBe(5000);
  });

  test("at 30+ trash it gains the extra 1000 power on top of the 9000 base", () => {
    const engine = createEngine(30);
    expect(luffy(engine)?.power).toBe(10000);
  });
});
