import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03Nami006,
  op05TohToh009,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-009 Toh-Toh", () => {
  test("draws on play when its Leader has zero power", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb03Nami006, op05TohToh009],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: eb03Nami006.cost + op05TohToh009.cost,
    });

    engine.playCard(eb03Nami006, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.leader.power).toBe(0);
    const deckBeforeTohToh = engine.getView("south").players.south.deckCount;

    engine.playCard(op05TohToh009, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBeforeTohToh - 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not draw merely because Toh-Toh itself has zero power", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05TohToh009],
      deck: [eb01Doma005, eb01Fourtricks025],
      activeDon: op05TohToh009.cost,
    });
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op05TohToh009, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
