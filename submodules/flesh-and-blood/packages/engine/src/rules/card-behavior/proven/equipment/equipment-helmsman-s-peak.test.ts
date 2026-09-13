/**
 * SEA180 Helmsman's Peak — Generic Head d1 Blade Break.
 *
 * Printed:
 *   When this defends, look at the top card of your deck.
 *   Blade Break
 *
 * Reasoning (hand-authored):
 * 1. Defend subject:self — co-defender must not fire look.
 * 2. Look top of controller deck is decisionless observation (look event).
 * 3. Deck top unchanged; informational only.
 * 4. Blade Break d1 after defend.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { helmsmanSPeak } from "../../../../../../cards/src/cards/equipment/helmsman-s-peak.ts";

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

describe("helmsman-s-peak (SEA180)", () => {
  it("core mechanic: defend → look top of deck; BB d1", () => {
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
        head: [helmsmanSPeak],
        hand: [],
        // Top = last element.
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, snatchRed],
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);
    const topBefore = Defender.zone("deck").at(-1);
    const deckLenBefore = Defender.zone("deck").length;
    expect(topBefore).toBe(snatchRed.canonicalId);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(helmsmanSPeak);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    // Look event fired; deck top order preserved (look is non-destructive).
    expect(game.committedEvents().some((e) => e.name === "look")).toBe(true);
    expect(Defender.zone("deck").length).toBe(deckLenBefore);
    expect(Defender.zone("deck").at(-1)).toBe(topBefore);
    // Blade Break.
    expect(Defender.zone("graveyard")).toContain(helmsmanSPeak.canonicalId);
    expect(Defender.zone("head")).not.toContain(helmsmanSPeak.canonicalId);
    expect(Defender.life()).toBe(LIFE - (SNATCH - HELM_D));
  });

  it("boundaries: co-defender alone does not fire look; subject:self model", () => {
    // Defend only with hand card (not helm) — no look from peak.
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
        head: [helmsmanSPeak],
        hand: [nimblismBlue],
        deck: [snatchRed, snatchRed, snatchRed],
      },
      { autoPassPriority: false },
    );
    co.as(bravo).attackWith(snatchRed);
    // Only hand block — peak stays seated (not defending).
    co.as(dash).defendWith(nimblismBlue);
    drain(co);
    co.helpers.resolveRestOfCombat();
    drain(co);

    const lookFromPeak = co
      .committedEvents()
      .filter((e) => e.name === "look")
      .some((e) => e.source?.canonicalId === helmsmanSPeak.canonicalId);
    expect(lookFromPeak).toBe(false);
    expect(co.as(dash).zone("head")).toContain(helmsmanSPeak.canonicalId);

    const a1 = helmsmanSPeak.base.abilities?.[0];
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
      type: "look",
      target: {
        player: "controller",
        zones: ["deck"],
        position: "top",
        count: 1,
      },
    });
  });
});
