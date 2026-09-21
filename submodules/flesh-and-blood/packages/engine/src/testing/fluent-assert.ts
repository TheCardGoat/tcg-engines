/**
 * Fluent Assert surface for the FAB test harness.
 *
 *   expectFabCard(Bravo, attack).toBeIn("graveyard");
 *   expectFabPlayer(Dash).toHaveLife(36);
 *   expectCombat(game).toBeClosed();
 *   expectWinner(game, bravo);
 *
 * Every assertion reads only rules-visible state (zones, counters, life, AP,
 * resources, the combat projection, and the rules view for evaluated numbers)
 * — never private runtime internals.
 */

import {
  FAB_ZONE_KINDS,
  type FabCombatStep,
  type FabMatchState,
  type FabZoneKind,
} from "../state.ts";
import { tokenDefinitionsBySlug } from "./token-registry.ts";
import type { FabDecision } from "../rules/process.ts";
import { buildFabRulesView } from "../rules/state-rules-view.ts";
import { describeFabWaitState } from "./intent.ts";
import { findFabInstanceZone, type FabCardInstanceRef, type FabFluentCardRef } from "./card-ref.ts";
import { fabCardRefId, inspectFabTestObject, type FabCardRef } from "./test-fixtures.ts";
import type { FabPlayerHandle, FabTestEngine } from "./test-engine.ts";

export interface FabCardAssert {
  /** Assert the card occupies `zone` for the handle's player (or anywhere if moved). */
  toBeIn(zone: FabZoneKind): FabCardAssert;
  /**
   * CR 3.0.14: assert the card is hosted as a sub-card under `host` (its
   * membership is the subcardsByHostId topology, not a zone list).
   */
  toBeUnder(host: FabFluentCardRef): FabCardAssert;
  /** Assert the card is in its owner's banished zone. */
  toBeBanished(): FabCardAssert;
  /** Assert total counters (optionally only the named counter kind). */
  toHaveCounters(count: number, name?: string): FabCardAssert;
  /** Assert the numeric defense-counter total (e.g. battleworn/guardwell −1s). */
  toHaveDefenseCounters(count: number): FabCardAssert;
  /** Assert the current evaluated power of the object. */
  toHavePower(power: number): FabCardAssert;
  /** Assert the current evaluated defense of the object. */
  toHaveDefense(defense: number): FabCardAssert;
  /** Assert the current evaluated cost of the object. */
  toHaveCost(cost: number): FabCardAssert;
  /**
   * Assert the current evaluated color (CR 2.1). `null` means the object has
   * no color (Blanch: "lose all colors").
   */
  toHaveColor(color: "Red" | "Yellow" | "Blue" | "Purple" | null): FabCardAssert;
  /** Assert the card's current evaluated keyword set contains `keyword`. */
  toHaveKeyword(keyword: string): FabCardAssert;
  /** Assert the card's current evaluated keyword set omits `keyword`. */
  notToHaveKeyword(keyword: string): FabCardAssert;
  /** Assert the face-down marker is present. */
  toBeFaceDown(): FabCardAssert;
  /** Assert the face-down marker is absent (public face showing). */
  toBeFaceUp(): FabCardAssert;
  /** Assert whether the card is exhausted (tapped). */
  toBeTapped(): FabCardAssert;
  /** Assert whether the card is ready (not tapped). */
  toBeReady(): FabCardAssert;
  /** Assert the frozen marker is present (CR Freeze). */
  toBeFrozen(): FabCardAssert;
  /** Assert the frozen marker is absent. */
  notToBeFrozen(): FabCardAssert;
  /** Assert the evaluated type box contains `supertype`. */
  toHaveSupertype(supertype: string): FabCardAssert;
  /** Assert the evaluated type box omits `supertype`. */
  notToHaveSupertype(supertype: string): FabCardAssert;
  /** Assert the evaluated name list equals `names` (order-insensitive). */
  toHaveNames(names: readonly string[]): FabCardAssert;
  toHaveName(name: string): FabCardAssert;
  notToHaveName(name: string): FabCardAssert;
}

