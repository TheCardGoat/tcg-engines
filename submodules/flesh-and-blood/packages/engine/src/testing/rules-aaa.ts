/**
 * Canonical AAA composite flows for Flesh and Blood rules/card-behavior tests.
 *
 * Pattern: `submodules/gundam/packages/engine/src/gundam/testing/rules-aaa.ts`.
 * This module is the ONE home for the shared Arrange/Act/Assert scripts that
 * used to be duplicated across standalone rules-suite helper files (removed
 * in the task-#6 clean break).
 *
 * Everything here is built on the fluent layer — {@link FabPlayerHandle}
 * verbs (`attackWith`, `defendWith`, `play`), `game.helpers`, and the public
 * {@link FabTestEngine} surface. No function reimplements rules logic, and no
 * function invents moves: this is sugar over the 7 production moves only.
 *
 * Prefer the fluent verbs directly in new tests:
 *
 *   Bravo.attackWith(snatchRed);
 *   Dash.defendWith(nimblismBlue);
 *   game.helpers.resolveRestOfCombat();
 *
 * Use these composite flows when a suite wants the one-call script form.
 */

import { listLegalCommands } from "../automation/legal-commands.ts";
import { dash } from "../../../cards/src/cards/heroes/dash.ts";
import { bravo } from "../../../cards/src/cards/heroes/bravo.ts";
import { nimblismBlue } from "../../../cards/src/cards/actions/nimblism.ts";
import type { FabAttackFlowPlayOptions } from "./play-options.ts";
import type { FabCardRef, FabPlayerHandle, FabTestEngine } from "./test-engine.ts";
import type { FabZoneKind } from "../state.ts";
import { fabPrimaryDefenders } from "../game/combat.ts";

function pitchFor(card: { cost?: number | string }): (typeof nimblismBlue)[] {
  const cost = Number(card.cost ?? 0);
  if (cost <= 0) return [];
  return Array.from({ length: Math.ceil(cost / 3) }, () => nimblismBlue);
}

// ── Canonical composite flows ─────────────────────────────────────────────

/**
 * Play an attack card layer, resolve it, then pass Attack → Defend. When
 * `defender` is omitted, the attacker's sole opponent is targeted. Delegates
 * to the fluent `game.helpers.attackToDefend` surface.
 */
export function attackToDefend(
  game: FabTestEngine,
  attacker: FabPlayerHandle,
  card: FabCardRef,
  defender?: FabPlayerHandle,
  options: FabAttackFlowPlayOptions = {},
): void {
  game.helpers.attackToDefend(attacker, card, defender, options);
}

/** From the Defend step (blocks declared or not), pass through to closed combat. */
export function resolveRestOfCombat(game: FabTestEngine): void {
  game.helpers.resolveRestOfCombat();
}

/** Advance open combat to `step` (or combat close / game end) via passes. */
export function advanceToStep(game: FabTestEngine, step: string): void {
  game.advanceCombatTo(step);
}

/** Assert the current combat step. */
export function expectStep(game: FabTestEngine, step: string): void {
  game.helpers.expectStep(step);
}

// ── Scenario scripts (release-note suites) ────────────────────────────────

/** Options for {@link playCostedAttackToDefend}. */
export interface FabCostedAttackOptions {
  readonly attacker?: FabPlayerHandle;
  readonly defender?: FabPlayerHandle;
  readonly pitch?: readonly FabCardRef[];
}

/**
 * Play an attack through layer → attack → defend, auto-pitching
 * Nimblism Blues from hand when `pitch` is omitted and the card costs > 0.
 * Fluent replacement for the per-set `playSetAttackToDefend` /
 * `playOmnAttackToDefend` / `playPenAttackToDefend` / `playSupAttackToDefend`
 * clones.
 */
