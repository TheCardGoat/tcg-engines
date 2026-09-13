/**
 * SUP079 Horns of the Despised — Reviled Head d1 Blade Break.
 *
 * Printed:
 *   When this defends, the crowd boos you.
 *   Blade Break
 *
 * Reasoning (hand-authored):
 * 1. Defend subject:self — co-defenders must not fire boo.
 * 2. Effect crowd-boos controller stamps history.turn.crowdBooed.
 * 3. Blade Break d1 after defend.
 * 4. Boundary: hand-only block with horns seated does not boo.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { hornsOfTheDespised } from "../../../../../../cards/src/cards/equipment/horns-of-the-despised.ts";

const LIFE = 20;
const SNATCH = 4;
const HELM_D = 1;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: false },
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

describe("horns-of-the-despised (SUP079)", () => {
  it("core mechanic: defend → crowd boos defender; BB d1", () => {
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
        head: [hornsOfTheDespised],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);
    expect(game.getState().players[Defender.id]!.history.turn.crowdBooed).toBe(false);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(hornsOfTheDespised);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    expect(game.getState().players[Defender.id]!.history.turn.crowdBooed).toBe(true);
    expect(game.committedEvents().some((e) => e.name === "crowd-boos")).toBe(true);
    expect(Defender.zone("graveyard")).toContain(hornsOfTheDespised.canonicalId);
    expect(Defender.zone("head")).not.toContain(hornsOfTheDespised.canonicalId);
    expect(Defender.life()).toBe(LIFE - (SNATCH - HELM_D));
  });

  it("boundaries: co-defender alone does not boo; subject:self model", () => {
    const co = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [hornsOfTheDespised],
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = co.as(dash);

    co.as(bravo).attackWith(snatchRed);
    Defender.defendWith(nimblismBlue);
    drain(co);
    co.helpers.resolveRestOfCombat();
    drain(co);

    expect(co.getState().players[Defender.id]!.history.turn.crowdBooed).toBe(false);
    expect(Defender.zone("head")).toContain(hornsOfTheDespised.canonicalId);

    const a1 = hornsOfTheDespised.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || a1.staticKind !== "triggered") return;
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
    expect(a1.resolution?.effect).toMatchObject({
      type: "crowd-boos",
      target: "controller",
    });
    expect(hornsOfTheDespised.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "blade-break" })]),
    );
  });
});
