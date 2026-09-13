/**
 * AST006 Starlight Striders — Lightning Runeblade Legs d1 Blade Break.
 *
 * Printed:
 *   When this defends, you may reveal an instant card from your hand. If you
 *   do, create an Embodiment of Lightning token.
 *   Blade Break
 *
 * Reasoning (hand-authored; case-by-case — AST005 zap-clappers sibling):
 * 1. Trigger must be defend subject:self — bare defend would fire for
 *    co-defenders. Prior model omitted subject (same flaw as zap-clappers).
 * 2. Optional reveal Instant from hand; optional.then creates Embodiment of
 *    Lightning under controller only if the optional is accepted.
 * 3. Reveal does not leave the Instant in hand.
 * 4. Happy: defend + accept + reveal Sigil → 1 Embodiment; BB to GY; d1.
 * 5. Boundary: decline → no token; Instant stays; BB still.
 * 6. Boundary: no Instant in hand → no token.
 * 7. Boundary: co-defender only (this not defending) does not fire.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, sigilOfSolaceRed, nimblismBlue } from "../../../fixtures.ts";
import { starlightStriders } from "../../../../../../cards/src/cards/equipment/starlight-striders.ts";

const LIFE = 20;
const SNATCH = 4;
const LEGS_D = 1;

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { acceptOptional?: boolean; preferCanonicalId?: string } = {},
): void {
  const acceptOptional = opts.acceptOptional ?? true;
  for (let safety = 0; safety < 80; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: acceptOptional },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const preferred = opts.preferCanonicalId
        ? decision.candidates.find(
            (c) => game.getState().objects[c.instanceId]?.canonicalId === opts.preferCanonicalId,
          )
        : undefined;
      const pick = preferred ?? decision.candidates[0];
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

function finishCombat(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { acceptOptional?: boolean; preferCanonicalId?: string } = {},
): void {
  for (let safety = 0; safety < 80; safety += 1) {
    drain(game, opts);
    if (!game.combat() && game.getState().rulesStack.length === 0 && !game.getState().decision) {
      return;
    }
    const prio = game.getState().priority?.holderPlayerId;
    if (prio && !game.getState().decision) {
      try {
        game.exec({ move: "pass", actorId: prio, payload: {} });
      } catch {
        return;
      }
      continue;
    }
    if (!game.getState().decision && !prio) return;
  }
}

function embodimentCount(
  game: ReturnType<typeof FabTestEngine.start>,
  player: ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>,
): number {
  const state = game.getState();
  return player.zone("arena").filter((id) => {
    if (/embodiment-of-lightning|embodimentOfLightning/i.test(id)) return true;
    const canon = state.objects[id]?.canonicalId ?? "";
    return /embodiment-of-lightning|embodiment/i.test(canon) && /lightning/i.test(canon);
  }).length;
}

describe("starlight-striders (AST006)", () => {
  it("core mechanic: defend → reveal Instant → Embodiment of Lightning; blade break", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        legs: [starlightStriders],
        hand: [sigilOfSolaceRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: LIFE,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(embodimentCount(game, Bravo)).toBe(0);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(starlightStriders);
    finishCombat(game, {
      acceptOptional: true,
      preferCanonicalId: sigilOfSolaceRed.canonicalId,
    });

    expect(embodimentCount(game, Bravo)).toBe(1);
    // Instant revealed, still in hand.
    expect(Bravo.zone("hand")).toContain(sigilOfSolaceRed.canonicalId);
    // Blade Break after defend.
    expect(Bravo.zone("legs")).not.toContain(starlightStriders.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(starlightStriders.canonicalId);
    // Defended for 1 before destroy.
    expect(Bravo.life()).toBe(LIFE - (SNATCH - LEGS_D));
  });

  it("boundaries: decline; no Instant; co-defender; model subject:self", () => {
    // Decline optional → no token; Instant stays; BB still.
    const decline = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        legs: [starlightStriders],
        hand: [sigilOfSolaceRed],
        deck: 4,
        life: LIFE,
      },
      { autoPassPriority: false },
    );
    decline.as(dash).attackWith(snatchRed);
    decline.as(bravo).defendWith(starlightStriders);
    finishCombat(decline, { acceptOptional: false });
    expect(embodimentCount(decline, decline.as(bravo))).toBe(0);
    expect(decline.as(bravo).zone("hand")).toContain(sigilOfSolaceRed.canonicalId);
    expect(decline.as(bravo).zone("graveyard")).toContain(starlightStriders.canonicalId);

    // No Instant in hand: accept path cannot reveal → no token.
    const noInstant = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        legs: [starlightStriders],
        hand: [nimblismBlue],
        deck: 4,
        life: LIFE,
      },
      { autoPassPriority: false },
    );
    noInstant.as(dash).attackWith(snatchRed);
    noInstant.as(bravo).defendWith(starlightStriders);
    finishCombat(noInstant, { acceptOptional: true });
    expect(embodimentCount(noInstant, noInstant.as(bravo))).toBe(0);
    expect(noInstant.as(bravo).zone("hand")).toContain(nimblismBlue.canonicalId);

    // Co-defender only: defend with hand card while striders stay seated.
    const coDef = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        legs: [starlightStriders],
        hand: [sigilOfSolaceRed, nimblismBlue],
        deck: 4,
        life: LIFE,
      },
      { autoPassPriority: false },
    );
    coDef.as(dash).attackWith(snatchRed);
    coDef.as(bravo).defendWith(nimblismBlue);
    finishCombat(coDef, {
      acceptOptional: true,
      preferCanonicalId: sigilOfSolaceRed.canonicalId,
    });
    expect(embodimentCount(coDef, coDef.as(bravo))).toBe(0);
    expect(coDef.as(bravo).zone("legs")).toContain(starlightStriders.canonicalId);

    const a1 = starlightStriders.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind === "static") {
      expect(a1.trigger).toMatchObject({
        event: { name: "defend", observes: { kind: "source" } },
      });
      expect(a1.resolution?.effect).toMatchObject({
        type: "optional",
        effect: {
          type: "reveal",
          target: {
            zones: ["hand"],
            filter: { typeBox: { types: ["Instant"] } },
          },
        },
        then: {
          type: "create-token",
          token: "embodiment-of-lightning",
          controller: "controller",
        },
      });
    }
    expect(starlightStriders.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
  });
});
