import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dromai } from "../heroes/dromai.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { frostSpikeBlue } from "../instants/frost-spike.ts";
import { smolderingScales } from "./smoldering-scales.ts";

/**
 * Smoldering Scales — Draconic Chest d2, Guardwell.
 *
 * Printed: "If one or more Frostbite tokens would be created under your
 * control, instead you may destroy this. Guardwell"
 */

describe("Smoldering Scales (PEN253) AAA", () => {
  it("happy: accepting destroys the scales and no Frostbite is created", () => {
    const game = FabTestEngine.start(
      { hero: iyslander, hand: [frostSpikeBlue], actionPoints: 1, deck: 6 },
      { hero: dromai, chest: [smolderingScales], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);
    const Iyslander = game.as(iyslander);

    Iyslander.play(frostSpikeBlue, { target: Dromai.id });
    game.untilIdle({ optionals: "accept" });

    expectFabCard(Dromai, smolderingScales).toBeIn("graveyard");
    expectFabToken(game, "frostbite").toHaveCount(0);
  });

  it("boundary: declining creates the Frostbite and the scales stay seated", () => {
    const game = FabTestEngine.start(
      { hero: iyslander, hand: [frostSpikeBlue], actionPoints: 1, deck: 6 },
      { hero: dromai, chest: [smolderingScales], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);
    const Iyslander = game.as(iyslander);

    Iyslander.play(frostSpikeBlue, { target: Dromai.id });
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Dromai, smolderingScales).toBeIn("chest");
    expect(Dromai.zone("head")).toContain("token:frostbite");
  });
});