export interface FabPlayerAssert {
  toHaveLife(life: number): FabPlayerAssert;
  toHaveHandCount(count: number): FabPlayerAssert;
  toHaveResourceCount(count: number): FabPlayerAssert;
  toHaveAP(ap: number): FabPlayerAssert;
  toBeActive(): FabPlayerAssert;
  /** Count of `token:<slug>` objects in this player's arena. */
  toHaveTokenCount(slug: string, count: number): FabPlayerAssert;
  /** CR 9.3 Marked. */
  toBeMarked(): FabPlayerAssert;
  notToBeMarked(): FabPlayerAssert;
  /** CR 8.5.39 contract task text, or `null` when none is pending. */
  toHaveActiveContract(text: string | null): FabPlayerAssert;
  toHaveDiplomacyChoice(choice: "war" | "peace" | null): FabPlayerAssert;
  toHaveChargedThisTurn(): FabPlayerAssert;
  notToHaveChargedThisTurn(): FabPlayerAssert;
  toHaveCrowdBooedThisTurn(): FabPlayerAssert;
  notToHaveCrowdBooedThisTurn(): FabPlayerAssert;
  toHaveWeaponAttacksThisTurn(count: number): FabPlayerAssert;
}

export interface FabTokenAssert {
  toHaveCount(count: number): FabTokenAssert;
  toBeIn(zone: FabZoneKind): FabTokenAssert;
}

export interface FabCombatAssert {
  toBeOpen(): FabCombatAssert;
  toBeClosed(): FabCombatAssert;
  toBeAtStep(step: FabCombatStep): FabCombatAssert;
  toHaveAttackPower(power: number): FabCombatAssert;
  toHaveKeyword(keyword: string): FabCombatAssert;
  notToHaveKeyword(keyword: string): FabCombatAssert;
  toHaveAttackSupertype(supertype: string): FabCombatAssert;
  notToHaveAttackSupertype(supertype: string): FabCombatAssert;
  toHaveClashWinner(player: FabPlayerHandle): FabCombatAssert;
}

export interface FabWaitAssert {
  /** No pending decision, no open combat, action-window (or resolving) wait. */
  toBeIdle(): FabWaitAssert;
  toHaveDecision(kind: FabDecision["kind"]): FabWaitAssert;
  /** Assert there is no pending player decision (combat may still be open). */
  notToHaveDecision(): FabWaitAssert;
  toHaveNumericRange(min: number, max: number): FabWaitAssert;
  toHaveTargetRange(min: number, max: number): FabWaitAssert;
}

function fail(message: string): never {
  throw new Error(message);
}

function hasFrozenMarker(handle: FabPlayerHandle, ref: FabCardInstanceRef): boolean {
  const record = handle.getState().objects[ref.instanceId];
  if (!record) {
    fail(`Expected ${ref.canonicalId} (${ref.instanceId}) to exist so freeze can be asserted.`);
  }
  return record.markers.some((marker) => marker.kind === "frozen");
}

function objectNames(handle: FabPlayerHandle, ref: FabCardInstanceRef): readonly string[] {
  const state = handle.getState();
  const record = state.objects[ref.instanceId];
  if (!record) fail(`Card instance "${ref.instanceId}" is missing from match state.`);
  return (
    buildFabRulesView(state).object({
      instanceId: ref.instanceId,
      incarnation: record.incarnation,
    })?.current.names ?? []
  );
}

function objectSupertypes(handle: FabPlayerHandle, ref: FabCardInstanceRef): readonly string[] {
  const state = handle.getState();
  const record = state.objects[ref.instanceId];
  if (!record) fail(`Card instance "${ref.instanceId}" is missing from match state.`);
  return (
    buildFabRulesView(state).object({
      instanceId: ref.instanceId,
      incarnation: record.incarnation,
    })?.current.typeBox.supertypes ?? []
  );
}

