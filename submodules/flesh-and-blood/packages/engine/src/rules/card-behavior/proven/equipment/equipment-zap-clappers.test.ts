/**
 * AST005 Zap Clappers — Lightning Runeblade Arms d2 Blade Break.
 *
 * Printed:
 *   When this defends, you may reveal an instant card from your hand. If you
 *   do, deal 1 arcane damage to the attacking hero.
 *   Blade Break
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Trigger must be defend subject:self — bare defend would fire for
 *    co-defenders. Prior model omitted subject.
 * 2. Optional reveal Instant from hand; optional.then deals 1 arcane to
 *    attacking-hero only if the optional is accepted.
 * 3. Reveal does not leave the Instant in hand (stays for later play).
 * 4. Happy: defend + accept + reveal Sigil → attacker −1 life; BB to GY.
 * 5. Boundary: decline → no arcane; Instant stays; BB still.
 * 6. Boundary: no Instant in hand — accepting optional cannot complete reveal;
 *    no arcane (or optional not useful).
 * 7. Boundary: co-defender only (this not defending) does not fire.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, sigilOfSolaceRed, nimblismBlue } from "../../../fixtures.ts";
import { zapClappers } from "../../../../../../cards/src/cards/equipment/zap-clappers.ts";

const LIFE = 20;
const SNATCH = 4;
const ARMS_D = 2;

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

describe("zap-clappers (AST005)", () => {
  it("core mechanic: defend → reveal Instant → 1 arcane to attacker; blade break", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6, life: LIFE },
      {
        hero: bravo,
        arms: [zapClappers],
        hand: [sigilOfSolaceRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: LIFE,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Attacker = game.as(dash);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(zapClappers);
    finishCombat(game, {
      acceptOptional: true,
      preferCanonicalId: sigilOfSolaceRed.canonicalId,
    });

    // 1 arcane to attacking hero.
    expect(Attacker.life()).toBe(LIFE - 1);
    // Instant revealed, still in hand (not discarded/played).
    expect(Bravo.zone("hand")).toContain(sigilOfSolaceRed.canonicalId);
    // Blade Break after defend.
    expect(Bravo.zone("arms")).not.toContain(zapClappers.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(zapClappers.canonicalId);
    // Defended for 2 before destroy.
    expect(Bravo.life()).toBe(LIFE - (SNATCH - ARMS_D));
  });

  it("boundaries: decline; no Instant; co-defender; model subject:self", () => {
    // Decline optional → no arcane; Instant stays; BB still.
    const decline = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6, life: LIFE },
      {
        hero: bravo,
        arms: [zapClappers],
        hand: [sigilOfSolaceRed],
        deck: 4,
        life: LIFE,
      },
      { autoPassPriority: false },
    );
    decline.as(dash).attackWith(snatchRed);
    decline.as(bravo).defendWith(zapClappers);
    finishCombat(decline, { acceptOptional: false });
    expect(decline.as(dash).life()).toBe(LIFE);
    expect(decline.as(bravo).zone("hand")).toContain(sigilOfSolaceRed.canonicalId);
    expect(decline.as(bravo).zone("graveyard")).toContain(zapClappers.canonicalId);

    // No Instant in hand: accept path cannot reveal → no arcane.
    const noInstant = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6, life: LIFE },
      {
        hero: bravo,
        arms: [zapClappers],
        hand: [nimblismBlue],
        deck: 4,
        life: LIFE,
      },
      { autoPassPriority: false },
    );
    noInstant.as(dash).attackWith(snatchRed);
    noInstant.as(bravo).defendWith(zapClappers);
    finishCombat(noInstant, { acceptOptional: true });
    expect(noInstant.as(dash).life()).toBe(LIFE);
    expect(noInstant.as(bravo).zone("hand")).toContain(nimblismBlue.canonicalId);

    // Co-defender only: defend with hand card while wraps stay in arms seat
    // (not declared as defender) → no arcane.
    const coDef = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6, life: LIFE },
      {
        hero: bravo,
        arms: [zapClappers],
        hand: [sigilOfSolaceRed, nimblismBlue],
        deck: 4,
        life: LIFE,
      },
      { autoPassPriority: false },
    );
    coDef.as(dash).attackWith(snatchRed);
    // Defend with Action from hand, not the equipment.
    coDef.as(bravo).defendWith(nimblismBlue);
    finishCombat(coDef, {
      acceptOptional: true,
      preferCanonicalId: sigilOfSolaceRed.canonicalId,
    });
    expect(coDef.as(dash).life()).toBe(LIFE);
    // Equipment never defended — still seated (no BB).
    expect(coDef.as(bravo).zone("arms")).toContain(zapClappers.canonicalId);

    const a1 = zapClappers.base.abilities?.[0];
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
          type: "deal-damage",
          damageType: "arcane",
          amount: 1,
          target: { selector: "attacking-hero" },
        },
      });
    }
    expect(zapClappers.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
  });
});
