/**
 * ROS213 Bruised Leather — Generic Chest d0
 * "Instant - Destroy this: Prevent the next 1 damage that would be dealt to
 * you this turn. Activate this only if you've been dealt damage this turn."
 *
 * AUR005 Aether Crackers — Runeblade Arms d0
 * "When an attack you control hits a hero, you may destroy this. If you do,
 * deal 1 arcane damage to them."
 *
 * Card fix AUR005: subtypes:["Attack"] → types:["Attack"] (Attack is a FAB type).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, dawnblade, snatchRed } from "../../../fixtures.ts";
import { bruisedLeather } from "../../../../../../cards/src/cards/equipment/bruised-leather.ts";
import { aetherCrackers } from "../../../../../../cards/src/cards/equipment/aether-crackers.ts";

const LIFE = 20;

describe("bruised-leather (ROS213)", () => {
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
        chest: [bruisedLeather],
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

    // Pass attacker priority so defender gets a window to activate Instant.
    game.passBoth();

    // Now activate bruised-leather Instant (condition: been-dealt-damage).
    Defender.activate(bruisedLeather);
    game.passBoth();

    expect(Defender.zone("chest")).not.toContain(bruisedLeather.canonicalId);
    expect(Defender.zone("graveyard")).toContain(bruisedLeather.canonicalId);

    // Second: dawnblade 3 damage − 1 prevented = 2.
    Attacker.activate(dawnblade);
    game.helpers.resolveRestOfCombat();
    expect(Defender.life()).toBe(LIFE - 4 - 2);
  });

  it("boundaries: activate is illegal before been-dealt-damage this turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        chest: [bruisedLeather],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);

    expect(() => Defender.activate(bruisedLeather)).toThrow();
    expect(Defender.zone("chest")).toContain(bruisedLeather.canonicalId);
  });
});

describe("aether-crackers (AUR005)", () => {
  it("core mechanic: attack hit → optional destroy → 1 arcane to attack-target", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        arms: [aetherCrackers],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    const lifeBefore = Dash.life();
    Bravo.play(snatchRed);
    // Walk combat accepting the optional destroy on hit.
    let answered = false;
    for (let safety = 0; safety < 64; safety += 1) {
      const decision = game.getState().decision;
      if (!answered && decision?.kind === "boolean") {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "boolean", value: true },
          },
        });
        answered = true;
        continue;
      }
      if (decision?.kind === "ordering") {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: {
              kind: "ordering" as const,
              orderedIds: decision.entries.map((e) => e.id),
            },
          },
        });
        continue;
      }
      if (decision) break;
      if (!game.combat() && game.getState().rulesStack.length === 0) break;
      if (game.declareNoDefenseIfPending()) continue;
      const prio = game.getPriorityPlayerId();
      if (prio) {
        game.exec({ move: "pass", actorId: prio, payload: {} });
        continue;
      }
      break;
    }
    game.helpers.resolveRestOfCombat();

    expect(Bravo.zone("arms")).not.toContain(aetherCrackers.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(aetherCrackers.canonicalId);
    // Snatch 4 + ≥1 arcane = ≥5 total damage.
    expect(Dash.life()).toBeLessThanOrEqual(lifeBefore - 5);
  });
});
