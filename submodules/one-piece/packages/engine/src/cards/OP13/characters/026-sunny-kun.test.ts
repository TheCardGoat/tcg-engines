import { describe, expect, test } from "vite-plus/test";
import { op13SunnyKun026 } from "../../../../../cards/src/cards/characters/op13-026-sunny-kun.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-026 Sunny-Kun", () => {
  test("once per turn rests one DON!! for power through the opponent's next turn", () => {
    const engine = OnePieceTestEngine.create({ character: [op13SunnyKun026], activeDon: 1 });
    const sunnyId = engine.findCardInZone("south", "character", op13SunnyKun026);

    engine.activateEffect(sunnyId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    let view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.restedDon).toBe(1);
    expect(view.players.south.characters.find((card) => card?.instanceId === sunnyId)?.power).toBe(
      (op13SunnyKun026.power ?? 0) + 2000,
    );
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: sunnyId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);

    engine.endTurn("south");
    expect(
      engine.getView("north").players.south.characters.find((card) => card?.instanceId === sunnyId)
        ?.power,
    ).toBe((op13SunnyKun026.power ?? 0) + 2000);
    engine.endTurn("north");
    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === sunnyId)?.power).toBe(
      op13SunnyKun026.power,
    );
  });

  test("cannot activate without an active DON!! card", () => {
    const engine = OnePieceTestEngine.create({ character: [op13SunnyKun026] });
    const sunnyId = engine.findCardInZone("south", "character", op13SunnyKun026);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: sunnyId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({ character: [op13SunnyKun026], activeDon: 1 });
    const sunnyId = engine.findCardInZone("south", "character", op13SunnyKun026);
    engine.activateEffect(sunnyId, "activateMain", "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
