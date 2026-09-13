/**
 * PEN314 Helm of Safe Haven — Generic Head d2 Blade Break.
 *
 * Printed:
 *   When this defends, reveal the top card of your deck. If it's an attack
 *   action card, add it to this chain link as a defending card and discard a
 *   card.
 *   Blade Break
 *
 * Reasoning (hand-authored):
 * 1. Defend subject:self — co-defenders must not fire.
 * 2. Reveal top is deterministic (at-resolution top of controller deck).
 * 3. If AAC: add-defending from **deck** (engine previously only allowed hand /
 *    arsenal / equipment seats) + discard 1 from hand.
 * 4. Non-AAC top: reveal only; no extra defender, no discard.
 * 5. BB d2 after defend.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { helmOfSafeHaven } from "../../../../../../cards/src/cards/equipment/helm-of-safe-haven.ts";

const LIFE = 20;
const SNATCH = 4;
const HELM_D = 2;
const SNATCH_DEF = 2; // snatch as defending AAC contributes its printed defense

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

describe("helm-of-safe-haven (PEN314)", () => {
  it("core mechanic: defend reveal AAC → add as defender + discard; BB d2", () => {
    // Deck top (array end) is snatch AAC; hand has a discard fodder.
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
        head: [helmOfSafeHaven],
        hand: [nimblismBlue],
        // Top of deck = last element.
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, snatchRed],
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);
    const handBefore = Defender.zone("hand").length;
    const deckBefore = Defender.zone("deck").length;

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(helmOfSafeHaven);
    drain(game);

    // While combat still open (or just after resolve), AAC should have been
    // added as a defender from deck and hand discarded.
    game.helpers.resolveRestOfCombat();
    drain(game);

    // Helm BB + snatch as extra defender (d2) → total block 4 vs snatch 4 = 0 dmg.
    expect(Defender.life()).toBe(LIFE);
    // Discarded hand fodder + BB helm + combat snatch eventually GY.
    expect(Defender.zone("hand").length).toBe(handBefore - 1);
    expect(Defender.zone("graveyard")).toContain(nimblismBlue.canonicalId);
    expect(Defender.zone("graveyard")).toContain(helmOfSafeHaven.canonicalId);
    expect(Defender.zone("head")).not.toContain(helmOfSafeHaven.canonicalId);
    // Deck lost the top AAC (moved onto chain then typically to GY).
    expect(Defender.zone("deck").length).toBe(deckBefore - 1);
    // Snatch from deck should be in GY after combat close (or still account for
    // the extra defender path via damage math already proven).
    expect(Defender.zone("graveyard")).toContain(snatchRed.canonicalId);
  });

  it("boundaries: non-AAC top → no add/discard; model + BB d2 alone", () => {
    // Top card is blue non-attack → reveal only.
    const nonAac = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [helmOfSafeHaven],
        hand: [nimblismBlue],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, nimblismBlue],
      },
      { autoPassPriority: false },
    );
    const handBefore = nonAac.as(dash).zone("hand").length;
    const deckBefore = nonAac.as(dash).zone("deck").length;

    nonAac.as(bravo).attackWith(snatchRed);
    nonAac.as(dash).defendWith(helmOfSafeHaven);
    drain(nonAac);
    nonAac.helpers.resolveRestOfCombat();
    drain(nonAac);

    // Only helm d2 blocks → snatch 4 − 2 = 2 damage.
    expect(nonAac.as(dash).life()).toBe(LIFE - (SNATCH - HELM_D));
    // No discard (hand keeps nimblism until… BB only; hand card stays).
    expect(nonAac.as(dash).zone("hand").length).toBe(handBefore);
    // Deck top not removed.
    expect(nonAac.as(dash).zone("deck").length).toBe(deckBefore);
    expect(nonAac.as(dash).zone("graveyard")).toContain(helmOfSafeHaven.canonicalId);

    const a1 = helmOfSafeHaven.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static") return;
    expect(a1.staticKind).toBe("triggered");
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
      type: "sequence",
      steps: [
        {
          type: "reveal",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["deck"],
            position: "top",
            count: 1,
          },
          outputBinding: "it",
        },
        {
          type: "conditional",
          condition: {
            type: "binding-matches",
            binding: "it",
            filter: { typeBox: { types: ["Action"], subtypes: ["Attack"] } },
          },
        },
      ],
    });
    expect(helmOfSafeHaven.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
    expect(helmOfSafeHaven.base.numeric.defense).toBe(2);
    void SNATCH_DEF;
  });
});
