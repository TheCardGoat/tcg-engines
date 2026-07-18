import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01TonyTonyChopper006,
  op07TonyTonyChopper103,
  op08DrHiriluk016,
  op08TonyTonyChopper001,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-016 Dr.Hiriluk", () => {
  test("may rest itself to give all Tony Tony.Chopper Characters +2000 this turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op08TonyTonyChopper001,
      character: [op08DrHiriluk016, op07TonyTonyChopper103, eb01TonyTonyChopper006, eb01Doma005],
    });
    const hirilukId = engine.findCardInZone("south", "character", op08DrHiriluk016);
    const firstChopperId = engine.findCardInZone("south", "character", op07TonyTonyChopper103);
    const secondChopperId = engine.findCardInZone("south", "character", eb01TonyTonyChopper006);
    const unrelatedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(hirilukId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    let view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === hirilukId)?.rested,
    ).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === firstChopperId)?.power,
    ).toBe(5000);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === secondChopperId)?.power,
    ).toBe(6000);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === unrelatedId)?.power,
    ).toBe(3000);

    engine.endTurn("south");
    view = engine.getView("north");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === firstChopperId)?.power,
    ).toBe(3000);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === secondChopperId)?.power,
    ).toBe(4000);
  });

  test("with another Leader still pays the rest cost but gives no power", () => {
    const engine = OnePieceTestEngine.create({
      character: [op08DrHiriluk016, op07TonyTonyChopper103],
    });
    const hirilukId = engine.findCardInZone("south", "character", op08DrHiriluk016);
    const chopperId = engine.findCardInZone("south", "character", op07TonyTonyChopper103);

    engine.activateEffect(hirilukId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === hirilukId)?.rested,
    ).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === chopperId)?.power,
    ).toBe(3000);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without resting itself or changing Tony Tony.Chopper's power", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op08TonyTonyChopper001,
      character: [op08DrHiriluk016, op07TonyTonyChopper103],
    });
    const hirilukId = engine.findCardInZone("south", "character", op08DrHiriluk016);
    const chopperId = engine.findCardInZone("south", "character", op07TonyTonyChopper103);

    engine.activateEffect(hirilukId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === hirilukId)?.rested,
    ).toBe(false);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === chopperId)?.power,
    ).toBe(op07TonyTonyChopper103.power);
    expect(view.prompts).toHaveLength(0);
  });
});