function combatAttackSupertypes(game: FabTestEngine): readonly string[] {
  const sourceId = game.combat()?.activeLink?.activeAttack?.sourceObjectId;
  if (!sourceId) return [];
  const state = game.getState();
  const record = state.objects[sourceId];
  if (!record) return [];
  return (
    buildFabRulesView(state).object({
      instanceId: sourceId,
      incarnation: record.incarnation,
    })?.current.typeBox.supertypes ?? []
  );
}

/** Locate a card instance in any player's zones (own player first). */
function locateZone(
  state: FabMatchState,
  preferPlayerId: string,
  instanceId: string,
): {
  playerId: string;
  zone: FabZoneKind;
} | null {
  const own = findFabInstanceZone(state, preferPlayerId, instanceId);
  if (own !== null) return { playerId: preferPlayerId, zone: own };
  for (const playerId of state.playerIds) {
    if (playerId === preferPlayerId) continue;
    const zone = findFabInstanceZone(state, playerId, instanceId);
    if (zone !== null) return { playerId, zone };
  }
  return null;
}

/** Resolve a fluent ref for assertions: instance refs pass through untouched. */
function resolveForAssert(handle: FabPlayerHandle, card: FabFluentCardRef): FabCardInstanceRef {
  return handle.ref(card);
}

/**
 * Chainable card assertions. A definition ref is resolved through the handle
 * (unique-or-throw); an instance ref is used directly.
 */
