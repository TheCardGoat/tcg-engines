import { describe, expect, test } from "vite-plus/test";
import { op04GumGumRedRoc056, op12Karasu085 } from "@tcg/op-cards";
import { op13MonkeyDDragon017 } from "../../../../../cards/src/cards/characters/op13-017-monkey-d-dragon.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-017 Monkey.D.Dragon", () => {
  test("once replaces opponent-effect removal of a Revolutionary Army Character with a 2000 power reduction", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op13MonkeyDDragon017, op12Karasu085, op12Karasu085] },
      { hand: [op04GumGumRedRoc056, op04GumGumRedRoc056], activeDon: 12 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const dragonId = engine.findCardInZone("south", "character", op13MonkeyDDragon017);
    const protectedId = engine.findCardInZone("south", "character", op12Karasu085);

    engine.playCard(op04GumGumRedRoc056, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "north");
    expect(engine.pendingDecision("effectRemovalReplacement", "south").actorId).toBe("south");
    engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");

    let view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(protectedId);
    expect(view.players.south.characters.find((card) => card?.instanceId === dragonId)?.power).toBe(
      (op13MonkeyDDragon017.power ?? 0) - 2000,
    );

    engine.playCard(op04GumGumRedRoc056, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "north");
    view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(
      protectedId,
    );
    expect(view.prompts).toHaveLength(0);
  });
  test("can replace removal even below 2000 power and the reduction expires at turn end", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op13MonkeyDDragon017, op12Karasu085] },
      { hand: ["OP01-006", "OP01-006", "OP01-006", op04GumGumRedRoc056], activeDon: 9 },
      { activeSeat: "north" },
    );
    const dragon = engine.findCardInZone("south", "character", op13MonkeyDDragon017);
    const ally = engine.findCardInZone("south", "character", op12Karasu085);
    for (let i = 0; i < 3; i++) {
      engine.asNorth().play("OP01-006");
      engine.asNorth().chooseTargets(dragon);
    }
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === dragon)?.power,
    ).toBe(1000);
    engine.asNorth().play(op04GumGumRedRoc056);
    engine.asNorth().chooseTargets(ally);
    engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      ally,
    );
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === dragon)?.power,
    ).toBe(-1000);
    engine.asNorth().endTurn();
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === dragon)?.power,
    ).toBe(7000);
  });
});
