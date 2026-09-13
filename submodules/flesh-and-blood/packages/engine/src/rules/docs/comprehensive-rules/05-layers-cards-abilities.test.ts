/**
 * CR Chapter 5 — Layers, Cards & Abilities.
 * 5.1 playing cards; stack presence at Layer Step; cost payment.
 */
import { describe, expect, it } from "vite-plus/test";
import { FabTestEngine } from "../../../testing/test-engine.ts";
import {
  bravo,
  dash,
  nimbleStrikeRed,
  nimblismBlue,
  sigilOfSolaceRed,
  snatchRed,
} from "../../fixtures.ts";
import { brutalAssaultRed } from "../../../../../cards/src/cards/actions/brutal-assault.ts";
import { goliathGauntlet } from "../../../../../cards/src/cards/equipment/goliath-gauntlet.ts";
import { tomeOfTormentRed } from "../../../../../cards/src/cards/actions/tome-of-torment.ts";
import { vigorousWindupRed } from "../../../../../cards/src/cards/actions/vigorous-windup.ts";

describe("CR 5 — Layers, Cards & Abilities", () => {
  it("5.1: playing an attack action from hand pays costs and opens Layer Step on the stack", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.play(snatchRed, { target: game.as(dash).id });
    expect(game.combat()).toMatchObject({ open: true, step: "layer" });
    expect(game.getState().rulesStack.at(-1)).toMatchObject({ kind: "card", role: "attack" });
    expect(Bravo.zone("stack")).toContain(snatchRed.canonicalId);
    expect(Bravo.hand()).not.toContain(snatchRed.canonicalId);
  });

  it("5.1 / 1.14: resource cost is paid when the attack is played (inline pitch)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimbleStrikeRed, nimblismBlue], deck: 6, resourcePoints: 0 },
      { hero: dash, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.play(nimbleStrikeRed, {
      target: game.as(dash).id,
      pitch: [nimblismBlue],
    });
    expect(Bravo.zone("pitch")).toContain(nimblismBlue.canonicalId);
    expect(Bravo.resourcePoints()).toBe(2); // 3 − 1
    expect(game.getState().rulesStack.at(-1)).toMatchObject({ kind: "card", role: "attack" });
  });

  it("5.1 dual: play defaults to opponent hero (no select-attack-target) and deals damage", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    // No target option → opposing hero by default
    Bravo.play(snatchRed);
    game.passBoth(); // card layer resolves → attack
    expect(game.combat()?.step).toBe("attack");
    expect(game.combat()?.activeLink?.attackTargetRef).toEqual({
      kind: "hero",
      playerId: Dash.id,
    });
    game.passBoth(); // → defend
    expect(game.combat()?.step).toBe("defend");
    game.helpers.resolveRestOfCombat();
    expect(Dash.life()).toBe(16);
    expect(Bravo.zone("graveyard")).toContain(snatchRed.canonicalId);
    expect(game.combat()).toBeNull();
  });

  it("5.3: both players can pass after a hit trigger is collected at the damage checkpoint", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const attacker = game.as(bravo);
    const defender = game.as(dash);

    attacker.play(snatchRed, { target: defender.id });
    game.passBoth(); // layer -> attack
    game.passBoth(); // attack -> defend
    game.passBoth(); // defend -> reaction
    game.passBoth(); // reaction -> damage and collect hit trigger
    expect(game.combat()?.step).toBe("damage");
    expect(defender.life()).toBe(16);
    expect(game.getState().rulesStack.at(-1)).toMatchObject({
      kind: "triggered",
      abilityId: `${snatchRed.canonicalId}:drawOnHit`,
    });

    attacker.pass();
    defender.pass();
    expect(attacker.hand()).toHaveLength(1);
    game.passBoth();
    expect(game.combat()?.step).toBe("resolution");
  });

  it("5.3 simplified: after Layer resolves via passes, attack is on the combat chain", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(snatchRed, { target: game.as(dash).id });
    game.passBoth();
    expect(game.combat()?.step).toBe("attack");
    expect(game.as(bravo).zone("combatChain")).toContain(snatchRed.canonicalId);
    expect(game.as(bravo).zone("stack")).not.toContain(snatchRed.canonicalId);
  });

  it("5.1: attack may be played from arsenal", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arsenal: [snatchRed], hand: [nimblismBlue], deck: 8 },
      { hero: dash, life: 20, deck: 8 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.zone("arsenal")).toContain(snatchRed.canonicalId);
    Bravo.playFromArsenal(snatchRed, { target: game.as(dash).id });
    expect(Bravo.zone("arsenal")).toEqual([]);
    expect(game.getState().rulesStack.at(-1)).toMatchObject({ kind: "card", role: "attack" });
    game.passBoth(); // card layer resolves → attack
    game.passBoth();
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(16);
  });

  it("5.1.2a example: Goliath Gauntlet's next-card effect applies when a cost-2 attack is announced", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [goliathGauntlet],
        hand: [brutalAssaultRed],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(goliathGauntlet);
    game.passBoth();
    expect(Bravo.zone("arms")).not.toContain(goliathGauntlet.canonicalId);

    Bravo.play(brutalAssaultRed, { target: Dash.id });
    expect(game.getState().rulesStack.at(-1)).toMatchObject({ kind: "card", role: "attack" });
    game.helpers.resolveRestOfCombat();
    expect(Dash.life()).toBe(12); // printed 6 power + Goliath's announced-card +2
  });

  it("5.1.2b example: Tome of Torment is playable from public banished, but not face-down banished", () => {
    const publicTome = FabTestEngine.start(
      { hero: bravo, banished: [tomeOfTormentRed], deck: [nimblismBlue] },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const PublicBravo = publicTome.as(bravo);
    expect(PublicBravo.play(tomeOfTormentRed, { from: "banished" }).accepted).toBe(true);
    expect(PublicBravo.zone("stack")).toContain(tomeOfTormentRed.canonicalId);

    const privateTome = FabTestEngine.start(
      { hero: bravo, banished: [{ card: tomeOfTormentRed, state: { faceDown: true } }], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const PrivateBravo = privateTome.as(bravo);
    const rejected = PrivateBravo.expectFailure({
      move: "begin-play",
      payload: {
        instanceId: PrivateBravo.findCardInZone("banished", tomeOfTormentRed),
        from: "banished",
      },
    });
    expect(rejected.errorCode).toBe("unsupported_play_permission");
  });

  it("5.2.2 / 5.3: an activated layer from a private source resolves before the lower card layer", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed] },
      { hero: dash, life: 15, hand: [sigilOfSolaceRed, vigorousWindupRed], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(snatchRed, { target: Dash.id });
    Bravo.pass();
    Dash.activate(vigorousWindupRed);
    expect(game.getState().rulesStack).toHaveLength(2);
    expect(game.getState().rulesStack.at(-1)).toMatchObject({ kind: "activated" });
    expect(Dash.zone("hand")).not.toContain(vigorousWindupRed.canonicalId);

    game.passBoth();
    expect(Dash.zone("arena").some((card) => card.toLowerCase().includes("vigor"))).toBe(true);
    expect(game.getState().rulesStack).toHaveLength(1);
    expect(game.getState().rulesStack.at(-1)).toMatchObject({ kind: "card", role: "attack" });
  });

  it("5.3.1: the topmost card layer resolves first, then the attack proceeds to combat", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 15, hand: [sigilOfSolaceRed], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(snatchRed, { target: Dash.id });
    Bravo.pass();
    Dash.play(sigilOfSolaceRed);
    expect(game.getState().rulesStack).toHaveLength(2);

    game.passBoth();
    expect(Dash.life()).toBe(18);
    expect(game.getState().rulesStack).toHaveLength(1);
    expect(game.combat()?.step).toBe("layer");

    game.passBoth();
    expect(game.combat()?.step).toBe("attack");
    expect(game.getState().rulesStack).toEqual([]);
  });
});
