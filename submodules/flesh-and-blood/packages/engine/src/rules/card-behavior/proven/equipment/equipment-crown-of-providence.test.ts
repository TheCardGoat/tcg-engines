/**
 * UPR182 Crown of Providence — Generic Head d2 Blade Break.
 *
 * Printed:
 *   When you defend with Crown of Providence, you may put a card from your hand
 *   or arsenal on the bottom of your deck. If you do, draw a card.
 *   Blade Break
 *
 * Reasoning (hand-authored):
 * 1. Defend subject:self (was name filter only — co-defenders must not fire).
 * 2. Optional move hand/arsenal → deck bottom; then draw 1 if accepted.
 * 3. Decline optional → no bottom, no draw.
 * 4. Blade Break d2 after defend.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { crownOfProvidence } from "../../../../../../cards/src/cards/equipment/crown-of-providence.ts";

const LIFE = 20;
const SNATCH = 4;
const HELM_D = 2;

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { acceptOptional?: boolean; pickCanonicalId?: string } = {},
): void {
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: opts.acceptOptional === true },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick =
        (opts.pickCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === opts.pickCanonicalId,
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

describe("crown-of-providence (UPR182)", () => {
  it("core mechanic: defend → optional bottom hand card → draw 1; BB d2", () => {
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
        head: [crownOfProvidence],
        // Hand card to bottom; deck top for the if-you-do draw.
        hand: [nimblismBlue],
        deck: [snatchRed, snatchRed, snatchRed],
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);
    const deckBefore = Defender.zone("deck").length;

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(crownOfProvidence);
    drain(game, { acceptOptional: true, pickCanonicalId: nimblismBlue.canonicalId });
    game.helpers.resolveRestOfCombat();
    drain(game);

    // Nimblism bottomed (not in hand); drew one → hand size 1.
    expect(Defender.zone("hand")).not.toContain(nimblismBlue.canonicalId);
    expect(Defender.zone("hand").length).toBe(1);
    // Bottom put + draw: deck size net same (bottomed 1, drew 1).
    expect(Defender.zone("deck").length).toBe(deckBefore);
    // Blade Break.
    expect(Defender.zone("graveyard")).toContain(crownOfProvidence.canonicalId);
    expect(Defender.life()).toBe(LIFE - (SNATCH - HELM_D));
  });

  it("boundaries: decline optional no draw; subject:self model; co-defend no fire", () => {
    const decline = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [crownOfProvidence],
        hand: [nimblismBlue],
        deck: [snatchRed, snatchRed, snatchRed],
      },
      { autoPassPriority: false },
    );
    const Defender = decline.as(dash);
    const handBefore = Defender.zone("hand").length;

    decline.as(bravo).attackWith(snatchRed);
    Defender.defendWith(crownOfProvidence);
    drain(decline, { acceptOptional: false });
    decline.helpers.resolveRestOfCombat();
    drain(decline);

    // Declined: hand still has nimblism (no bottom); no draw.
    expect(Defender.zone("hand")).toContain(nimblismBlue.canonicalId);
    expect(Defender.zone("hand").length).toBe(handBefore);
    expect(Defender.zone("graveyard")).toContain(crownOfProvidence.canonicalId);

    // Co-defender only: crown stays, no bottom from crown ability.
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
        head: [crownOfProvidence],
        hand: [nimblismBlue],
        deck: [snatchRed, snatchRed],
      },
      { autoPassPriority: false },
    );
    co.as(bravo).attackWith(snatchRed);
    co.as(dash).defendWith(nimblismBlue);
    drain(co, { acceptOptional: true });
    co.helpers.resolveRestOfCombat();
    drain(co);

    expect(co.as(dash).zone("head")).toContain(crownOfProvidence.canonicalId);
    // Hand only spent the defender — no optional crown draw path.
    expect(co.as(dash).zone("hand").length).toBe(0);

    const a1 = crownOfProvidence.base.abilities?.[0];
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
      type: "optional",
      effect: {
        type: "move-card",
        target: { zones: ["hand", "arsenal"], count: 1 },
        to: { zone: "deck", position: "bottom" },
      },
      then: { type: "draw", count: 1, player: "controller" },
    });
    expect(crownOfProvidence.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "blade-break" })]),
    );
  });
});
