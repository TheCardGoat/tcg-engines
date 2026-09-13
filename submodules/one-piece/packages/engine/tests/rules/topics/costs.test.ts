/**
 * Topic suite: play cost, activation cost, and cost reduction (CR 1-3-6-2, 1-3-9).
 */
import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, eb03Camie015, op03SoapSheep095, op13Otama043 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("Rules topics: costs and cost reduction (1-3-6-2, 1-3-9)", () => {
  test("1-3-9-1: playing a Character rests active DON!! equal to its printed cost", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb01MountainGod018],
      activeDon: 5,
    });
    const south = engine.asSouth();

    south.play(eb01MountainGod018);

    const view = south.view();
    expect(view.players.south.restedDon).toBe(5);
    expect(view.players.south.activeDon).toBe(0);
    expect(south.findOnField(eb01MountainGod018)).toBeTruthy();
  });

  test("1-3-9-1: insufficient active DON!! rejects the play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb01MountainGod018],
      activeDon: 4,
    });
    const south = engine.asSouth();
    const handId = south.findInZone("hand", eb01MountainGod018);

    expect(
      south.expectFailure({
        type: "playCard",
        instanceId: handId,
      }).reason,
    ).toBe("Not enough active DON!! to pay the cost.");

    // Fluent preflight also names the seat method and reason.
    expect(() => south.play(eb01MountainGod018)).toThrow(
      /asSouth\(\)\.play[\s\S]*Not enough active DON!!/i,
    );
  });

  test("1-3-9-2: activation cost rests the Character (Camie restThisCard)", () => {
    const engine = OnePieceTestEngine.create({ character: [eb03Camie015] }, {});
    const south = engine.asSouth();
    const camieId = south.findOnField(eb03Camie015);

    south.activateMain(eb03Camie015);
    south.acceptOptional();

    expect(
      south.view().players.south.characters.find((card) => card?.instanceId === camieId)?.rested,
    ).toBe(true);
  });

  test("1-3-9-2: activation fails when the Character is already rested (cost unpaid)", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb03Camie015, rested: true }] },
      {},
    );
    const south = engine.asSouth();
    const camieId = south.findOnField(eb03Camie015);

    expect(
      south.expectFailure({
        type: "activateEffect",
        sourceInstanceId: camieId,
        trigger: "activateMain",
      }).reason,
    ).toMatch(/activation costs cannot be paid|cannot be activated|rested/i);
  });

  test("1-3-6-2: reduced cost that goes negative is treated as 0 on the card", () => {
    // Soap Sheep: give −2 cost; Otama printed 1 → displayed 0.
    const engine = OnePieceTestEngine.create(
      { hand: [op03SoapSheep095], activeDon: 1 },
      { character: [op13Otama043] },
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const otamaId = north.findOnField(op13Otama043);

    south.play(op03SoapSheep095);
    south.chooseTargets(op13Otama043);

    expect(
      north.view().players.north.characters.find((card) => card?.instanceId === otamaId)?.cost,
    ).toBe(0);
  });

  test("1-3-6-2: a second −2 reduction on cost 0 stays treated as 0 (not negative display)", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03SoapSheep095, op03SoapSheep095],
        activeDon: 2,
      },
      { character: [op13Otama043] },
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const otamaId = north.findOnField(op13Otama043);

    south.play(op03SoapSheep095);
    south.chooseTargets(op13Otama043);
    expect(
      north.view().players.north.characters.find((card) => card?.instanceId === otamaId)?.cost,
    ).toBe(0);

    south.play(op03SoapSheep095);
    south.chooseTargets(op13Otama043);
    // Outside calculations, cost never displays as negative.
    expect(
      north.view().players.north.characters.find((card) => card?.instanceId === otamaId)?.cost,
    ).toBe(0);
  });
});
