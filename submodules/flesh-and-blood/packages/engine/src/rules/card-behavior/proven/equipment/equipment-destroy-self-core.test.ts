/**
 * Hand-authored AAA for destroy-self equipment that pay the equipment as cost
 * for a resource / AP / token effect.
 *
 * Each card module was read end-to-end; scenarios assert the printed happy
 * path, a negative or once-destroyed boundary, and go-again / Instant timing
 * where the text requires it. No script dumps.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, throttleRed, tomeOfFyendalYellow } from "../../../fixtures.ts";

import { blossomOfSpring } from "../../../../../../cards/src/cards/equipment/blossom-of-spring.ts";
import { robeOfRapture } from "../../../../../../cards/src/cards/equipment/robe-of-rapture.ts";
import { aetherIronweave } from "../../../../../../cards/src/cards/equipment/aether-ironweave.ts";
import { achillesAccelerator } from "../../../../../../cards/src/cards/equipment/achilles-accelerator.ts";
import { coatOfFrost } from "../../../../../../cards/src/cards/equipment/coat-of-frost.ts";
import { heartOfFyendalBlue } from "../../../../../../cards/src/cards/resources/heart-of-fyendal.ts";

// ---------------------------------------------------------------------------
// DVR004 blossom-of-spring — Generic Chest d0
// Action - Destroy this: Gain {r}. Go again
//
// Reasoning:
// - Cost is destroy-self (equipment leaves chest immediately as cost).
// - Effect is exactly +1 resource (not pitch, not draw).
// - layerKeywords goAgain must refund the AP spent on the Action.
// - After destroy, a second activate is illegal (card is gone).
// ---------------------------------------------------------------------------

describe("blossom-of-spring (DVR004)", () => {
  it("core mechanic: destroy-self Action gains 1 resource and go again refunds AP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [blossomOfSpring],
        hand: [],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("chest")).toContain(blossomOfSpring.canonicalId);

    Bravo.activate(blossomOfSpring);
    game.passBoth();

    expect(Bravo.zone("chest")).not.toContain(blossomOfSpring.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(blossomOfSpring.canonicalId);
    expect(Bravo.resourcePoints()).toBe(1);
    // Spent 1 AP for the Action, go again refunds it.
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("boundaries: after destroy, activate is no longer legal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [blossomOfSpring],
        hand: [],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(blossomOfSpring);
    game.passBoth();
    expect(() => Bravo.activate(blossomOfSpring)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// ARC117 robe-of-rapture — Wizard Chest d0 + Arcane Barrier 1
// Action - Destroy Robe of Rapture: Gain {r}{r}{r}.
//
// Reasoning (vs blossom):
// - Same destroy-self cost class, but amount is 3 and there is NO go again.
// - Activating as Action must consume the AP (net -1).
// - Arcane Barrier is a separate keyword path; not required to claim core
//   destroy-self AAA, but the equipment must remain seatable until destroyed.
// ---------------------------------------------------------------------------

describe("robe-of-rapture (ARC117)", () => {
  it("core mechanic: destroy-self Action gains 3 resources and spends the Action AP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [robeOfRapture],
        hand: [],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(robeOfRapture);
    game.passBoth();

    expect(Bravo.zone("chest")).not.toContain(robeOfRapture.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(robeOfRapture.canonicalId);
    expect(Bravo.resourcePoints()).toBe(3);
    // No go again — the Action point stays spent.
    expect(Bravo.actionPoints()).toBe(0);
  });

  it("boundaries: activation is illegal with 0 action points", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [robeOfRapture],
        hand: [],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.activate(robeOfRapture)).toThrow();
    expect(Bravo.zone("chest")).toContain(robeOfRapture.canonicalId);
  });
});

// ---------------------------------------------------------------------------
// CHN005 aether-ironweave — Runeblade Chest d1 battleworn
// Action - Destroy: Gain {r}{r}. Only if AAC + non-attack action this turn.
// Go again.
//
// Reasoning:
// - Gate is has-status dual-play (facts: playerAttackActionPlayed &&
//   playerNonAttackActionPlayed). Without either half, activate must fail.
// - Happy path: play Tome of Fyendal (non-attack Action, no Opt prompt) then
//   Snatch (AAC), then activate — destroy, +2 RP, go again.
// - battleworn is defend path; core AAA here is the gated activate, not BB.
// - Note: Force Sight also qualifies as non-attack but Opt leaves an open
//   decision that obscures the dual-play gate under test.
// ---------------------------------------------------------------------------

describe("aether-ironweave (CHN005)", () => {
  it("boundaries: activate is illegal before AAC + non-attack both played", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [aetherIronweave],
        hand: [],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.activate(aetherIronweave)).toThrow();
    expect(Bravo.zone("chest")).toContain(aetherIronweave.canonicalId);
  });

  it("boundaries: only an AAC this turn is still not enough", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [aetherIronweave],
        hand: [snatchRed],
        actionPoints: 2,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expect(() => Bravo.activate(aetherIronweave)).toThrow();
    expect(Bravo.zone("chest")).toContain(aetherIronweave.canonicalId);
  });

  it("core mechanic: after AAC + non-attack, destroy-self gains 2 RP and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [aetherIronweave],
        hand: [tomeOfFyendalYellow, snatchRed],
        actionPoints: 3,
        // Tome costs 1 RP; seed enough so pitch is not required.
        resourcePoints: 2,
        deck: 10,
      },
      { hero: dash, deck: 10 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    // Non-attack Action first (Tome of Fyendal: draw 2, no Opt decision).
    Bravo.play(tomeOfFyendalYellow);
    game.passBoth();

    // Attack Action (Snatch).
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    const rpBefore = Bravo.resourcePoints();
    const apBefore = Bravo.actionPoints();
    Bravo.activate(aetherIronweave);
    game.passBoth();

    expect(Bravo.zone("chest")).not.toContain(aetherIronweave.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(aetherIronweave.canonicalId);
    expect(Bravo.resourcePoints()).toBe(rpBefore + 2);
    // go again refunds the Action AP.
    expect(Bravo.actionPoints()).toBe(apBefore);
  });
});

// ---------------------------------------------------------------------------
// ARC005 achilles-accelerator — Mechanologist Legs d0 + Arcane Barrier 1
// Instant - Destroy Achilles Accelerator: Gain 1 action point.
// Activate only if you have boosted this turn.
//
// Reasoning:
// - abilityType Instant: no Action point cost to activate.
// - Gate is boosted-this-turn (history.turn.boosted / playerBoosted fact).
// - Effect grants +1 AP after destroy.
// - Negative without boost must throw; boost via real Boost keyword card.
// ---------------------------------------------------------------------------

describe("achilles-accelerator (ARC005)", () => {
  it("boundaries: Instant activate is illegal without boosting this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [achillesAccelerator],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);

    expect(() => Dash.activate(achillesAccelerator)).toThrow();
    expect(Dash.zone("legs")).toContain(achillesAccelerator.canonicalId);
  });

  it("core mechanic: after boosting, Instant destroy-self gains 1 action point", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [achillesAccelerator],
        hand: [throttleRed],
        // Throttle costs 2; seed RP and a deck card to banish for boost.
        resourcePoints: 2,
        actionPoints: 1,
        deck: [heartOfFyendalBlue, snatchRed],
      },
      { hero: bravo, life: 40, deck: 8 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);

    // Boost path: play Throttle with boost:true — stamps history.turn.boosted.
    Dash.play(throttleRed, { boost: true });
    expect(game.getState().players[Dash.id]!.history.turn.boosted).toBe(true);
    game.helpers.resolveRestOfCombat();

    const apBefore = Dash.actionPoints();
    Dash.activate(achillesAccelerator);
    game.passBoth();

    expect(Dash.zone("legs")).not.toContain(achillesAccelerator.canonicalId);
    expect(Dash.zone("graveyard")).toContain(achillesAccelerator.canonicalId);
    // Instant (no AP cost) + gain 1 AP.
    expect(Dash.actionPoints()).toBe(apBefore + 1);
  });
});

// ---------------------------------------------------------------------------
// ELE145 coat-of-frost — Ice Chest d0
// Action - Destroy: Create a Frostbite under target hero's control. Go again.
//
// Existing ability-04548867f275 covers controller:any targeting. Here we
// reaffirm go-again AP refund and that the equipment is destroyed as cost.
// ---------------------------------------------------------------------------

describe("coat-of-frost go-again / destroy-self (ELE145)", () => {
  it("core mechanic: destroy-self creates Frostbite on opponent and refunds AP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [coatOfFrost],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(coatOfFrost);

    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const dashInstance =
        decision.candidates.find((c) => c.instanceId === Dash.id)?.instanceId ??
        decision.candidates[0]?.instanceId;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [dashInstance!] },
        },
      });
    }
    game.passBoth();

    expect(Bravo.zone("chest")).not.toContain(coatOfFrost.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(coatOfFrost.canonicalId);
    expect(Dash.zone("arena").some((id) => id.toLowerCase().includes("frostbite"))).toBe(true);
    expect(Bravo.actionPoints()).toBe(1);
  });
});