export function playCostedAttackToDefend(
  game: FabTestEngine,
  card: FabCardRef & { cost?: number | string },
  opts: FabCostedAttackOptions = {},
): void {
  const attacker = opts.attacker ?? game.as(bravo);
  const defender = opts.defender ?? game.as(dash);
  const cost = Number(card.cost ?? 0);
  const pitch = opts.pitch ?? (cost > 0 ? pitchFor(card) : undefined);
  attacker.attackWith(card, { ...(pitch ? { pitch } : {}), target: defender.id });
}

/** Sanctioned mid-test RP seed (same class as {@link seedPitchedPower6}). */
export function seedResourcePoints(
  game: FabTestEngine,
  amount: number,
  hero: FabCardRef | FabPlayerHandle = bravo,
): void {
  const playerId =
    typeof hero === "object" && hero !== null && "hasPriority" in hero ? hero.id : game.as(hero).id;
  const player = game.getState().players[playerId]!;
  player.resourcePoints = Math.max(player.resourcePoints, amount);
}

/** Play a non-attack / instant and pass the stack. Seeds RP for cost if needed. */
export function playResolve(
  game: FabTestEngine,
  card: FabCardRef & { cost?: number | string },
  opts: { pitch?: readonly FabCardRef[]; target?: string; targetInstanceId?: string } = {},
): void {
  const Bravo = game.as(bravo);
  const cost = Number(card.cost ?? 0);
  if (cost > 0 && !opts.pitch?.length) {
    seedResourcePoints(game, cost, bravo);
  }
  Bravo.play(card, {
    ...(opts.pitch ? { pitch: opts.pitch } : {}),
    ...(opts.target ? { target: opts.target } : {}),
    ...(opts.targetInstanceId ? { targetInstanceId: opts.targetInstanceId } : {}),
  });
  game.passBoth();
}

/** Find and execute the first legal `activate` for a permanent / hero matching the card. */
export function activateFirst(
  game: FabTestEngine,
  player: FabPlayerHandle,
  card: FabCardRef,
  extraPayload: Record<string, unknown> = {},
): void {
  const canonicalId = typeof card === "string" ? card : card.canonicalId;
  const legal = listLegalCommands(game.getRuntime(), player.id, { includeConcede: false });
  const cmd = legal.find((c) => {
    if (c.move !== "activate") return false;
    const payload = c.payload as { instanceId?: string };
    const id = payload.instanceId;
    if (!id) return true;
    // Hero activations and permanent activations are both keyed by instance id.
    if (id === canonicalId) return true;
    return game.getState().objects[id]?.canonicalId === canonicalId;
  });
  if (!cmd) {
    throw new Error(
      `No legal activate for ${canonicalId}. Legal: ${legal
        .filter((c) => c.move === "activate")
        .map((c) => c.label ?? JSON.stringify(c.payload))
        .join("; ")}`,
    );
  }
  player.exec({
    move: "activate",
    payload: { ...cmd.payload, ...extraPayload },
  });
}

/** Defend with one 2-defense card (Nimblism Blue) — OMN Fragment fires once. */
export function fragmentOnce(game: FabTestEngine, defender: FabPlayerHandle = game.as(dash)): void {
  defender.blockWith(nimblismBlue);
}

/** Seed the “pitched a card with 6 or more {p} this turn” player flag (Bear Hug family). */
export function seedPitchedPower6(game: FabTestEngine, hero: FabCardRef = bravo): void {
  const player = game.getState().players[game.as(hero).id]!;
  player.history.turn.pitchedPower6 = true;
}

/**
 * Advance open combat to the reaction step with no hand blocks.
 * Reaction priority starts with the turn player (attacker). Does **not** pass them.
 */
export function advanceCombatToReaction(
  game: FabTestEngine,
  attacker: FabPlayerHandle = game.as(bravo),
  defender: FabPlayerHandle = game.as(dash),
): void {
  for (let i = 0; i < 10 && game.combat()?.open; i++) {
    const step = game.combat()?.step;
    if (step === "reaction") return;
    if (step === "layer" || step === "attack") {
      game.passBoth();
      continue;
    }
    if (step === "defend") {
      defender.defendWith([]);
      attacker.pass();
      defender.pass();
      continue;
    }
    game.passBoth();
  }
  if (game.combat()?.step !== "reaction") {
    throw new Error(`Expected reaction step, got ${game.combat()?.step ?? "closed"}`);
  }
}

