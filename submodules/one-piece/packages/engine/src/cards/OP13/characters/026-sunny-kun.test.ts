import { describe, expect, test } from "vite-plus/test";
import { op13SunnyKun026 } from "../../../../../cards/src/cards/OP13/characters/026-sunny-kun.ts";

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
});
