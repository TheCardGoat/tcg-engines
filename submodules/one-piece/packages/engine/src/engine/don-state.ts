import type { MatchSeat, MatchState } from "../types.ts";

export type DonLocation = { seat: MatchSeat; area: "active" | "rested" } | { attachedTo: string };

function pool(state: MatchState, location: DonLocation): string[] {
  const ledger = state.donIdentities;
  if (!ledger) return [];
  return "attachedTo" in location
    ? (ledger.attached[location.attachedTo] ??= [])
    : ledger[location.seat][location.area];
}

/** Only explicit native moves update this ledger; aggregate count deltas are never identities. */
export function beginDonIdentityProcess(state: MatchState): string {
  if (!state.donIdentities) {
    state.donIdentities = {
      next: 0,
      processes: [],
      south: { active: [], rested: [] },
      north: { active: [], rested: [] },
      attached: {},
    };
    for (const seat of ["south", "north"] as const) {
      for (const area of ["active", "rested"] as const)
        addDonIdentities(
          state,
          { seat, area },
          state.players[seat][area === "active" ? "activeDon" : "restedDon"],
        );
    }
    for (const card of Object.values(state.cards))
      addDonIdentities(state, { attachedTo: card.instanceId }, card.attachedDon);
  }
  bindDonFreezeModifiers(state);
  const id = `don-process:${state.donIdentities.next++}`;
  state.donIdentities.processes.push(id);
  return id;
}
export function endDonIdentityProcess(state: MatchState, id: string): void {
  if (!state.donIdentities) return;
  state.donIdentities.processes = state.donIdentities.processes.filter((entry) => entry !== id);
  releaseUnusedDonIdentities(state);
}
export function addDonIdentities(state: MatchState, destination: DonLocation, count: number): void {
  if (!state.donIdentities) return;
  for (let index = 0; index < count; index++)
    pool(state, destination).push(`don-token:${state.donIdentities.next++}`);
}
export function donIdentitiesAt(state: MatchState, location: DonLocation): string[] {
  return [...pool(state, location)];
}
export function locateDonIdentity(state: MatchState, token: string): DonLocation | undefined {
  if (!state.donIdentities) return;
  for (const seat of ["south", "north"] as const)
    for (const area of ["active", "rested"] as const)
      if (pool(state, { seat, area }).includes(token)) return { seat, area };
  for (const [attachedTo, ids] of Object.entries(state.donIdentities.attached))
    if (ids.includes(token)) return { attachedTo };
}
export function moveDonIdentities(
  state: MatchState,
  tokens: string[],
  destination?: DonLocation,
): void {
  if (!state.donIdentities) return;
  for (const token of tokens) {
    const from = locateDonIdentity(state, token);
    if (!from) continue;
    const source = pool(state, from);
    source.splice(source.indexOf(token), 1);
    if (destination) {
      const sameArea =
        "attachedTo" in from
          ? "attachedTo" in destination && from.attachedTo === destination.attachedTo
          : !("attachedTo" in destination) && from.seat === destination.seat;
      if (sameArea) pool(state, destination).push(token);
      else addDonIdentities(state, destination, 1);
    }
  }
  refreshDonModifierTargets(state);
  releaseUnusedDonIdentities(state);
}
export function donIdentitiesForVirtualIds(
  state: MatchState,
  seat: MatchSeat,
  ids: string[],
): string[] {
  if (!state.donIdentities) return [];
  return ids.flatMap((id) => {
    if (id.startsWith("don-token:")) return locateDonIdentity(state, id) ? [id] : [];
    const attached = /^attached-don:(.+):(\d+)$/.exec(id);
    const area = /^(active|rested)-don:(?:(south|north):)?(\d+)$/.exec(id);
    const token = attached
      ? pool(state, { attachedTo: attached[1]! })[Number(attached[2])]
      : area
        ? pool(state, {
            seat: area[2] === "south" || area[2] === "north" ? area[2] : seat,
            area: area[1] === "active" ? "active" : "rested",
          })[Number(area[3])]
        : undefined;
    return token ? [token] : [];
  });
}
/** Caller must supply selected identities when a proper subset requires a choice. */
export function transferDonIdentities(
  state: MatchState,
  from: DonLocation,
  destination: DonLocation | undefined,
  count: number,
  tokens?: string[],
): void {
  if (!state.donIdentities) return;
  moveDonIdentities(state, tokens ?? donIdentitiesAt(state, from).slice(0, count), destination);
}

