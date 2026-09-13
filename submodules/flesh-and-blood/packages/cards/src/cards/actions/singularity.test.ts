import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { teklovossen } from "../heroes/teklovossen.ts";
import { teklovossenTheMechropotent } from "../demi-heroes/teklovossen-the-mechropotent.ts";
import { dash } from "../heroes/dash.ts";
import { singularityRed } from "./singularity.ts";

describe("Singularity (EVO010) AAA", () => {
  it("happy: transforms the seated hero into Teklovossen, the Mechropotent", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [singularityRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(singularityRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expect(Teklo.hero()).toBe(teklovossenTheMechropotent.canonicalId);
  });

  it("boundary: the construct remains in the arena after transforming", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [singularityRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(singularityRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabCard(Teklo, singularityRed).toBeIn("arena");
  });
});