export function expectFabCard(handle: FabPlayerHandle, card: FabFluentCardRef): FabCardAssert {
  const ref = resolveForAssert(handle, card);

  const assert: FabCardAssert = {
    toBeIn(zone) {
      const location = locateZone(handle.getState(), handle.id, ref.instanceId);
      if (location === null || location.zone !== zone || location.playerId !== handle.id) {
        fail(
          `Expected ${ref.canonicalId} (${ref.instanceId}) to be in ${handle.id} ${zone}, ` +
            `but it is ${location ? `in ${location.playerId} ${location.zone}` : "nowhere"}.`,
        );
      }
      return assert;
    },

    toBeUnder(host) {
      const state = handle.getState();
      const hostRef = handle.ref(host);
      const hosted = state.containers.subcardsByHostId[hostRef.instanceId] ?? [];
      if (!hosted.some((id) => id === ref.instanceId)) {
        const located = locateZone(state, handle.id, ref.instanceId);
        fail(
          `Expected ${ref.canonicalId} (${ref.instanceId}) to be hosted under ` +
            `${hostRef.instanceId}, but it is ${located ? `in ${located.playerId} ${located.zone}` : "nowhere"}.`,
        );
      }
      return assert;
    },

    toBeBanished() {
      return assert.toBeIn("banished");
    },

    toHaveCounters(count, name) {
      const record = handle.getState().objects[ref.instanceId];
      if (!record) fail(`Card instance "${ref.instanceId}" is missing from match state.`);
      const total = record!.counters.reduce((sum, counter) => {
        if (counter.kind === "damage") return sum;
        if (name !== undefined) {
          return counter.kind === "named" && counter.name === name ? sum + counter.count : sum;
        }
        return sum + counter.count;
      }, 0);
      if (total !== count) {
        fail(
          `Expected ${ref.canonicalId} to have ${count}${name ? ` "${name}"` : ""} counters, but found ${total}.`,
        );
      }
      return assert;
    },

    toHaveDefenseCounters(count) {
      const actual =
        inspectFabTestObject(handle.getState(), ref.instanceId).defenseCounterTotal ?? 0;
      if (actual !== count) {
        fail(`Expected ${ref.canonicalId} to have ${count} defense counters, but found ${actual}.`);
      }
      return assert;
    },

    toHavePower(power) {
      const state = handle.getState();
      const record = state.objects[ref.instanceId];
      if (!record) fail(`Card instance "${ref.instanceId}" is missing from match state.`);
      const evaluated = buildFabRulesView(state).object({
        instanceId: ref.instanceId,
        incarnation: record!.incarnation,
      });
      const actual = evaluated?.current.numeric.power;
      if (actual !== power) {
        fail(`Expected ${ref.canonicalId} to have power ${power}, but found ${actual ?? "none"}.`);
      }
      return assert;
    },

    toHaveDefense(defense) {
      const state = handle.getState();
      const record = state.objects[ref.instanceId];
      if (!record) fail(`Card instance "${ref.instanceId}" is missing from match state.`);
      const evaluated = buildFabRulesView(state).object({
        instanceId: ref.instanceId,
        incarnation: record!.incarnation,
      });
      const actual = evaluated?.current.numeric.defense;
      if (actual !== defense) {
        fail(
          `Expected ${ref.canonicalId} to have defense ${defense}, but found ${actual ?? "none"}.`,
        );
      }
      return assert;
    },

    toHaveCost(cost) {
      const state = handle.getState();
      const record = state.objects[ref.instanceId];
      if (!record) fail(`Card instance "${ref.instanceId}" is missing from match state.`);
      const evaluated = buildFabRulesView(state).object({
        instanceId: ref.instanceId,
        incarnation: record!.incarnation,
      });
      const actual = evaluated?.current.numeric.cost;
      if (actual !== cost) {
        fail(`Expected ${ref.canonicalId} to have cost ${cost}, but found ${actual ?? "none"}.`);
      }
      return assert;
    },

    toHaveColor(color) {
      const state = handle.getState();
      const record = state.objects[ref.instanceId];
      if (!record) fail(`Card instance "${ref.instanceId}" is missing from match state.`);
      const evaluated = buildFabRulesView(state).object({
        instanceId: ref.instanceId,
        incarnation: record.incarnation,
      });
      const raw = evaluated?.current.color ?? null;
      const actual =
        raw === null || raw === undefined
          ? null
          : raw.slice(0, 1).toUpperCase() + raw.slice(1).toLowerCase();
      const expected =
        color === null ? null : color.slice(0, 1).toUpperCase() + color.slice(1).toLowerCase();
      if (actual !== expected) {
        fail(
          `Expected ${ref.canonicalId} to have color ${expected ?? "none"}, but found ${actual ?? "none"}.`,
        );
      }
      return assert;
    },

    toHaveKeyword(keyword) {
      const state = handle.getState();
      const record = state.objects[ref.instanceId];
      if (!record) fail(`Card instance "${ref.instanceId}" is missing from match state.`);
      const keywords: readonly string[] =
        buildFabRulesView(state)
          .object({ instanceId: ref.instanceId, incarnation: record.incarnation })
          ?.current.keywords.map(({ name }) => name) ?? [];
      if (!keywords.includes(keyword)) {
        fail(
          `Expected ${ref.canonicalId} to have keyword "${keyword}", got ${keywords.join(", ") || "none"}.`,
        );
      }
      return assert;
    },

    notToHaveKeyword(keyword) {
      const state = handle.getState();
      const record = state.objects[ref.instanceId];
      if (!record) fail(`Card instance "${ref.instanceId}" is missing from match state.`);
      const keywords: readonly string[] =
        buildFabRulesView(state)
          .object({ instanceId: ref.instanceId, incarnation: record.incarnation })
          ?.current.keywords.map(({ name }) => name) ?? [];
      if (keywords.includes(keyword)) {
        fail(`Expected ${ref.canonicalId} not to have keyword "${keyword}".`);
      }
      return assert;
    },

    toBeFaceDown() {
      const record = handle.getState().objects[ref.instanceId];
      // A missing record (token/Macro/ephemeral that ceased to exist) must
      // fail, not silently pass on the `?? false` fallback — the capture may
      // predate the card leaving play.
      if (!record) {
        fail(
          `Expected ${ref.canonicalId} (${ref.instanceId}) to be face down, but the object no longer exists.`,
        );
      }
      const faceDown = record.markers.some((marker) => marker.kind === "face-down");
      if (!faceDown) {
        fail(`Expected ${ref.canonicalId} (${ref.instanceId}) to be face down, but it is face up.`);
      }
      return assert;
    },

    toBeFaceUp() {
      const record = handle.getState().objects[ref.instanceId];
      if (!record) {
        fail(
          `Expected ${ref.canonicalId} (${ref.instanceId}) to be face up, but the object no longer exists.`,
        );
      }
      const faceDown = record.markers.some((marker) => marker.kind === "face-down");
      if (faceDown) {
        fail(`Expected ${ref.canonicalId} (${ref.instanceId}) to be face up, but it is face down.`);
      }
      return assert;
    },

    toBeTapped() {
      const record = handle.getState().objects[ref.instanceId];
      const tapped = record?.markers.some((marker) => marker.kind === "tapped") ?? false;
      if (!tapped) fail(`Expected ${ref.canonicalId} (${ref.instanceId}) to be tapped.`);
      return assert;
    },

    toBeReady() {
      const record = handle.getState().objects[ref.instanceId];
      if (!record) {
        fail(
          `Expected ${ref.canonicalId} (${ref.instanceId}) to be ready, but the object no longer exists.`,
        );
      }
      const tapped = record.markers.some((marker) => marker.kind === "tapped");
      if (tapped) fail(`Expected ${ref.canonicalId} (${ref.instanceId}) to be ready.`);
      return assert;
    },

    toBeFrozen() {
      if (!hasFrozenMarker(handle, ref)) {
        fail(`Expected ${ref.canonicalId} (${ref.instanceId}) to be frozen.`);
      }
      return assert;
    },

    notToBeFrozen() {
      if (hasFrozenMarker(handle, ref)) {
        fail(`Expected ${ref.canonicalId} (${ref.instanceId}) not to be frozen.`);
      }
      return assert;
    },

    toHaveSupertype(supertype) {
      const supertypes = objectSupertypes(handle, ref);
      if (!supertypes.includes(supertype)) {
        fail(
          `Expected ${ref.canonicalId} to have supertype "${supertype}", got ${supertypes.join(", ") || "none"}.`,
        );
      }
      return assert;
    },

    notToHaveSupertype(supertype) {
      const supertypes = objectSupertypes(handle, ref);
      if (supertypes.includes(supertype)) {
        fail(`Expected ${ref.canonicalId} not to have supertype "${supertype}".`);
      }
      return assert;
    },

    toHaveNames(names) {
      const actual = [...objectNames(handle, ref)].sort();
      const expected = [...names].sort();
      if (
        actual.length !== expected.length ||
        actual.some((name, index) => name !== expected[index])
      ) {
        fail(
          `Expected ${ref.canonicalId} names [${expected.join(", ")}], got [${actual.join(", ") || "none"}].`,
        );
      }
      return assert;
    },

    toHaveName(name) {
      const actual = objectNames(handle, ref);
      if (!actual.includes(name)) {
        fail(
          `Expected ${ref.canonicalId} to have name "${name}", got [${actual.join(", ") || "none"}].`,
        );
      }
      return assert;
    },

    notToHaveName(name) {
      const actual = objectNames(handle, ref);
      if (actual.includes(name)) {
        fail(`Expected ${ref.canonicalId} not to have name "${name}".`);
      }
      return assert;
    },
  };

  return assert;
}

