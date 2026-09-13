import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { weaveIceRed } from "./weave-ice.ts";
import { putOnIceRed } from "./put-on-ice.ts";
import { nekria } from "../allies/nekria.ts";
import { succumbToWinterRed } from "./succumb-to-winter.ts";

/**
 * Succumb to Winter (UPR110) — Ice Fusion. Deal 5 arcane to any target.
 * If fused and targets a hero, destroy a frozen card in their arsenal.
 * If fused and targets a frozen ally, destroy that ally.
 *
 * Ice Fusion reveal stays in hand (CR 8.3.17). Deal-damage stamps
 * `targets-a-hero` so the fused rider does not throw.
 */

describe("Succumb to Winter (UPR110) AAA", () => {
  it("happy: unfused deals 5 arcane to the targeted hero", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [succumbToWinterRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(succumbToWinterRed, { target: Dash.id });
    game.passBoth();
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Iyslander, succumbToWinterRed).toBeIn("graveyard");
  });

  it("boundary: fused targeting a hero deals 5 and does not throw", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [succumbToWinterRed, weaveIceRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(succumbToWinterRed, {
      target: Dash.id,
      fuse: true,
      fuseCards: [weaveIceRed],
    });
    expectFabCard(Iyslander, weaveIceRed).toBeIn("hand");
    game.passBoth();
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Iyslander, succumbToWinterRed).toBeIn("graveyard");
  });

  it("timing: fused targeting a frozen Ally destroys that exact non-combat target", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [putOnIceRed, succumbToWinterRed, weaveIceRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arena: [nekria], life: 20, resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    const Dash = game.as(dash);
    const nekriaId = Dash.findCardInZone("arena", nekria);
    Iyslander.play(putOnIceRed, { target: nekriaId });
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });
    expectFabCard(Dash, nekria).toBeFrozen();

    Iyslander.play(succumbToWinterRed, {
      target: nekriaId,
      fuse: true,
      fuseCards: [weaveIceRed],
    });
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Dash, nekria).toBeIn("graveyard");
    expectFabCard(Iyslander, succumbToWinterRed).toBeIn("graveyard");
  });
});
