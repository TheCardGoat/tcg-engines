/**
 * PEN215 Crown of Everbloom — Earth Head d0 Arcane Barrier 2.
 *
 * Printed:
 *   Instant - Destroy this: Put a card from your arsenal on the bottom of your
 *   deck. If you do, draw a card and create a Spellbane Aegis token.
 *   Arcane Barrier 2
 *
 * Model:
 *   Instant destroy-self → move-card arsenal→deck bottom with then: sequence
 *   draw 1 + create-token spellbane-aegis; keywords arcaneBarrier(2).
 *
 * Reasoning (hand-authored):
 * 1. Cost is destroy-self only — Instant, no AP / RP cost.
 * 2. Arsenal card is an effect target (at-resolution), not a cost. Empty
 *    arsenal still pays destroy; "if you do" fails → no draw, no token.
 * 3. Successful put → deck bottom + draw 1 + Spellbane Aegis in arena.
 * 4. Second activate illegal after destroy; AB2 is keyword-only (catalog).
 * 5. Same move-card.then shape as bloodied-helm (SMP014); token path is the
 *    extra production claim.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { crownOfEverbloom } from "../../../../../../cards/src/cards/equipment/crown-of-everbloom.ts";
import { spellbaneAegis } from "../../../../../../cards/src/cards/tokens/spellbane-aegis.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>, pickCanonicalId?: string): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const pick =
        (pickCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === pickCanonicalId,
            )
          : undefined) ?? decision.candidates[0];
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

function hasSpellbaneAegis(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): boolean {
  const arena = game.getState().containers.zonesByPlayerId[playerId]!.arena ?? [];
  return arena.some((id) => {
    const canonical = game.getState().objects[id]?.canonicalId ?? "";
    return (
      canonical === spellbaneAegis.canonicalId ||
      canonical === "token:spellbane-aegis" ||
      /spellbane.?aegis/i.test(canonical) ||
      /spellbane/i.test(id)
    );
  });
}

describe("crown-of-everbloom (PEN215)", () => {
  it("core mechanic: Instant destroy → arsenal bottom → draw + Spellbane Aegis", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        head: [crownOfEverbloom],
        arsenal: [nimblismBlue],
        hand: [],
        // Known deck so draw is observable; bottom after put is nimblism.
        deck: [snatchRed, snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const handBefore = Bravo.handCount();
    const deckBefore = Bravo.zone("deck").length;
    const apBefore = game.getState().players[Bravo.id]!.actionPoints;

    Bravo.activate(crownOfEverbloom);
    drain(game, nimblismBlue.canonicalId);

    // Cost: crown destroyed.
    expect(Bravo.zone("head")).not.toContain(crownOfEverbloom.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(crownOfEverbloom.canonicalId);

    // Arsenal put to deck bottom; drew 1.
    expect(Bravo.zone("arsenal")).not.toContain(nimblismBlue.canonicalId);
    expect(Bravo.handCount()).toBe(handBefore + 1);
    // put bottom +1 then draw −1 → deck length unchanged.
    // Engine deck order: index 0 is bottom (unshift), end is top (draw).
    expect(Bravo.zone("deck").length).toBe(deckBefore);
    const deck = Bravo.zone("deck");
    expect(deck[0]).toBe(nimblismBlue.canonicalId);
    // Draw came from top of the original deck (snatch), not the put-bottom card.
    expect(Bravo.zone("hand")).toContain(snatchRed.canonicalId);

    // Spellbane Aegis under controller.
    expect(hasSpellbaneAegis(game, Bravo.id)).toBe(true);

    // Instant: no AP spent.
    expect(game.getState().players[Bravo.id]!.actionPoints).toBe(apBefore);
  });

  it("boundaries: empty arsenal destroys only (no if-you-do); second activate illegal; model + AB2", () => {
    const empty = FabTestEngine.start(
      {
        hero: bravo,
        head: [crownOfEverbloom],
        arsenal: [],
        hand: [],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const BravoEmpty = empty.as(bravo);
    const handBefore = BravoEmpty.handCount();
    const deckBefore = BravoEmpty.zone("deck").length;

    // Cost only is destroy-self — empty arsenal still legal to activate.
    BravoEmpty.activate(crownOfEverbloom);
    drain(empty);

    expect(BravoEmpty.zone("head")).not.toContain(crownOfEverbloom.canonicalId);
    expect(BravoEmpty.zone("graveyard")).toContain(crownOfEverbloom.canonicalId);
    // "If you do" failed: no draw, no token.
    expect(BravoEmpty.handCount()).toBe(handBefore);
    expect(BravoEmpty.zone("deck").length).toBe(deckBefore);
    expect(hasSpellbaneAegis(empty, BravoEmpty.id)).toBe(false);

    // Second activate after destroy.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [crownOfEverbloom],
        arsenal: [nimblismBlue],
        deck: 6,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    game.as(bravo).activate(crownOfEverbloom);
    drain(game, nimblismBlue.canonicalId);
    expect(() => game.as(bravo).activate(crownOfEverbloom)).toThrow();

    const a1 = crownOfEverbloom.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.effect).toMatchObject({
      type: "if-you-do",
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["arsenal"],
          count: 1,
        },
        to: { zone: "deck", position: "bottom" },
      },
      then: {
        type: "sequence",
        steps: [
          { type: "draw", count: 1, player: "controller" },
          {
            type: "create-token",
            token: "spellbane-aegis",
            controller: "controller",
          },
        ],
      },
    });
    expect(
      crownOfEverbloom.base.keywords?.some(
        (k) => k.name === "arcane-barrier" && (k as { value?: number }).value === 2,
      ),
    ).toBe(true);
    expect(crownOfEverbloom.base.numeric.defense).toBe(0);
  });
});
