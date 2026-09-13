/**
 * Topic suite: choosing numbers and “up to” amounts (CR 1-3-5 / 1-3-5-1).
 *
 * Covers entity up-to (0 and max) and numeric chooseAmount for give-DON!! counts.
 */
import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op03OneTwoJango039,
  op13Otama043,
  op13Yamato054,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("Rules topics: amounts and number choices (1-3-5)", () => {
  test("1-3-5-1: up-to entity selection may choose 0 while candidates exist", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        hand: [op03OneTwoJango039],
        activeDon: 1,
      },
      { character: [op13Otama043] },
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const otamaId = north.findOnField(op13Otama043);

    south.play(op03OneTwoJango039);
    const decision = south.pendingDecision("effectTargetSelection");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected selectEntity step.");
    expect(step.min).toBe(0);
    expect(step.max).toBe(1);
    expect(step.candidates.map((c) => c.ref.id)).toContain(otamaId);

    south.chooseNoTargets();
    south.chooseTargets(eb01MountainGod018);

    expect(
      north.view().players.north.characters.find((card) => card?.instanceId === otamaId)?.rested,
    ).toBe(false);
  });

  test("1-3-5-1: up-to entity selection may choose the maximum (1 of up to 1)", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        hand: [op03OneTwoJango039],
        activeDon: 1,
      },
      { character: [op13Otama043] },
    );
    const south = engine.asSouth();
    const north = engine.asNorth();
    const otamaId = north.findOnField(op13Otama043);

    south.play(op03OneTwoJango039);
    south.chooseTargets(op13Otama043);
    south.chooseTargets(eb01MountainGod018);

    expect(
      north.view().players.north.characters.find((card) => card?.instanceId === otamaId)?.rested,
    ).toBe(true);
  });

  test("1-3-5 / 1-3-5-1: chooseAmount 0 is legal for up-to give DON!! (Yamato)", () => {
    // Yamato: draw 2 if ≤3 Life, then give up to 1 rested DON!! to Leader.
    const engine = OnePieceTestEngine.create({
      hand: [op13Yamato054],
      life: [eb01Doma005, eb01Doma005, eb01Doma005],
      deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
      activeDon: op13Yamato054.cost,
      restedDon: 1,
    });
    const south = engine.asSouth();

    south.play(op13Yamato054);
    const amountStep = south.pendingDecision("effectGiveDonCount").steps[0];
    expect(amountStep).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }],
    });

    south.chooseAmount(0);

    const view = south.view();
    expect(view.players.south.leader.attachedDon).toBe(0);
    expect(view.players.south.restedDon).toBe(op13Yamato054.cost + 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("1-3-5: chooseAmount 1 transfers one rested DON!! (Yamato)", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Yamato054],
      life: [eb01Doma005, eb01Doma005, eb01Doma005],
      deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
      activeDon: op13Yamato054.cost,
      restedDon: 1,
    });
    const south = engine.asSouth();

    south.play(op13Yamato054);
    south.chooseAmount(1);

    const view = south.view();
    expect(view.players.south.leader.attachedDon).toBe(1);
    // Play cost rested DON!! plus the given DON!! leave cost-area rested as paid.
    expect(view.players.south.restedDon).toBe(op13Yamato054.cost);
    expect(view.prompts).toHaveLength(0);
  });

  test("1-3-5: projected amount options are whole numbers ≥ 0 only (no negatives)", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Yamato054],
      life: [eb01Doma005, eb01Doma005, eb01Doma005],
      deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
      activeDon: op13Yamato054.cost,
      restedDon: 1,
    });
    const south = engine.asSouth();

    south.play(op13Yamato054);
    const step = south.pendingDecision("effectGiveDonCount").steps[0];
    expect(step?.kind).toBe("chooseOption");
    if (step?.kind !== "chooseOption") throw new Error("Expected chooseOption amount step.");
    const ids = step.options.map((option) => option.id);
    expect(ids.every((id) => /^(0|[1-9]\d*)$/.test(id))).toBe(true);
    expect(ids).not.toContain("-1");
    expect(ids.some((id) => id.includes("."))).toBe(false);

    south.chooseAmount(0);
  });
});
