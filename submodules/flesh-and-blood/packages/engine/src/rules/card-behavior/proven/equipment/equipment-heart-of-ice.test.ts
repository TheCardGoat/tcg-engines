/**
 * ELE144 Heart of Ice — Ice Chest d1 Arcane Barrier 1 Blade Break.
 *
 * Printed:
 *   Once per Turn Action - {r}: Cards and activated abilities cost opposing
 *   heroes additional {r} this turn. Go again
 *   Arcane Barrier 1
 *   Blade Break
 *
 * Reasoning (hand-authored):
 * 1. Stack star for opponent was wrong — "this turn" multi-fire tax on
 *    opponent plays/activates (Savage Sash family, inverse of cost reduce).
 * 2. appliesTo.next hasStatus "another" = non-controller objects (1v1 opponent).
 * 3. Engine: future observation + prospective cost must apply when actor is
 *    not the CE controller (opponent tax path).
 * 4. Play quote must add prospective cost delta (announce latches later).
 * 5. Core: activate HOI → opponent Instant cost 0 becomes 1 (illegal at 0 RP).
 * 6. Without HOI, same Instant free. Go again; OPT; BB.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";
import { heartOfIce } from "../../../../../../cards/src/cards/equipment/heart-of-ice.ts";
import { sigilOfSolaceRed } from "../../../../../../cards/src/cards/instants/sigil-of-solace.ts";

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
      const pick =
        decision.candidates.find((c) => c.instanceId !== decision.actorId) ??
        decision.candidates[0];
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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("heart-of-ice (ELE144)", () => {
  it("core mechanic: OPT Action → opposing Instant costs +1{r} this turn; go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [heartOfIce],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        // Cost-0 Instant; after tax needs 1{r} — seeded 0 so play is illegal.
        hand: [sigilOfSolaceRed, nimblismBlue],
        resourcePoints: 0,
        life: LIFE,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const apBefore = Bravo.actionPoints();

    Bravo.activate(heartOfIce);
    drain(game);

    expect(Bravo.resourcePoints()).toBe(0);
    // Go again refunds Action AP.
    expect(Bravo.actionPoints()).toBe(apBefore);
    expect(game.getState().continuousEffectInstances.length).toBeGreaterThanOrEqual(1);
    const costTax = game
      .getState()
      .continuousEffectInstances.find((inst) =>
        inst.atoms.some(
          (atom) => atom.kind === "numeric" && atom.property === "cost" && atom.operation === "add",
        ),
      );
    expect(costTax?.futureApplicability?.remaining).toBeGreaterThan(1);

    // Open priority for opponent Instant on the same turn (combat defend window).
    Bravo.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Dash.defendWith([]);
    Bravo.pass();
    expect(game.getState().priority?.holderPlayerId).toBe(Dash.id);

    // Sigil's printed cost is 0, so this blue pitch is solely needed for
    // Heart of Ice's additional 1{r} tax.
    Dash.play(sigilOfSolaceRed, { pitch: [nimblismBlue] });
    drain(game);
    expect(Dash.resourcePoints()).toBe(2);
    expect(Dash.zone("hand")).not.toContain(sigilOfSolaceRed.canonicalId);
  });

  it("boundaries: without HOI Instant free; OPT; Blade Break; model", () => {
    const bare = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [sigilOfSolaceRed],
        resourcePoints: 0,
        life: LIFE,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    bare.as(bravo).attackWith(snatchRed);
    bare.as(dash).defendWith([]);
    bare.as(bravo).pass();
    expect(gameCombatPrioIsDash(bare)).toBe(true);
    // Free Instant legal without tax.
    bare.as(dash).play(sigilOfSolaceRed);
    drain(bare);
    expect(bare.as(dash).zone("hand")).not.toContain(sigilOfSolaceRed.canonicalId);

    // OPT: second activate illegal same turn.
    const opt = FabTestEngine.start(
      {
        hero: bravo,
        chest: [heartOfIce],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    opt.as(bravo).activate(heartOfIce);
    drain(opt);
    expect(() => opt.as(bravo).activate(heartOfIce)).toThrow();

    // Blade Break.
    const bb = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        chest: [heartOfIce],
        life: LIFE,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    bb.as(bravo).attackWith(snatchRed);
    bb.as(dash).defendWith(heartOfIce);
    drain(bb);
    bb.helpers.resolveRestOfCombat();
    expect(bb.as(dash).zone("graveyard")).toContain(heartOfIce.canonicalId);
    expect(bb.as(dash).life()).toBe(LIFE - (SNATCH - 1));

    const a1 = heartOfIce.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.effect).toMatchObject({
      type: "modify-numeric",
      property: "cost",
      op: "add",
      amount: 1,
      duration: "this-turn",
      appliesTo: {
        next: { hasStatus: "another" },
      },
    });
  });
});

function gameCombatPrioIsDash(game: ReturnType<typeof FabTestEngine.start>): boolean {
  return game.getState().priority?.holderPlayerId === game.as(dash).id;
}
