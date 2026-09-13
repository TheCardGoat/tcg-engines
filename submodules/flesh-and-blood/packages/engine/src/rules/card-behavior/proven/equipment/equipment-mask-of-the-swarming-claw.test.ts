/**
 * PEN030 Mask of the Swarming Claw — Ninja Head d0.
 *
 * Printed:
 *   Arcane Barrier 1
 *   Spellvoid X, where X is the number of chain links you control.
 *
 * Reasoning (hand-authored):
 * 1. Arcane Barrier 1: pay 1{r} to prevent 1 arcane; equipment stays.
 * 2. Spellvoid X is a *live* count of chain-links (not type-"x" placeholder).
 *    Out of combat X=0 → spellvoid does not fire.
 * 3. Mid-combat while controlling chain link 1: Instant arcane 1 → destroy
 *    mask, prevent 1 (spellvoid before barrier on same permanent).
 * 4. Physical combat does not destroy the mask.
 * 5. Structural: continuous grant + keyword amount use chain-links count.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { maskOfTheSwarmingClaw } from "../../../../../../cards/src/cards/equipment/mask-of-the-swarming-claw.ts";

const LIFE = 20;

/** Cost-0 Instant that deals 1 arcane — usable mid-combat for Spellvoid X proof. */
const arcaneInstant1 = {
  canonicalId: "trainer-arcane-instant-1",
  types: ["Wizard", "Instant"],
  cost: 0,
  arcane: 1,
  keywords: [] as const,
};

/** Action arcane bolt (trainer) — matches 08-keywords spellvoid/barrier fixtures. */
const arcaneBolt2 = {
  canonicalId: "trainer-arcane-bolt-pen030",
  types: ["Wizard", "Action"],
  cost: 0,
  arcane: 2,
  keywords: [] as const,
};

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
    if (decision?.kind === "option") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "option", optionIds: decision.options.map((option) => option.id) },
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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("mask-of-the-swarming-claw (PEN030)", () => {
  it("core mechanic: Arcane Barrier 1 pays {r} to prevent 1; mask stays", () => {
    // Out of combat X=0 so spellvoid is inert; barrier is the prevention path.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [arcaneBolt2],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [maskOfTheSwarmingClaw],
        resourcePoints: 1,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(arcaneBolt2, { target: game.as(dash).id });
    drain(game);

    // Trainer bolt 2 arcane; AB1 prevents 1 → 1 damage; mask stays.
    expect(game.as(dash).life()).toBe(LIFE - 1);
    expect(game.as(dash).zone("head")).toContain(maskOfTheSwarmingClaw.canonicalId);
    expect(game.as(dash).resourcePoints()).toBe(0);
  });

  it("core mechanic: mid-combat Spellvoid X (link 1) destroys mask to prevent 1 arcane", () => {
    // Bravo controls the open chain link → X=1. Dash Instant-arcane-s into Bravo.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: LIFE,
        head: [maskOfTheSwarmingClaw],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        hand: [arcaneInstant1],
        resourcePoints: 0,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    // Combat open at chain link 1 — controller of the attack is Bravo.
    expect(game.combat()?.chainLinkNumber ?? 0).toBeGreaterThanOrEqual(1);

    // Dash spends priority on Instant arcane at Bravo (mid-combat legal Instant).
    if (game.getState().priority?.holderPlayerId !== Dash.id) {
      game.declareNoDefenseIfPending();
      const prio = game.getPriorityPlayerId();
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
    }
    Dash.play(arcaneInstant1, { target: Bravo.id });
    drain(game);

    expect(Bravo.zone("head")).not.toContain(maskOfTheSwarmingClaw.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(maskOfTheSwarmingClaw.canonicalId);
    // Spellvoid 1 fully absorbs the Instant's 1 arcane.
    expect(Bravo.life()).toBe(LIFE);
    expect(
      game
        .committedEvents()
        .some(
          (e) =>
            e.name === "prevent" &&
            e.data &&
            "preventedAmount" in e.data &&
            e.data.preventedAmount === 1,
        ),
    ).toBe(true);
  });

  it("boundaries: out-of-combat X=0 + 0 RP → full arcane; physical does not destroy", () => {
    const arcaneGame = FabTestEngine.start(
      {
        hero: bravo,
        hand: [arcaneBolt2],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [maskOfTheSwarmingClaw],
        resourcePoints: 0,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    arcaneGame.as(bravo).play(arcaneBolt2, { target: arcaneGame.as(dash).id });
    drain(arcaneGame);
    // No chain links, no RP for barrier → full 2 arcane; mask stays.
    expect(arcaneGame.as(dash).life()).toBe(LIFE - 2);
    expect(arcaneGame.as(dash).zone("head")).toContain(maskOfTheSwarmingClaw.canonicalId);

    const phys = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, head: [maskOfTheSwarmingClaw], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    phys.as(bravo).attackWith(snatchRed);
    phys.helpers.resolveRestOfCombat();
    expect(phys.as(dash).zone("head")).toContain(maskOfTheSwarmingClaw.canonicalId);
    expect(phys.as(dash).life()).toBe(LIFE - 4);

    const a1 = maskOfTheSwarmingClaw.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind === "static") {
      expect(a1.staticKind).toBe("continuous");
      expect(a1.effect).toMatchObject({
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: {
            name: "spellvoid",
            value: { type: "count", what: "chain-links", player: "controller" },
          },
        },
      });
    }
    expect(
      maskOfTheSwarmingClaw.base.keywords?.some(
        (k) => k.name === "arcane-barrier" && (k as { value?: number }).value === 1,
      ),
    ).toBe(true);
    expect(
      maskOfTheSwarmingClaw.base.keywords?.some(
        (k) =>
          k.name === "spellvoid" &&
          typeof (k as { value?: unknown }).value === "object" &&
          (k as { value?: { type?: string; what?: string } }).value?.type === "count" &&
          (k as { value?: { what?: string } }).value?.what === "chain-links",
      ),
    ).toBe(true);
  });
});
