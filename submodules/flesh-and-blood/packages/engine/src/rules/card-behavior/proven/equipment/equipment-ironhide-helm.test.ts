/**
 * MON241 Ironhide Helm — Generic Head d0.
 *
 * Printed:
 *   When you defend with Ironhide Helm, you may pay {r}. If you do, it gains
 *   +2{d} and "When the combat chain closes, destroy Ironhide Helm."
 *
 * Reasoning (hand-authored):
 * 1. Defend with helm fires optional pay {r}.
 * 2. Accept → +2{d} for the block (snatch 4−2) and grant chain-close destroy.
 * 3. Chain closes → helm destroyed to GY.
 * 4. Decline → d0 full damage, helm survives equipped.
 * 5. Trigger subject:self (model was name-filter "Ironhide Helm").
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { ironhideHelm } from "../../../../../../cards/src/cards/equipment/ironhide-helm.ts";

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

describe("ironhide-helm (MON241)", () => {
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
        head: [ironhideHelm],
        resourcePoints: 1,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(ironhideHelm);
    // Accept optional pay for +2{d} + chain-close destroy.
    drain(game, { acceptOptional: true });
    game.helpers.resolveRestOfCombat();
    // Drain chain-close destroy trigger if still pending.
    drain(game, { acceptOptional: true });

    // +2{d} block: snatch 4 − 2 = 2 damage.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    expect(Defender.resourcePoints()).toBe(0);
    // Chain-close destroy.
    expect(Defender.zone("graveyard")).toContain(ironhideHelm.canonicalId);
    expect(Defender.zone("head")).not.toContain(ironhideHelm.canonicalId);
  });

  it("boundaries: decline pay → d0 full damage, helm survives; subject:self model", () => {
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
        head: [ironhideHelm],
        resourcePoints: 1,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(ironhideHelm);
    drain(game, { acceptOptional: false });
    game.helpers.resolveRestOfCombat();
    drain(game, { acceptOptional: false });

    expect(Defender.life()).toBe(LIFE - SNATCH);
    expect(Defender.resourcePoints()).toBe(1);
    expect(Defender.zone("head")).toContain(ironhideHelm.canonicalId);
    expect(Defender.zone("graveyard")).not.toContain(ironhideHelm.canonicalId);

    const a2 = ironhideHelm.base.abilities?.find(
      (a) => a.id === "kJJJmpKfCzqkzCM9DW9Nw:whenDefendIronhideHelmMayPayIfDoGains",
    );
    expect(a2?.kind).toBe("static");
    if (a2?.kind !== "static" || !a2.trigger) return;
    expect(a2.trigger).toMatchObject({
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
  });
});