/** Chainable player assertions over the handle's public query surface. */
export function expectFabPlayer(handle: FabPlayerHandle): FabPlayerAssert {
  const assert: FabPlayerAssert = {
    toHaveLife(life) {
      const actual = handle.life();
      if (actual !== life) fail(`Expected ${handle.id} life ${life}, but found ${actual}.`);
      return assert;
    },
    toHaveHandCount(count) {
      const actual = handle.handCount();
      if (actual !== count) fail(`Expected ${handle.id} hand count ${count}, but found ${actual}.`);
      return assert;
    },
    toHaveResourceCount(count) {
      const actual = handle.resourcePoints();
      if (actual !== count) {
        fail(`Expected ${handle.id} resource points ${count}, but found ${actual}.`);
      }
      return assert;
    },
    toHaveAP(ap) {
      const actual = handle.actionPoints();
      if (actual !== ap) fail(`Expected ${handle.id} AP ${ap}, but found ${actual}.`);
      return assert;
    },
    toBeActive() {
      if (!handle.isActive()) fail(`Expected ${handle.id} to be the active player.`);
      return assert;
    },
    toHaveTokenCount(slug, count) {
      const actual = countTokensForPlayer(handle.getState(), handle.id, tokenCanonicalId(slug));
      if (actual !== count) {
        fail(
          `Expected ${handle.id} to have ${count} ${tokenCanonicalId(slug)} token(s) in arena, found ${actual}.`,
        );
      }
      return assert;
    },
    toBeMarked() {
      if (!handle.isMarked()) fail(`Expected ${handle.id} to be marked.`);
      return assert;
    },
    notToBeMarked() {
      if (handle.isMarked()) fail(`Expected ${handle.id} not to be marked.`);
      return assert;
    },
    toHaveActiveContract(text) {
      const actual = handle.activeContract();
      if (actual !== text) {
        fail(
          `Expected ${handle.id} active contract ${JSON.stringify(text)}, found ${JSON.stringify(actual)}.`,
        );
      }
      return assert;
    },
    toHaveDiplomacyChoice(choice) {
      const actual = handle.diplomacyChoice();
      if (actual !== choice) {
        fail(`Expected ${handle.id} diplomacy choice ${choice}, found ${actual}.`);
      }
      return assert;
    },
    toHaveChargedThisTurn() {
      if (!handle.hasChargedThisTurn()) fail(`Expected ${handle.id} to have charged this turn.`);
      return assert;
    },
    notToHaveChargedThisTurn() {
      if (handle.hasChargedThisTurn()) fail(`Expected ${handle.id} not to have charged this turn.`);
      return assert;
    },
    toHaveCrowdBooedThisTurn() {
      if (!handle.hasCrowdBooedThisTurn()) {
        fail(`Expected ${handle.id} crowd to have booed this turn.`);
      }
      return assert;
    },
    notToHaveCrowdBooedThisTurn() {
      if (handle.hasCrowdBooedThisTurn()) {
        fail(`Expected ${handle.id} crowd not to have booed this turn.`);
      }
      return assert;
    },
    toHaveWeaponAttacksThisTurn(count) {
      const actual = handle.weaponAttacksThisTurn();
      if (actual !== count) {
        fail(`Expected ${handle.id} to have ${count} weapon attacks this turn, found ${actual}.`);
      }
      return assert;
    },
  };
  return assert;
}

