import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { goldenSkullYellow } from "./golden-skull.ts";
import { nimblismBlue } from "./nimblism.ts";
import { amuletOfOblationBlue } from "./amulet-of-oblation.ts";
import { lightenTheLoadRed } from "./lighten-the-load.ts";

/**
 * Lighten the Load (PEN171) — Pirate Action - Attack, cost 0, 4{p}.
 *
 * Printed: When this attacks, you may discard a card or destroy an item you
 * control. If you do, this gets go again.
 * Modal may (discard | destroy an item) is a real choice; paying either arm latches the printed go again.
 */

describe("Lighten the Load family AAA", () => {
  it("happy: this is a 4{p} attack; the discard/destroy may is offered", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [lightenTheLoadRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(lightenTheLoadRed, { stopAt: "on-attack" });
    Gravy.accept();
    // No Item is seated, so the destroy arm is hidden — only the payable
    // discard arm is published.
    const modal = game.pendingDecision();
    if (!modal || modal.kind !== "effect-resolution") {
      throw new Error("Expected the discard/destroy modal after accepting the may.");
    }
    expect(modal.options.map((option) => option.id)).toEqual(["option-0"]);
    Gravy.choose("discard");
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ entityTargets: "minimum" });

    expectFabPlayer(Gravy).toHaveAP(1);
    expectFabPlayer(Gravy).toHaveHandCount(0);
  });

  it("happy: the destroy-item arm pays the may and latches go again", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [lightenTheLoadRed],
        arena: [goldenSkullYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(lightenTheLoadRed, { stopAt: "on-attack" });
    Gravy.accept();
    // Empty hand hides the discard arm; only the destroy arm remains.
    const modal = game.pendingDecision();
    if (!modal || modal.kind !== "effect-resolution") {
      throw new Error("Expected the discard/destroy modal after accepting the may.");
    }
    expect(modal.options.map((option) => option.id)).toEqual(["option-1"]);
    Gravy.choose("destroy");
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ entityTargets: "minimum" });

    expectFabPlayer(Gravy).toHaveAP(1);
    expectFabCard(Gravy, goldenSkullYellow).toBeIn("graveyard");
  });

  it("boundary: empty extra hand still attacks at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [lightenTheLoadRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(lightenTheLoadRed, { stopAt: "on-attack" });
    // With nothing to offer, declining is the honest read of the printed may.
    Gravy.decline();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabPlayer(Gravy).toHaveAP(0);
  });

  it("timing: declining the optional leaves the extra card in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [lightenTheLoadRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(lightenTheLoadRed, { stopAt: "on-attack" });
    if (game.waitState().kind === "decision") {
      Gravy.decline();
    }
    game.advanceUntil({ stopAt: "defend" });
    game.closeCombat();
    expectFabCard(Gravy, nimblismBlue).toBeIn("hand");
    expectFabPlayer(Gravy).toHaveAP(0);
  });

  it("happy: paying the destroy-item arm latches go again too", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        arena: [amuletOfOblationBlue],
        hand: [lightenTheLoadRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.playAttack(lightenTheLoadRed, { stopAt: "on-attack" });
    // Second printed paying arm: destroy the seated Item instead of discarding.
    Gravy.accept();
    Gravy.choose("destroy");
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ entityTargets: "minimum" });

    expectFabCard(Gravy, amuletOfOblationBlue).toBeIn("graveyard");
    expectFabPlayer(Gravy).toHaveAP(1); // either paying arm grants go again
    expectFabPlayer(Gravy).toHaveHandCount(1); // the extra card stays
  });
});
