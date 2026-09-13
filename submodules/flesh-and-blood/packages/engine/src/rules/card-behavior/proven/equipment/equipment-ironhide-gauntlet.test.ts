/**
 * MON243 Ironhide Gauntlet — Generic Arms d0.
 *
 * Printed:
 *   When you defend with Ironhide Gauntlet, you may pay {r}. If you do, it gains
 *   +2{d} and "When the combat chain closes, destroy Ironhide Gauntlet."
 *
 * Reasoning (hand-authored; arms twin of Ironhide Helm/Plate):
 * 1. Defend subject:self fires optional pay {r}.
 * 2. Accept → +2{d} for the block (snatch 4−2) and delayed chain-close destroy.
 * 3. Chain closes → gauntlet destroyed to GY.
 * 4. Decline → d0 full damage, gauntlet survives equipped.
 * 5. Remodel: subject:self + delayed-trigger (was name filter + grant-property).
 *
 * Status: ✅ optional pay +2{d} + destroy on close; decline survives; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { ironhideGauntlet } from "../../../../../../cards/src/cards/equipment/ironhide-gauntlet.ts";

const SNATCH = 4;
const LIFE = 20;

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { acceptOptional?: boolean } = {},
): void {
  const accept = opts.acceptOptional ?? false;
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: pick ? [pick.instanceId] : [],
          },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("ironhide-gauntlet (MON243)", () => {
  it("core mechanic: defend optional pay {r} → +2{d} then destroy on chain close", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        arms: [ironhideGauntlet],
        resourcePoints: 1,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(ironhideGauntlet);
    drain(game, { acceptOptional: true });
    game.helpers.resolveRestOfCombat();
    drain(game, { acceptOptional: true });

    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    expect(Defender.resourcePoints()).toBe(0);
    expect(Defender.zone("graveyard")).toContain(ironhideGauntlet.canonicalId);
    expect(Defender.zone("arms")).not.toContain(ironhideGauntlet.canonicalId);
  });

  it("boundaries: decline pay → d0 full damage, gauntlet survives; subject:self model", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        arms: [ironhideGauntlet],
        resourcePoints: 1,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(ironhideGauntlet);
    drain(game, { acceptOptional: false });
    game.helpers.resolveRestOfCombat();
    drain(game, { acceptOptional: false });

    expect(Defender.life()).toBe(LIFE - SNATCH);
    expect(Defender.resourcePoints()).toBe(1);
    expect(Defender.zone("arms")).toContain(ironhideGauntlet.canonicalId);
    expect(Defender.zone("graveyard")).not.toContain(ironhideGauntlet.canonicalId);

    const a1 = ironhideGauntlet.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || a1.staticKind !== "triggered" || a1.resolution.kind !== "effect")
      return;
    expect(a1.trigger).toMatchObject({
      kind: "event",
      event: {
        name: "defend",
        actor: {
          kind: "player",
          player: "ability-controller",
        },
        observes: {
          kind: "source",
          selector: "defender",
        },
      },
    });
    expect(a1.resolution.effect).toMatchObject({
      type: "optional",
      effect: { type: "pay" },
      then: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "defense",
            amount: 2,
            target: { selector: "self" },
          },
          {
            type: "delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "combat-chain-close",
                actor: {
                  kind: "none",
                },
                observes: {
                  kind: "none",
                },
              },
            },
            policy: {
              kind: "windowed",
              duration: "this-combat-chain",
              matching: "first",
            },
            resolution: {
              kind: "effect",
              effect: { type: "destroy", target: { selector: "self" } },
            },
          },
        ],
      },
    });
  });
});