function tokenCanonicalId(slug: string): string {
  return slug.startsWith("token:") ? slug : `token:${slug}`;
}

function countTokensForPlayer(state: FabMatchState, playerId: string, canonicalId: string): number {
  // Direct authored-token fixtures retain catalog identity; tokens generated
  // by an effect use the registered runtime alias. Both denote the same token.
  const authoredId = tokenDefinitionsBySlug.get(canonicalId.replace(/^token:/, ""))?.canonicalId;
  return (state.containers.zonesByPlayerId[playerId]?.arena ?? []).filter((instanceId) => {
    const object = state.objects[instanceId];
    return (
      object !== undefined &&
      (object.canonicalId === canonicalId || object.canonicalId === authoredId)
    );
  }).length;
}

function listTokens(
  state: FabMatchState,
  canonicalId: string,
): readonly {
  readonly playerId: string;
  readonly zone: FabZoneKind;
  readonly instanceId: string;
}[] {
  const found: { playerId: string; zone: FabZoneKind; instanceId: string }[] = [];
  for (const playerId of state.playerIds) {
    for (const zone of FAB_ZONE_KINDS) {
      for (const instanceId of state.containers.zonesByPlayerId[playerId]![zone]) {
        if (state.objects[instanceId]?.canonicalId === canonicalId) {
          found.push({ playerId, zone, instanceId });
        }
      }
    }
  }
  return found;
}

