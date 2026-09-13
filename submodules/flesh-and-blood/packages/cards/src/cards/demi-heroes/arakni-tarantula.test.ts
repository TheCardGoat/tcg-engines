import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakniMarionette } from "../heroes/arakni-marionette.ts";
import { arakniTarantula } from "./arakni-tarantula.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";

/**
 * Arakni, Tarantula (HNT007) — demi hero aura rider.
 *
 * Printed (rider): Whenever a dagger you own hits a hero, they lose 1{h}.
 */

describe("Arakni, Tarantula (HNT007) AAA", () => {
  it("happy: a dagger you own hits for printed damage plus the rider drain", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        arena: [arakniTarantula],
        weapon1: [nerveScalpel],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);
    const Dash = game.as(dash);

    Arakni.activate(nerveScalpel);
    game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
    expect(Dash.life()).toBe(18); // scalpel 1 + rider 1
  });

  it("boundary: non-dagger weapons swing without the rider", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        arena: [arakniTarantula],
        weapon1: [cintariSaber],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);
    const Dash = game.as(dash);

    Arakni.activate(cintariSaber);
    game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
    expect(Dash.life()).toBe(18); // saber 2, no drain
  });
});
