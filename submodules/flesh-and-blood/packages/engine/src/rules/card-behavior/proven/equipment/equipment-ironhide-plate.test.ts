/**
 * MON242 Ironhide Plate — Generic Chest d0.
 *
 * Printed:
 *   When you defend with Ironhide Plate, you may pay {r}. If you do, it gains
 *   +2{d} and destroy it when the combat chain closes.
 *
 * Reasoning (case-by-case; Ironhide Helm twin):
 * 1. Prior model used filter.name "Ironhide Plate" + destroy binding "it".
 *    Helm family already proved subject:self + destroy self is required.
 * 2. Optional pay {r} → +2{d} for the block (snatch 4−2) + chain-close destroy.
 * 3. Decline → d0 full damage, plate stays in chest, RP kept.
 * 4. 0 RP cannot accept optional pay path (decline/survive).
 *
 * Status: ✅ optional pay +2{d} then destroy; decline; model subject:self.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { ironhidePlate } from "../../../../../../cards/src/cards/equipment/ironhide-plate.ts";

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

describe("ironhide-plate (MON242)", () => {
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
        chest: [ironhidePlate],
        resourcePoints: 1,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(ironhidePlate);
    drain(game, { acceptOptional: true });
    game.helpers.resolveRestOfCombat();
    drain(game, { acceptOptional: true });

    // +2{d} block: snatch 4 − 2 = 2 damage.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    expect(Defender.resourcePoints()).toBe(0);
    expect(Defender.zone("graveyard")).toContain(ironhidePlate.canonicalId);
    expect(Defender.zone("chest")).not.toContain(ironhidePlate.canonicalId);
  });

  it("boundaries: decline pay → d0 full damage, plate survives; subject:self model", () => {
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
        chest: [ironhidePlate],
        resourcePoints: 1,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(ironhidePlate);
    drain(game, { acceptOptional: false });
    game.helpers.resolveRestOfCombat();
    drain(game, { acceptOptional: false });

    expect(Defender.life()).toBe(LIFE - SNATCH);
    expect(Defender.resourcePoints()).toBe(1);
    expect(Defender.zone("chest")).toContain(ironhidePlate.canonicalId);
    expect(Defender.zone("graveyard")).not.toContain(ironhidePlate.canonicalId);

    const a1 = ironhidePlate.base.abilities?.[0];
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
      then: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "defense",
            op: "add",
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