/**
 * Advance to reaction with defender priority (turn player already passed once).
 * Use before playing a defense reaction.
 */
export function advanceToReactionAsDefender(
  game: FabTestEngine,
  attacker: FabPlayerHandle = game.as(bravo),
  defender: FabPlayerHandle = game.as(dash),
): void {
  advanceCombatToReaction(game, attacker, defender);
  if (attacker.hasPriority()) attacker.pass();
  if (!defender.hasPriority()) {
    throw new Error("Defender does not have reaction priority for DR");
  }
}

/** Play a defense reaction during the reaction step (payload pitch optional). */
export function playDefenseReaction(
  game: FabTestEngine,
  card: FabCardRef & { cost?: number | string },
  opts: { defender?: FabPlayerHandle; pitch?: readonly FabCardRef[] } = {},
): void {
  const defender = opts.defender ?? game.as(dash);
  const cost = Number(card.cost ?? 0);
  const pitch = opts.pitch ?? (cost > 0 ? pitchFor(card) : undefined);
  const instanceId = defender.findCardInZone("hand", card);
  defender.play(card, pitch?.length ? { pitch } : {});
  for (let safety = 0; safety < 32; safety += 1) {
    const activeLink = game.combat()?.activeLink;
    if (activeLink && fabPrimaryDefenders(activeLink).some((id) => id === instanceId)) return;
    const decision = game.getState().decision;
    if (decision) {
      throw new Error(
        `Defense reaction requires the persisted ${decision.kind} decision ${decision.decisionId}.`,
      );
    }
    const priority = game.getPriorityPlayerId();
    if (!priority) break;
    game.pass(priority);
  }
  throw new Error("Defense reaction did not resolve onto the active chain link.");
}

/** Play an attack reaction during the reaction step (turn player priority). */
export function playAttackReaction(
  game: FabTestEngine,
  card: FabCardRef & { cost?: number | string },
  opts: {
    attacker?: FabPlayerHandle;
    pitch?: readonly FabCardRef[];
    targetId?: string;
  } = {},
): void {
  const attacker = opts.attacker ?? game.as(bravo);
  if (game.combat()?.step !== "reaction") {
    advanceCombatToReaction(game, attacker, game.as(dash));
  }
  if (!attacker.hasPriority()) {
    throw new Error("Attacker does not have reaction priority for AR");
  }
  const cost = Number(card.cost ?? 0);
  if (cost > 0 && !opts.pitch?.length) {
    seedResourcePoints(game, cost, attacker);
  }
  attacker.play(card, {
    ...(opts.pitch?.length ? { pitch: opts.pitch } : {}),
    ...(opts.targetId ? { targetInstanceId: opts.targetId } : {}),
  });
  // Resolve AR layer if present
  for (let i = 0; i < 4 && game.getState().rulesStack.length; i++) {
    game.passBoth();
  }
}

// ── Rules-visible query helpers ───────────────────────────────────────────

/** True when the hero's arena contains an instance whose canonical id matches `pattern`. */
export function arenaHas(game: FabTestEngine, hero: FabCardRef, pattern: RegExp): boolean {
  return game
    .as(hero)
    .zone("arena")
    .some((id) => pattern.test(String(id)));
}

/** Count of arena instances whose canonical id matches `pattern`. */
export function arenaCount(game: FabTestEngine, hero: FabCardRef, pattern: RegExp): number {
  return game
    .as(hero)
    .zone("arena")
    .filter((id) => pattern.test(String(id))).length;
}

/** True when the hero's named zone contains the card's canonical id. */
export function zoneHas(
  game: FabTestEngine,
  hero: FabCardRef,
  zone: FabZoneKind,
  card: { canonicalId: string },
): boolean {
  return game.as(hero).zone(zone).includes(card.canonicalId);
}
