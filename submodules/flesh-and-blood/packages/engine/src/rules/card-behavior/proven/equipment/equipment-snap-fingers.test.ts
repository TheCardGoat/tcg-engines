/**
 * OMN050 Snap Fingers — Lightning Runeblade Arms d0 arcane 1.
 *
 * Printed:
 *   Instant - {r}, destroy this: Target Lightning attack action card you
 *   control on the active chain link deals 1 arcane damage to the defending
 *   hero.
 *
 * Card model fix: parser-garbage filter (subtypes Card/You/Control) →
 * types:[Action] subtypes:[Attack] supertypes:[Lightning] player:controller.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue, frayingLifeforceRed } from "../../../fixtures.ts";
import { snapFingers } from "../../../../../../cards/src/cards/equipment/snap-fingers.ts";

const LIFE = 40;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let s = 0; s < 80; s += 1) {
    const d = game.getState().decision;
    if (d?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: d.actorId,
        payload: {
          decisionId: d.decisionId,
          stateVersion: d.stateVersion,
          answer: { kind: "boolean", value: false },
        },
      });
      continue;
    }
    if (d?.kind === "entity-target") {
      game.exec({
        move: "answer-decision",
        actorId: d.actorId,
        payload: {
          decisionId: d.decisionId,
          stateVersion: d.stateVersion,
          answer: { kind: "entity-target", instanceIds: [d.candidates[0]!.instanceId] },
        },
      });
      continue;
    }
    if (d?.kind === "payment") {
      const pick = d.candidates[0];
      game.exec({
        move: "answer-decision",
        actorId: d.actorId,
        payload: {
          decisionId: d.decisionId,
          stateVersion: d.stateVersion,
          answer: { kind: "payment", instanceIds: pick ? [pick.instanceId] : [] },
        },
      });
      continue;
    }
    if (d) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      try {
        game.exec({ move: "pass", actorId: prio, payload: {} });
      } catch {
        return;
      }
      continue;
    }
    return;
  }
}

describe("snap-fingers (OMN050)", () => {
  it("core: Instant {r}+destroy → Lightning AAC deals 1 arcane to defending hero", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [snapFingers],
        hand: [frayingLifeforceRed, nimblismBlue],
        actionPoints: 1,
        resourcePoints: 0,
        life: LIFE,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    // Play Fraying Lifeforce (Lightning AAC, p7, cost 2) — pitch nimblism.
    Attacker.play(frayingLifeforceRed, { target: Defender.id, pitch: [nimblismBlue] });
    // Walk to Defend step — defender has priority first.
    game.passBoth();
    // Now defender passes; combat should be at reaction step where attacker
    // can activate Instant abilities. But we don't want to close the chain.
    // Actually after defender passes at defend step (no blocks), the game
    // proceeds to reaction step where attacker gets priority.
    // Let the defender pass their Defend-step priority.
    const prio0 = game.getState().priority?.holderPlayerId;
    if (prio0 === Defender.id) {
      game.exec({ move: "pass", actorId: prio0, payload: {} });
    }

    // The blue pitch generated 3{r}; after Fraying's 2{r} cost, its surplus
    // publicly pays this Instant's 1{r} cost.
    expect(Attacker.resourcePoints()).toBe(1);
    const lifeBefore = Defender.life();

    // Activate Snap Fingers Instant — attacker has priority now.
    Attacker.activate(snapFingers);
    drain(game);

    // Arms destroyed → GY; RP consumed.
    expect(Attacker.zone("arms")).not.toContain(snapFingers.canonicalId);
    expect(Attacker.zone("graveyard")).toContain(snapFingers.canonicalId);
    expect(Attacker.resourcePoints()).toBe(0);

    // 1 arcane damage dealt (life dropped).
    expect(Defender.life()).toBeLessThan(lifeBefore);

    // Finish combat: total = p7 (no block) + 1 arcane = 8 damage.
    for (let s = 0; s < 20; s += 1) {
      drain(game);
      if (!game.combat() && game.getState().rulesStack.length === 0 && !game.getState().decision)
        break;
      if (game.declareNoDefenseIfPending()) continue;
      const prio = game.getPriorityPlayerId();
      if (prio && !game.getState().decision) {
        try {
          game.exec({ move: "pass", actorId: prio, payload: {} });
        } catch {
          break;
        }
      }
    }
    expect(Defender.life()).toBe(LIFE - 7 - 1);
  });

  it("boundaries: non-Lightning AAC illegal; out-of-combat illegal; 0{r} insufficient", () => {
    // Non-Lightning Snatch Red — no legal Lightning AAC target.
    const noLightning = FabTestEngine.start(
      {
        hero: bravo,
        arms: [snapFingers],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    noLightning.as(bravo).attackWith(snatchRed);
    expect(noLightning.combat()?.step).toBe("defend");
    const reject = noLightning.as(bravo).expectFailure({
      move: "activate",
      payload: { instanceId: noLightning.as(bravo).card(snapFingers) },
    });
    expect(reject.accepted).toBe(false);

    // Out of combat.
    const bare = FabTestEngine.start(
      { hero: bravo, arms: [snapFingers], resourcePoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => bare.as(bravo).activate(snapFingers)).toThrow();

    // 0{r} insufficient.
    const short = FabTestEngine.start(
      {
        hero: bravo,
        arms: [snapFingers],
        hand: [frayingLifeforceRed, nimblismBlue],
        actionPoints: 1,
        resourcePoints: 0,
        life: LIFE,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    short.as(bravo).play(frayingLifeforceRed, { target: short.as(dash).id, pitch: [nimblismBlue] });
    for (let i = 0; i < 8 && short.combat()?.step !== "defend"; i += 1) {
      try {
        short.passBoth();
      } catch {
        break;
      }
    }
    expect(() => short.as(bravo).activate(snapFingers)).toThrow();
    expect(short.as(bravo).zone("arms")).toContain(snapFingers.canonicalId);
  });
});