/**
 * Assert created tokens (`token:<slug>`). Catalog token modules will not match
 * these instances — use this helper, not `expectFabCard`.
 */
export function expectFabToken(game: FabTestEngine, slug: string): FabTokenAssert {
  const canonicalId = tokenCanonicalId(slug);
  const assert: FabTokenAssert = {
    toHaveCount(count) {
      const actual = listTokens(game.getState(), canonicalId).length;
      if (actual !== count) {
        fail(`Expected ${count} ${canonicalId} token(s), found ${actual}.`);
      }
      return assert;
    },
    toBeIn(zone) {
      const found = listTokens(game.getState(), canonicalId);
      if (found.length === 0) fail(`Expected ${canonicalId} in ${zone}, found none.`);
      if (!found.some((entry) => entry.zone === zone)) {
        fail(
          `Expected ${canonicalId} in ${zone}, found in ${[...new Set(found.map((entry) => entry.zone))].join(", ")}.`,
        );
      }
      return assert;
    },
  };
  return assert;
}

/** Chainable combat-chain assertions over the production combat projection. */
export function expectCombat(game: FabTestEngine): FabCombatAssert {
  const describe = (): string => {
    const combat = game.combat();
    return combat?.open ? `open at step "${combat.step}"` : "closed";
  };
  const assert: FabCombatAssert = {
    toBeOpen() {
      if (!game.combat()?.open) fail(`Expected combat to be open, but it is ${describe()}.`);
      return assert;
    },
    toBeClosed() {
      if (game.combat()?.open) fail(`Expected combat to be closed, but it is ${describe()}.`);
      return assert;
    },
    toBeAtStep(step) {
      const combat = game.combat();
      if (!combat?.open || combat.step !== step) {
        fail(`Expected combat at step "${step}", but it is ${describe()}.`);
      }
      return assert;
    },
    toHaveAttackPower(power) {
      const actual = game.combat()?.activeLink?.attackPower;
      if (actual !== power)
        fail(`Expected combat attack power ${power}, but found ${actual ?? "none"}.`);
      return assert;
    },
    toHaveKeyword(keyword) {
      const keywords = game.combat()?.activeLink?.keywords ?? [];
      if (!keywords.includes(keyword)) {
        fail(`Expected combat to have keyword "${keyword}", got ${keywords.join(", ") || "none"}.`);
      }
      return assert;
    },
    notToHaveKeyword(keyword) {
      const keywords = game.combat()?.activeLink?.keywords ?? [];
      if (keywords.includes(keyword)) {
        fail(`Expected combat not to have keyword "${keyword}".`);
      }
      return assert;
    },
    toHaveAttackSupertype(supertype) {
      const supertypes = combatAttackSupertypes(game);
      if (!supertypes.includes(supertype)) {
        fail(
          `Expected the active attack to have supertype "${supertype}", got ${supertypes.join(", ") || "none"}.`,
        );
      }
      return assert;
    },
    notToHaveAttackSupertype(supertype) {
      const supertypes = combatAttackSupertypes(game);
      if (supertypes.includes(supertype)) {
        fail(`Expected the active attack not to have supertype "${supertype}".`);
      }
      return assert;
    },
    toHaveClashWinner(player) {
      const actual = game.getState().lastClashWinnerId;
      if (actual !== player.id) {
        fail(`Expected clash winner ${player.id}, found ${actual ?? "none"}.`);
      }
      return assert;
    },
  };
  return assert;
}

