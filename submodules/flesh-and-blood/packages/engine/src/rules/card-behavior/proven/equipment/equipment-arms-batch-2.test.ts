/**
 * ROS214 Four Finger Gloves — Generic Arms d0
 * "Instant - Destroy this: Prevent the next 1 damage that would be dealt to
 * you this turn. Activate this only if you've been dealt damage this turn."
 * (Identical ability to ROS213 bruised-leather.)
 *
 * PEN317 Unyielding Grip — Generic Arms d0 Blade Break
 * "If you have no cards in your hand, this gets +3{d}."
 * Card fix: duration this-turn → permanent (continuous "if" re-evaluates).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, dawnblade, snatchRed } from "../../../fixtures.ts";
import { fourFingerGloves } from "../../../../../../cards/src/cards/equipment/four-finger-gloves.ts";
import { unyieldingGrip } from "../../../../../../cards/src/cards/equipment/unyielding-grip.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

const LIFE = 20;

describe("four-finger-gloves (ROS214)", () => {
  it("core mechanic: after been-dealt-damage, Instant destroy prevents next 1", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnblade],
        hand: [snatchRed],
        actionPoints: 2,
        resourcePoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        arms: [fourFingerGloves],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    // First: Snatch AAC hits for 4 (been-dealt-damage stamps).
    Attacker.play(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Defender.life()).toBe(LIFE - 4);

    // Pass so defender gets priority to activate Instant.
    game.passBoth();
    Defender.activate(fourFingerGloves);
    game.passBoth();

    expect(Defender.zone("arms")).not.toContain(fourFingerGloves.canonicalId);
    expect(Defender.zone("graveyard")).toContain(fourFingerGloves.canonicalId);

    // Second: dawnblade 3 − 1 prevented = 2.
    Attacker.activate(dawnblade);
    game.helpers.resolveRestOfCombat();
    expect(Defender.life()).toBe(LIFE - 4 - 2);
  });

  it("boundaries: activate is illegal before been-dealt-damage", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        arms: [fourFingerGloves],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);

    expect(() => Defender.activate(fourFingerGloves)).toThrow();
    expect(Defender.zone("arms")).toContain(fourFingerGloves.canonicalId);
  });
});

describe("unyielding-grip (PEN317)", () => {
  function armsDefense(
    game: ReturnType<typeof FabTestEngine.start>,
    playerId: string,
  ): number | undefined {
    const state = game.getState();
    const player = state.players[playerId];
    if (!player) return undefined;
    const instanceId = state.containers.zonesByPlayerId[playerId]!.arms.find(
      (id) => state.objects[id]?.canonicalId === unyieldingGrip.canonicalId,
    );
    if (!instanceId) return undefined;
    const view = buildFabRulesView(state);
    return view.object({
      instanceId,
      incarnation: state.objects[instanceId]!.incarnation,
    })?.current.numeric.defense;
  }

  it("core mechanic: empty hand → +3{d} (d0 → d3)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        arms: [unyieldingGrip],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);

    // Empty hand → +3{d}.
    expect(armsDefense(game, Dash.id)).toBe(3);
  });

  it("boundaries: cards in hand → base d0 (no buff)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        arms: [unyieldingGrip],
        hand: [snatchRed],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);

    // Cards in hand → base d0.
    expect(armsDefense(game, Dash.id)).toBe(0);
  });
});
