import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { savingGraceYellow as savingGrace } from "../defense-reactions/saving-grace.ts";
import { prismAwakenerOfSol } from "../heroes/prism-awakener-of-sol.ts";
import { nasrethTheSoulHarrower } from "./nasreth-the-soul-harrower.ts";

/**
 * Nasreth, the Soul Harrower (DTD193) — Shadow Token Demon Ally 6{p}/6{h}.
 *
 * Printed:
 *   Once per Turn Action - 0: Attack
 *   When Nasreth hits a hero, banish a card from their soul. If a Light card
 *   is banished this way, gain 1{h}.
 */

describe("Nasreth, the Soul Harrower (DTD193) AAA", () => {
  it("happy: banishing a Light card from soul gains 1{h}", () => {
    // Arrange — exactly one soul card means the exact-count banish binds it.
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        life: 20,
        arena: [nasrethTheSoulHarrower],
        hand: [],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 25, hand: [], soul: [savingGrace], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);
    const Dash = game.as(dash);

    // Act — free ally attack connects unblocked; soul is empty of choices so
    // the exact-count scan auto-binds Saving Grace.
    Prism.activateAttack(nasrethTheSoulHarrower);
    game.closeCombat({ ordering: "listed" });

    // Assert — 25 − 6 = 19 damage plus the Light banish heal on Nasreth's
    // controller.
    expectFabPlayer(Dash).toHaveLife(19);
    expectFabPlayer(Prism).toHaveLife(21);
    expect(Dash.zone("soul")).toHaveLength(0);
    expectFabCard(Dash, savingGrace).toBeBanished();
    expectFabCard(Prism, nasrethTheSoulHarrower).toBeIn("arena");
  });

  it("boundary: banishing a non-Light soul card never heals", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        life: 20,
        arena: [nasrethTheSoulHarrower],
        hand: [],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 25, hand: [], soul: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);
    const Dash = game.as(dash);

    // Act
    Prism.activateAttack(nasrethTheSoulHarrower);
    game.closeCombat({ ordering: "listed" });

    // Assert — still banished from soul, but no Light-side gain 1{h}.
    expectFabPlayer(Dash).toHaveLife(19);
    expectFabPlayer(Prism).toHaveLife(20);
    expect(Dash.zone("soul")).toHaveLength(0);
    expectFabCard(Dash, snatchRed).toBeBanished();
  });

  it("boundary: a fully defended miss leaves the soul untouched", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        life: 20,
        arena: [nasrethTheSoulHarrower],
        hand: [],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      {
        hero: dash,
        life: 25,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        soul: [savingGrace],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);
    const Dash = game.as(dash);

    // Act — three 2{d} actions absorb the full 6{p}.
    Prism.activateAttack(nasrethTheSoulHarrower);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat({ ordering: "listed" });

    // Assert
    expectFabPlayer(Dash).toHaveLife(25);
    expectFabPlayer(Prism).toHaveLife(20);
    expect(Dash.zone("soul")).toHaveLength(1);
    expectFabCard(Dash, savingGrace).toBeIn("soul");
  });
});
