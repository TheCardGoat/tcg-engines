import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { voxNecropolis } from "../weapons/vox-necropolis.ts";
import { malice } from "../heroes/malice.ts";
import { corruptedCorpse } from "./corrupted-corpse.ts";

describe("Corrupted Corpse (IAR090) AAA", () => {
  it("happy: a Vox-granted Corpse attack has go again", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arena: [corruptedCorpse],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.activate(corruptedCorpse);
    game.passBoth();

    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
  });

  it("boundary: without Vox the Corpse cannot attack", () => {
    const game = FabTestEngine.start(
      { hero: malice, arena: [corruptedCorpse], resourcePoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(malice).expectActivationRejected(corruptedCorpse);
  });

  it("timing: the granted Attack returns the Corpse to the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arena: [corruptedCorpse],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.activate(corruptedCorpse);
    game.passBoth();
    game.helpers.resolveRestOfCombat();
    expectFabCard(Malice, corruptedCorpse).toBeIn("arena");
  });
});
