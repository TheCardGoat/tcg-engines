/**
 * CIN002 Kunai of Retribution - Draconic Ninja Dagger 1H - power 1.
 *
 * Printed:
 *   Once per Turn Action - {r}, destroy this when the combat chain closes:
 *   Attack. Go again
 *
 * Reasoning (hand-authored, rides proven ironhide delayed-trigger path):
 * 1. Activate pays {r} and opens a 1-power attack with go again.
 * 2. The weapon stays equipped through the swing (NOT a destroy-self cost -
 *    that removed it before the attack could resolve; see §7 destroy-self as
 *    attack cost FIXED).
 * 3. The activated sequence registers a delayed-trigger on combat-chain-close
 *    that destroys the kunai (same delayed-trigger machinery proven by MON241
 *    ironhide-helm: chain-close -> destroy to GY).
 * 4. Chain closes -> kunai destroyed to graveyard.
 * 5. Boundaries: OPT second activation illegal; insufficient RP illegal.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash } from "../../../fixtures.ts";
import { fai } from "../../../../../../cards/src/cards/heroes/fai.ts";
import { kunaiOfRetribution } from "../../../../../../cards/src/cards/weapons/kunai-of-retribution.ts";

const LIFE = 20;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: true },
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

describe("kunai-of-retribution (CIN002)", () => {
  it("core mechanic: pay 1 RP, attack for 1 with go again, then destroy on chain close", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        weapon1: [kunaiOfRetribution],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Fai = game.as(fai);
    const Opponent = game.as(dash);

    expect(Fai.zone("weapon1")).toContain(kunaiOfRetribution.canonicalId);

    Fai.activate(kunaiOfRetribution);
    // Weapon must still be equipped while attacking (not destroyed as cost).
    expect(Fai.zone("weapon1")).toContain(kunaiOfRetribution.canonicalId);

    game.helpers.resolveRestOfCombat();
    // Flush the delayed chain-close destroy trigger.
    drain(game);

    expect(Opponent.life()).toBe(LIFE - 1);
    expect(Fai.actionPoints()).toBe(1);
    // Printed chain-close destroy: weapon gone from seat, in graveyard.
    expect(Fai.zone("weapon1")).not.toContain(kunaiOfRetribution.canonicalId);
    expect(Fai.zone("graveyard")).toContain(kunaiOfRetribution.canonicalId);
  });

  it("boundaries: OPT second activation illegal and insufficient RP illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        weapon1: [kunaiOfRetribution],
        hand: [],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Fai = game.as(fai);

    Fai.activate(kunaiOfRetribution);
    game.helpers.resolveRestOfCombat();
    drain(game);
    // OPT: second activation in the same turn is illegal.
    expect(() => Fai.activate(kunaiOfRetribution)).toThrow();

    const game2 = FabTestEngine.start(
      {
        hero: fai,
        weapon1: [kunaiOfRetribution],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => game2.as(fai).activate(kunaiOfRetribution)).toThrow();
  });

  it("boundaries: chain close destroys the kunai even without a defense card", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        weapon1: [kunaiOfRetribution],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Fai = game.as(fai);

    Fai.activate(kunaiOfRetribution);
    game.helpers.resolveRestOfCombat();
    drain(game);

    expect(Fai.zone("weapon1")).not.toContain(kunaiOfRetribution.canonicalId);
    expect(Fai.zone("graveyard")).toContain(kunaiOfRetribution.canonicalId);
  });
});
