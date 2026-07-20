import { describe, expect, test } from "vite-plus/test";
import { op04GumGumRedRoc056, op12Karasu085 } from "@tcg/op-cards";
import { op13MonkeyDDragon017 } from "../../../../../cards/src/cards/OP13/characters/017-monkey-d-dragon.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-017 Monkey.D.Dragon", () => {
  test("once replaces opponent-effect removal of a Revolutionary Army Character with its power bonus", () => {
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
      (op13MonkeyDDragon017.power ?? 0) + 2000,
    );

    engine.playCard(op04GumGumRedRoc056, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "north");
    view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(
      protectedId,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