export function releaseUnusedDonIdentities(state: MatchState): void {
  if (
    state.donIdentities &&
    !state.donIdentities.processes.length &&
    !Object.values(state.modifiers).some((modifier) => modifier.donIdentity)
  )
    delete state.donIdentities;
}
export function bindDonFreezeModifiers(state: MatchState): void {
  if (!state.donIdentities) return;
  for (const modifier of Object.values(state.modifiers)) {
    if (modifier.type !== "flag" || modifier.flag !== "freezeDon" || modifier.donIdentity) continue;
    const match = /^rested-don:(south|north):(\d+)$/.exec(modifier.targetId);
    if (!match) continue;
    const token = donIdentitiesAt(state, {
      seat: match[1] === "south" ? "south" : "north",
      area: "rested",
    })[Number(match[2])];
    if (token) modifier.donIdentity = token;
  }
}
export function trackDonFreeze(state: MatchState): void {
  const id = beginDonIdentityProcess(state);
  endDonIdentityProcess(state, id);
}
function refreshDonModifierTargets(state: MatchState): void {
  for (const modifier of Object.values(state.modifiers)) {
    if (!modifier.donIdentity) continue;
    const location = locateDonIdentity(state, modifier.donIdentity);
    if (!location || "attachedTo" in location) {
      delete state.modifiers[modifier.id];
      continue;
    }
    const index = pool(state, location).indexOf(modifier.donIdentity);
    modifier.targetId = `${location.area}-don:${location.seat}:${index}`;
  }
}

/** Ordinal remains stable across active/rested changes and filtered source choices. */
export function donIdentityLabel(state: MatchState, token: string): string {
  const location = locateDonIdentity(state, token);
  const ordinal = Number(token.slice("don-token:".length)) + 1;
  const seat =
    location && "attachedTo" in location ? state.cards[location.attachedTo]?.owner : location?.seat;
  const owner = seat ? state.players[seat].playerName : "Player";
  const stateLabel = !location
    ? "Unavailable"
    : "attachedTo" in location
      ? "Given"
      : location.area === "active"
        ? "Active"
        : "Rested";
  const frozen = Object.values(state.modifiers).some(
    (modifier) => modifier.donIdentity === token && modifier.flag === "freezeDon",
  );
  return `${owner}: ${stateLabel} DON!! ${ordinal}${frozen ? " (cannot refresh next turn)" : ""}`;
}

/** A source decision is needed only when exchanging otherwise equal DON can change a result. */
export function requiresDonIdentityChoice(
  state: MatchState,
  candidates: string[],
  count: number,
): boolean {
  if (!state.donIdentities || count <= 0 || count >= candidates.length) return false;
  if (state.donIdentities.processes.length) return true;
  const signatures = candidates.map((token) =>
    [
      ...new Set(
        Object.values(state.modifiers)
          .filter((modifier) => modifier.donIdentity === token)
          .map((modifier) =>
            JSON.stringify([
              modifier.flag,
              modifier.duration,
              modifier.expiresAtTurn,
              modifier.expiresAtBattleId,
              modifier.expiresOnTurnStartOfSeat,
            ]),
          ),
      ),
    ]
      .sort()
      .join("|"),
  );
  return new Set(signatures).size > 1;
}

/** Saved matches predating identity tracking still contain the native freeze modifiers. */
export function ensureDonIdentityRestrictions(state: MatchState): void {
  if (state.donIdentities) {
    bindDonFreezeModifiers(state);
    return;
  }
  if (
    Object.values(state.modifiers).some(
      (modifier) => modifier.type === "flag" && modifier.flag === "freezeDon",
    )
  )
    trackDonFreeze(state);
}

export function virtualIdsForDonIdentities(
  state: MatchState,
  tokens: string[],
  includeSeat = false,
): string[] {
  return tokens.flatMap((token) => {
    const location = locateDonIdentity(state, token);
    if (!location) return [];
    const index = pool(state, location).indexOf(token);
    return [
      "attachedTo" in location
        ? `attached-don:${location.attachedTo}:${index}`
        : `${location.area}-don:${includeSeat ? `${location.seat}:` : ""}${index}`,
    ];
  });
}
