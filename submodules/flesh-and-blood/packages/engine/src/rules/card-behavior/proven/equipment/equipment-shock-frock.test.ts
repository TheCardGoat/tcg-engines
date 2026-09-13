/**
 * AST004 Shock Frock — Lightning Chest d1 Battleworn.
 *
 * Printed:
 *   Action - Destroy this: Gain {r}. Activate this only if you've played a
 *   Lightning card this turn. Go again
 *   Battleworn
 *
 * Reasoning (hand-authored):
 * 1. Activation condition played-this turn filter types Lightning (type-line
 *    cross-match includes talent supertype).
 * 2. Play Flash (ELE177 Lightning Action cost 0) to arm the gate, then
 *    activate → destroy-self, +1{r}, go again refunds Action AP.
 * 3. Without Lightning play this turn → activate illegal.
 * 4. Non-Lightning AAC (snatch) does not arm the gate.
 * 5. Battleworn first defend d1 −1.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { shockFrock } from "../../../../../../cards/src/cards/equipment/shock-frock.ts";
import { flashRed } from "../../../../../../cards/src/cards/actions/flash.ts";

const SNATCH = 4;
const LIFE = 20;

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
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "ordering",
            orderedIds: decision.entries.map((e) => e.id),
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

describe("shock-frock (AST004)", () => {
  it("core mechanic: after Lightning play, destroy → +{r} + go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [shockFrock],
        hand: [flashRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const apBefore = Bravo.actionPoints();

    // Arm played-this Lightning gate (non-attack Lightning Action).
    Bravo.play(flashRed);
    drain(game);

    const rpBefore = Bravo.resourcePoints();
    Bravo.activate(shockFrock);
    drain(game);

    expect(Bravo.zone("chest")).not.toContain(shockFrock.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(shockFrock.canonicalId);
    expect(Bravo.resourcePoints()).toBe(rpBefore + 1);
    // Action destroy costs 1 AP; go again refunds it (Flash may also leave AP).
    expect(Bravo.actionPoints()).toBeGreaterThanOrEqual(apBefore - 1);
  });

  it("boundaries: no Lightning illegal; snatch alone illegal; BW d1", () => {
    // No cards played → illegal.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        chest: [shockFrock],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => bare.as(bravo).activate(shockFrock)).toThrow();
    expect(bare.as(bravo).zone("chest")).toContain(shockFrock.canonicalId);

    // Non-Lightning AAC does not arm the gate.
    const snatchOnly = FabTestEngine.start(
      {
        hero: bravo,
        chest: [shockFrock],
        hand: [snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false },
    );
    snatchOnly.as(bravo).attackWith(snatchRed);
    drain(snatchOnly);
    snatchOnly.helpers.resolveRestOfCombat();
    drain(snatchOnly);
    expect(() => snatchOnly.as(bravo).activate(shockFrock)).toThrow();
    expect(snatchOnly.as(bravo).zone("chest")).toContain(shockFrock.canonicalId);

    // Battleworn.
    const bw = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [shockFrock],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = bw.as(dash);
    const plateId = Defender.findCardInZone("chest", shockFrock);
    bw.as(bravo).attackWith(snatchRed);
    Defender.defendWith(shockFrock);
    drain(bw);
    bw.helpers.resolveRestOfCombat();
    expect(Defender.zone("chest")).toContain(shockFrock.canonicalId);
    expect(bw.objectState(plateId)?.defenseCounterTotal).toBe(-1);
    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));

    const a1 = shockFrock.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.condition).toMatchObject({
      type: "played-this",
      per: "turn",
      filter: { typeBox: { supertypes: ["Lightning"] } },
    });
    expect(a1.effect).toMatchObject({ type: "gain-resources", amount: 1 });
    expect(a1.layerKeywords).toBeDefined();
  });
});