/** Chainable wait-state assertions over {@link FabTestEngine.waitState}. */
export function expectWait(game: FabTestEngine): FabWaitAssert {
  const assert: FabWaitAssert = {
    toBeIdle() {
      const wait = game.waitState();
      const combatOpen = Boolean(game.combat()?.open);
      const idle =
        !combatOpen &&
        wait.kind !== "decision" &&
        wait.kind !== "defense-declaration" &&
        wait.kind !== "game-over" &&
        (wait.kind === "resolving" || (wait.kind === "priority" && wait.window === "action"));
      if (!idle) {
        fail(`Expected the match to be idle, but it is ${describeFabWaitState(wait)}.`);
      }
      return assert;
    },
    toHaveDecision(kind) {
      const wait = game.waitState();
      if (wait.kind !== "decision" || wait.decision.kind !== kind) {
        fail(
          `Expected a pending ${kind} decision, but the match is ${describeFabWaitState(wait)}.`,
        );
      }
      return assert;
    },
    notToHaveDecision() {
      const wait = game.waitState();
      if (wait.kind === "decision") {
        fail(`Expected no pending decision, but the match is ${describeFabWaitState(wait)}.`);
      }
      return assert;
    },
    toHaveTargetRange(min, max) {
      const wait = game.waitState();
      if (wait.kind !== "decision" || wait.decision.kind !== "entity-target") {
        fail(`Expected a target selection, but it is ${describeFabWaitState(wait)}.`);
      }
      if (wait.decision.min !== min || wait.decision.max !== max) {
        fail(
          `Expected target range ${min}..${max}, found ${wait.decision.min}..${wait.decision.max}.`,
        );
      }
      return assert;
    },
    toHaveNumericRange(min, max) {
      const wait = game.waitState();
      if (wait.kind !== "decision" || wait.decision.kind !== "numeric") {
        fail(
          `Expected a pending numeric decision, but the match is ${describeFabWaitState(wait)}.`,
        );
      }
      if (wait.decision.min !== min || wait.decision.max !== max) {
        fail(
          `Expected numeric range [${min}, ${max}], found [${wait.decision.min}, ${wait.decision.max}].`,
        );
      }
      return assert;
    },
  };
  return assert;
}

/**
 * Assert the match ended, optionally with the given hero as winner. Wraps the
 * existing {@link FabTestEngine.assertGameEnded}; a hero definition is mapped
 * to its seated player id.
 */
export function expectWinner(game: FabTestEngine, hero?: FabCardRef): void {
  if (hero === undefined) {
    game.assertGameEnded();
    return;
  }
  const canonicalId = fabCardRefId(hero);
  const state = game.getState();
  const winnerPlayerId = state.playerIds.find((playerId) => {
    const heroInstanceId = state.players[playerId]?.heroCardId;
    return heroInstanceId ? state.objects[heroInstanceId]?.canonicalId === canonicalId : false;
  });
  if (!winnerPlayerId) {
    fail(`No seated player has hero "${canonicalId}".`);
  }
  game.assertGameEnded(winnerPlayerId);
}

/**
 * CR 5.1.5 / 5.1.8a / 1.10.3: the announce reversed. Use this instead of a
 * silent `play()` that leaves the card in hand.
 */
export function expectFabUnplayable(
  act: () => void,
  pattern: RegExp = /couldn't be played|unpayable|no legal target|cannot be paid/i,
): void {
  try {
    act();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!pattern.test(message)) {
      fail(`Expected unplayable matching ${pattern}, got: ${message}`);
    }
    return;
  }
  fail("Expected the announce to reverse (CR 5.1.5 / 1.10.3), but it succeeded.");
}
