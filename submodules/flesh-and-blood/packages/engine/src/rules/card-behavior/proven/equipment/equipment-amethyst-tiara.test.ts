/**
 * DYN171 Amethyst Tiara — Runeblade Head d1 Blade Break.
 *
 * Printed:
 *   Instant - Destroy Amethyst Tiara: Runechants you control have spellvoid 1
 *   this turn.
 *   Blade Break
 *
 * Model:
 *   Instant destroy-self → grant-property spellvoid(1) this-turn to all
 *   controller Runechants in permanent (count:star at-resolution)
 *
 * Reasoning:
 * 1. Destroy-self Instant arms a this-turn keyword grant on existing Runechants.
 * 2. Spellvoid 1 on a Runechant vs arcane: destroy the aura to prevent 1.
 * 3. No Runechants: grant resolves with empty targets (tiara still destroyed).
 * 4. Blade Break path is independent (defend d1).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, volticBoltRed } from "../../../fixtures.ts";
import { amethystTiara } from "../../../../../../cards/src/cards/equipment/amethyst-tiara.ts";
import { runechant } from "../../../../../../cards/src/cards/tokens/runechant.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (!decision) {
      if (game.getState().rulesStack.length === 0 && !game.combat()) return;
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) {
        game.exec({ move: "pass", actorId: prio, payload: {} });
        continue;
      }
      return;
    }
    if (decision.kind === "boolean") {
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
    if (decision.kind === "option") {
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
    if (decision.kind === "entity-target") {
      // Auto-pick all candidates when count:star (or first when single).
      const ids = decision.candidates.map((c) => c.instanceId);
      const max = decision.max ?? ids.length;
      const min = decision.min ?? 0;
      const pick = ids.slice(0, Math.max(min, Math.min(max, ids.length)));
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: pick },
        },
      });
      continue;
    }
    if (decision.kind === "ordering") {
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
    break;
  }
}

function arenaHasSpellvoid(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
  canonicalId: string,
): boolean {
  const state = game.getState();
  const player = state.players[playerId];
  if (!player) return false;
  const instanceId = state.containers.zonesByPlayerId[playerId]!.arena.find(
    (id) => state.objects[id]?.canonicalId === canonicalId,
  );
  if (!instanceId) return false;
  const view = buildFabRulesView(state);
  const obj = view.object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  });
  return obj?.current.keywords.some((k) => k.name === "spellvoid") ?? false;
}

describe("amethyst-tiara (DYN171)", () => {
  it("core mechanic: destroy-self → Runechants gain spellvoid 1; arcane uses it", () => {
    // Dash is active — deals arcane. Bravo (with tiara + Runechants) Instant-
    // activates on priority, then Dash resolves Voltic Bolt into the granted
    // spellvoid.
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [volticBoltRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
        life: 20,
      },
      {
        hero: bravo,
        head: [amethystTiara],
        arena: [runechant, runechant],
        hand: [],
        deck: 6,
        life: 20,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    expect(Bravo.zone("arena").filter((id) => id === runechant.canonicalId).length).toBe(2);

    // Instant activate on Dash's turn (Bravo needs priority — pass once if needed).
    if (game.getState().priority?.holderPlayerId !== Bravo.id) {
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
    }
    Bravo.activate(amethystTiara);
    drain(game);

    expect(Bravo.zone("head")).not.toContain(amethystTiara.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(amethystTiara.canonicalId);
    // Both Runechants should carry spellvoid after the grant.
    expect(arenaHasSpellvoid(game, Bravo.id, runechant.canonicalId)).toBe(true);

    // Ensure Dash has priority for the open-action play.
    if (game.getState().priority?.holderPlayerId !== Dash.id) {
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
    }
    const arenaBefore = Bravo.zone("arena").filter((id) => id === runechant.canonicalId).length;
    Dash.play(volticBoltRed, { target: Bravo.id });
    drain(game);

    // Spellvoid on arena Runechant: prevent fires and the aura is destroyed
    // (tokens cease-to-exist rather than GY).
    const arenaAfter = Bravo.zone("arena").filter((id) => id === runechant.canonicalId).length;
    expect(arenaAfter).toBeLessThan(arenaBefore);
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
    expect(Bravo.life()).toBeLessThan(20);
  });

  it("boundaries: no Runechants → destroy-self still pays; no spellvoid prevent", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [volticBoltRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
        life: 20,
      },
      {
        hero: bravo,
        head: [amethystTiara],
        arena: [],
        hand: [],
        deck: 6,
        life: 20,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    if (game.getState().priority?.holderPlayerId !== Bravo.id) {
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
    }
    Bravo.activate(amethystTiara);
    drain(game);

    expect(Bravo.zone("graveyard")).toContain(amethystTiara.canonicalId);
    expect(Bravo.zone("arena")).toHaveLength(0);

    if (game.getState().priority?.holderPlayerId !== Dash.id) {
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
    }
    Dash.play(volticBoltRed, { target: Bravo.id });
    drain(game);
    // No spellvoid source → no prevent event from spellvoid.
    expect(
      game
        .committedEvents()
        .some((e) => e.name === "prevent" && e.data && "preventedAmount" in e.data),
    ).toBe(false);
    expect(Bravo.life()).toBeLessThan(20);
  });

  it("boundaries: bladeBreak on defend d1", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        head: [amethystTiara],
        hand: [],
        deck: 6,
        life: 20,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(amethystTiara);
    game.helpers.resolveRestOfCombat();

    expect(Bravo.zone("graveyard")).toContain(amethystTiara.canonicalId);
    expect(Bravo.life()).toBe(20 - (4 - 1));
  });
});
