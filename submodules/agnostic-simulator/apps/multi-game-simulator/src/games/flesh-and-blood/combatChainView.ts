import type { SimulatorEntity } from "@tcg/simulator-contract";

import type {
  FabCardDefinition,
  FabPresentationCard,
  FabPresentationCombat,
  FabPresentationCombatStep,
  FabPresentationAttackTarget,
  FabPresentationResolvedLink,
  FabPresentationState,
} from "./state";
import {
  entityFor,
  entityForFabPresentationCard,
  entityForFabViewer,
  metadataForFabPresentationCard,
  numericStatForFabEntity,
  type FabCardMetadata,
} from "./projection";

export type FabCombatPresentationMode = "closed" | "between-links" | "active-link";

export interface FabCombatChainCardView {
  /** The same viewer-safe entity rendered by hand, board, prompt, and preview surfaces. */
  readonly entity: SimulatorEntity;
  /** Public sub-cards that remain under this attack-source on the combat chain. */
  readonly hostedCards: readonly SimulatorEntity[];
  readonly keywords: readonly string[];
  readonly role: "attack" | "defend" | "attack-reaction" | "defense-reaction" | "other";
}

export interface FabCombatResolvedLinkView {
  readonly index: number;
  readonly attackInstanceId: string;
  readonly attacker: FabCombatChainCardView | null;
  readonly attackName: string;
  readonly attackTargets: readonly FabCombatAttackTargetView[];
  readonly defenders: readonly FabCombatChainCardView[];
  readonly reactions: readonly FabCombatChainCardView[];
  readonly attackPower: number | null;
  readonly totalDefense: number | null;
  readonly damage: number;
  readonly damageResolved: boolean;
  readonly didHit: boolean;
  readonly blocked: boolean;
  readonly outcomeLabel: string;
  readonly summary: string;
  readonly active: boolean;
}

export type FabCombatAttackTargetView =
  | { readonly kind: "hero"; readonly playerId: string }
  | {
      readonly kind: "object";
      readonly instanceId: string;
      readonly controllerId: string;
      readonly card: FabCombatChainCardView | null;
    };

export interface FabCombatStackEntryView {
  /** Physical source card; differs from id for synthetic triggered layers. */
  readonly sourceInstanceId?: string;
  /** 1-based order; 1 resolves next. */
  readonly order: number;
  /** The same entity rendered by every other live-card surface. */
  readonly entity: SimulatorEntity;
}

export interface FabCombatStepProgressItem {
  readonly step: FabPresentationCombatStep;
  readonly label: string;
  readonly status: "done" | "current" | "upcoming";
}

export interface FabCombatChainView {
  readonly empty: boolean;
  readonly open: boolean;
  readonly mode: FabCombatPresentationMode;
  readonly step: FabPresentationCombatStep | null;
  readonly stepLabel: string | null;
  readonly stepProgress: readonly FabCombatStepProgressItem[];
  readonly attacker: FabCombatChainCardView | null;
  /** Unresolved attack-layer shown in the combat surface before a chain link exists. */
  readonly pendingAttack: FabCombatChainCardView | null;
  readonly defenders: readonly FabCombatChainCardView[];
  readonly reactions: readonly FabCombatChainCardView[];
  readonly totalDefense: number;
  readonly attackPower: number;
  readonly projectedDamage: number | null;
  readonly keywords: readonly string[];
  readonly damageResolved: boolean;
  readonly didHit: boolean;
  readonly summary: string;
  readonly resolvedLinks: readonly FabCombatResolvedLinkView[];
  readonly linkHistory: readonly FabCombatResolvedLinkView[];
  readonly stack: readonly FabCombatStackEntryView[];
  readonly attackingPlayerId: string | null;
  readonly defendingPlayerId: string | null;
  readonly defendingHeroId: string | null;
  readonly defendingHero: FabCombatChainCardView | null;
  /** Hero targets are retained for semantics; object targets include their public card. */
  readonly attackTargets: readonly FabCombatAttackTargetView[];
  readonly priorityPlayerId: string | null;
  readonly actionHint: string | null;
}

/** FAB combat steps shown in progress UI (CR 7.0.1). Reaction is one step. */
export const FAB_COMBAT_STEP_ORDER: readonly FabPresentationCombatStep[] = [
  "layer",
  "attack",
  "defend",
  "reaction",
  "damage",
  "resolution",
] as const;

const STEP_LABELS: Record<FabPresentationCombatStep, string> = {
  layer: "Layer",
  attack: "Attack",
  defend: "Defend",
  reaction: "Reaction",
  damage: "Damage",
  resolution: "Resolution",
  close: "Close",
};

export function projectCombatChainCard(
  card: FabPresentationCard,
  def: FabCardDefinition | undefined,
  role: FabCombatChainCardView["role"],
  metadata?: FabCardMetadata,
  hostedCards: readonly SimulatorEntity[] = [],
): FabCombatChainCardView {
  const entity = entityForFabViewer(
    card,
    metadataForFabPresentationCard(card, def, metadata),
    card.ownerId,
    { frame: "tactical" },
  );
  return {
    entity,
    hostedCards,
    keywords: def?.keywords ?? [],
    role,
  };
}

function hostedEntitiesForCombatCard(
  card: FabPresentationCard,
  state: FabPresentationState,
): readonly SimulatorEntity[] {
  const hostInstanceIds = new Set(
    [card.id, card.sourceInstanceId].filter((id): id is string => Boolean(id)),
  );
  return Object.values(state.cards).flatMap((hostedCard) => {
    if (!hostedCard.hostInstanceId || !hostInstanceIds.has(hostedCard.hostInstanceId)) return [];
    const definition = state.cardDefinitions[hostedCard.cardId];
    return [
      entityForFabPresentationCard(
        hostedCard,
        metadataForFabPresentationCard(hostedCard, definition),
        { kind: "explicit", reveal: hostedCard.face === "up" },
        { decorations: "none" },
      ),
    ];
  });
}

function projectCombatChainCardFromState(
  card: FabPresentationCard,
  state: FabPresentationState,
  role: FabCombatChainCardView["role"],
): FabCombatChainCardView {
  return projectCombatChainCard(
    card,
    definitionForCombatCard(card, state),
    role,
    undefined,
    hostedEntitiesForCombatCard(card, state),
  );
}

export function combatCardNumeric(
  card: FabCombatChainCardView,
  stat: "power" | "defense",
): number | null {
  return numericStatForFabEntity(card.entity, stat);
}

/** Synthetic stack layers keep a distinct id so the seated source can stay on the board. */
function withSeatedSourceLiveStats(
  card: FabPresentationCard,
  cards: FabPresentationState["cards"],
): FabPresentationCard {
  const source = card.sourceInstanceId ? cards[card.sourceInstanceId] : undefined;
  if (!source || source.id === card.id) return card;
  return {
    ...card,
    currentNumeric: card.currentNumeric ?? source.currentNumeric,
    counters: card.counters && card.counters.length > 0 ? card.counters : source.counters,
    printingId: card.printingId ?? source.printingId,
  };
}

function definitionForCombatCard(
  card: FabPresentationCard,
  state: FabPresentationState,
): FabCardDefinition | undefined {
  const own = state.cardDefinitions[card.cardId];
  if (own) return own;
  const sourceId = card.sourceInstanceId;
  const sourceCardId = sourceId ? state.cards[sourceId]?.cardId : undefined;
  return sourceCardId ? state.cardDefinitions[sourceCardId] : undefined;
}

function inferRole(
  card: FabPresentationCard,
  def: FabCardDefinition | undefined,
  combat: FabPresentationCombat | null,
): FabCombatChainCardView["role"] {
  if (card.chainRole) return card.chainRole;
  if (combat?.activeLink?.attackInstanceId === card.id) return "attack";
  if (combat?.activeLink?.defendingInstanceIds.includes(card.id)) return "defend";
  if (combat?.activeLink?.reactionInstanceIds.includes(card.id)) {
    if (def?.cardType === "attack-reaction") return "attack-reaction";
    if (def?.cardType === "defense-reaction") return "defense-reaction";
    return "other";
  }
  if (def?.cardType === "attack-reaction") return "attack-reaction";
  if (def?.cardType === "defense-reaction") return "defense-reaction";
  if ((def?.power ?? 0) > 0 && (def?.defense ?? 0) === 0) return "attack";
  if ((def?.defense ?? 0) > 0) return "defend";
  return "other";
}

function resolveAttackName(state: FabPresentationState, attackInstanceId: string): string {
  const card = state.cards[attackInstanceId];
  if (!card) return "Attack";
  return state.cardDefinitions[card.cardId]?.name ?? "Attack";
}

function resolvedLinkView(
  state: FabPresentationState,
  link: FabPresentationResolvedLink,
  index: number,
): FabCombatResolvedLinkView {
  const blocked = link.damage <= 0;
  const attackCard = state.cards[link.attackInstanceId];
  const attacker = attackCard ? projectCombatChainCardFromState(attackCard, state, "attack") : null;
  const attackName = attacker?.entity.title ?? resolveAttackName(state, link.attackInstanceId);
  const defenders = [...new Set(link.defendingInstanceIds ?? [])].flatMap((id) => {
    const card = state.cards[id];
    if (!card) return [];
    return [projectCombatChainCardFromState(card, state, "defend")];
  });
  const reactions = [...new Set(link.reactionInstanceIds ?? [])].flatMap((id) => {
    const card = state.cards[id];
    if (!card) return [];
    const definition = state.cardDefinitions[card.cardId];
    const role =
      card.chainRole === "attack-reaction" || definition?.cardType === "attack-reaction"
        ? "attack-reaction"
        : card.chainRole === "defense-reaction" || definition?.cardType === "defense-reaction"
          ? "defense-reaction"
          : "other";
    return [projectCombatChainCardFromState(card, state, role)];
  });
  const outcomeLabel = blocked ? "Blocked" : `${link.damage} damage`;
  return {
    index,
    attackInstanceId: link.attackInstanceId,
    attacker,
    attackName,
    attackTargets: link.attackTarget
      ? [link.attackTarget, ...(link.additionalAttackTargets ?? [])].map((target) =>
          attackTargetView(state, target),
        )
      : [],
    defenders,
    reactions,
    attackPower: link.attackPower ?? null,
    totalDefense: link.totalDefense ?? null,
    damage: link.damage,
    damageResolved: true,
    didHit: link.didHit,
    blocked,
    outcomeLabel,
    summary: `Link ${index} · ${attackName} · ${outcomeLabel}`,
    active: false,
  };
}

function buildStepProgress(
  step: FabPresentationCombatStep | null,
  mode: FabCombatPresentationMode,
): FabCombatStepProgressItem[] {
  if (mode === "closed" || !step) {
    return FAB_COMBAT_STEP_ORDER.map((s) => ({
      step: s,
      label: STEP_LABELS[s],
      status: "upcoming" as const,
    }));
  }
  const currentIdx = FAB_COMBAT_STEP_ORDER.indexOf(step === "close" ? "resolution" : step);
  return FAB_COMBAT_STEP_ORDER.map((s, i) => {
    let status: FabCombatStepProgressItem["status"] = "upcoming";
    if (currentIdx < 0) status = "upcoming";
    else if (i < currentIdx) status = "done";
    else if (i === currentIdx) status = "current";
    return { step: s, label: STEP_LABELS[s], status };
  });
}

function findHeroId(state: FabPresentationState, playerId: string | null): string | null {
  if (!playerId) return null;
  const hero = Object.values(state.cards).find((c) => c.ownerId === playerId && c.zone === "hero");
  return hero?.id ?? null;
}

function attackTargetView(
  state: FabPresentationState,
  target: FabPresentationAttackTarget,
): FabCombatAttackTargetView {
  if (target.kind === "hero") return target;
  const card = target.departedCardId
    ? {
        id: target.instanceId,
        cardId: target.departedCardId,
        ownerId: target.controllerIdAtDeclaration,
        zone: "combat-chain" as const,
        face: "up" as const,
      }
    : state.cards[target.instanceId];
  return {
    kind: "object",
    instanceId: target.instanceId,
    controllerId: target.controllerIdAtDeclaration,
    card: card ? projectCombatChainCardFromState(card, state, "other") : null,
  };
}

function projectStack(
  state: FabPresentationState,
  stackInstanceIds: readonly string[] | undefined,
): FabCombatStackEntryView[] {
  if (!stackInstanceIds?.length) return [];
  return stackInstanceIds.map((id, i) => {
    const sourceCard = state.cards[id];
    const card = sourceCard ? withSeatedSourceLiveStats(sourceCard, state.cards) : undefined;
    const def = card ? definitionForCombatCard(card, state) : undefined;
    const entity = card
      ? projectCombatChainCard(card, def, "other").entity
      : entityFor(id, { name: "Effect", type: "effect" }, "shared", true);
    return {
      sourceInstanceId: card?.sourceInstanceId ?? id,
      order: i + 1,
      entity,
    };
  });
}

function closedView(
  priorityPlayerId: string | null,
  stack: readonly FabCombatStackEntryView[],
): FabCombatChainView {
  return {
    empty: stack.length === 0,
    open: false,
    mode: "closed",
    step: null,
    stepLabel: null,
    stepProgress: buildStepProgress(null, "closed"),
    attacker: null,
    pendingAttack: null,
    defenders: [],
    reactions: [],
    totalDefense: 0,
    attackPower: 0,
    projectedDamage: null,
    keywords: [],
    damageResolved: false,
    didHit: false,
    summary: stack.length > 0 ? `${stack.length} card pending resolution` : "Combat chain closed",
    resolvedLinks: [],
    linkHistory: [],
    stack,
    attackingPlayerId: null,
    defendingPlayerId: null,
    defendingHeroId: null,
    defendingHero: null,
    attackTargets: [],
    priorityPlayerId,
    actionHint: null,
  };
}

/**
 * Pure combat-chain presentation model.
 * Prefer engine-aligned `state.combat` when present; fall back to zone cards + roles.
 * Does not invent multi-link history from zone cards — only uses `combat.resolvedLinks`.
 */
export function projectCombatChainView(state: FabPresentationState): FabCombatChainView {
  const combat = state.combat;
  const priorityPlayerId = state.priorityPlayerId;
  const chainCards = Object.values(state.cards).filter((c) => c.zone === "combat-chain");
  const resolvedSource = combat?.resolvedLinks ?? [];
  const announcedPromptCardId =
    state.prompt?.kind === "pay-resource-cost" ? state.prompt.cardId : undefined;
  const canonicalStackIds =
    state.stackInstanceIds && state.stackInstanceIds.length > 0
      ? state.stackInstanceIds
      : (combat?.stackInstanceIds ?? []);
  const stackIds = [
    ...canonicalStackIds,
    ...(canonicalStackIds.length === 0 && announcedPromptCardId ? [announcedPromptCardId] : []),
    // Legacy fixtures without engine-backed stack ordering can still project
    // public stack-zone cards. Once canonical ordering is present, it is the
    // complete source of truth and avoids duplicating an activated layer's
    // equipment source alongside its generated layer entry.
    ...(canonicalStackIds.length === 0
      ? Object.values(state.cards)
          .filter((card) => card.zone === "stack" && card.id !== announcedPromptCardId)
          .map((card) => card.id)
      : []),
  ];
  const stack = projectStack(state, stackIds);
  // During the Layer Step the attack is layer 1, so it remains the bottom
  // (last projected) stack entry while any responses resolve above it.
  const pendingAttackId = combat?.open && combat.step === "layer" ? stackIds.at(-1) : undefined;
  const pendingAttackSource = pendingAttackId ? state.cards[pendingAttackId] : undefined;
  const pendingAttackCard = pendingAttackSource
    ? withSeatedSourceLiveStats(pendingAttackSource, state.cards)
    : undefined;
  const pendingAttack =
    combat?.open && combat.step === "layer" && pendingAttackCard
      ? projectCombatChainCard(
          pendingAttackCard,
          definitionForCombatCard(pendingAttackCard, state),
          "attack",
          undefined,
          hostedEntitiesForCombatCard(pendingAttackCard, state),
        )
      : null;

  // Mode: open+active → active-link; open+no active → between-links;
  // combat null with chain cards → active-link (legacy zone fallback); else closed.
  let mode: FabCombatPresentationMode;
  if (combat?.open && combat.activeLink) {
    mode = "active-link";
  } else if (combat?.open && !combat.activeLink) {
    mode = "between-links";
  } else if (combat === null && chainCards.length > 0) {
    mode = "active-link";
  } else {
    mode = "closed";
  }

  if (mode === "closed") {
    return closedView(priorityPlayerId, stack);
  }

  const resolvedLinks = resolvedSource.map((link, i) => resolvedLinkView(state, link, i + 1));

  // Between links: open combat, no active link
  if (mode === "between-links" && combat) {
    const step = combat.step;
    const stepLabel = STEP_LABELS[step] ?? null;
    const actionHint =
      step === "resolution"
        ? "The turn-player may play another attack. Combat closes after all players pass."
        : "Pass Priority";
    const summary =
      resolvedLinks.length > 0
        ? `Combat open · ${resolvedLinks.length} resolved link${resolvedLinks.length === 1 ? "" : "s"}`
        : "Combat chain open · no active link";
    return {
      empty: false,
      open: true,
      mode: "between-links",
      step,
      stepLabel,
      stepProgress: buildStepProgress(step, "between-links"),
      attacker: null,
      pendingAttack,
      defenders: [],
      reactions: [],
      totalDefense: 0,
      attackPower: 0,
      projectedDamage: null,
      keywords: [],
      damageResolved: false,
      didHit: false,
      summary,
      resolvedLinks,
      linkHistory: resolvedLinks,
      stack,
      attackingPlayerId: null,
      defendingPlayerId: null,
      defendingHeroId: null,
      defendingHero: null,
      attackTargets: [],
      priorityPlayerId,
      actionHint,
    };
  }

  // Active link (or zone-card fallback)
  const byId = new Map(chainCards.map((c) => [c.id, c]));
  const link = combat?.activeLink ?? null;

  let attacker: FabCombatChainCardView | null = null;
  const defenders: FabCombatChainCardView[] = [];
  const reactions: FabCombatChainCardView[] = [];
  const keywords = link?.keywords ?? [];
  const damageResolved = link?.damageResolved ?? false;
  const didHit = link?.didHit ?? false;
  const attackingPlayerId = link?.attackingPlayerId ?? null;
  const defendingPlayerId = link?.defendingPlayerId ?? null;
  const attackTargets = link
    ? [link.attackTarget, ...link.additionalAttackTargets].map((target) =>
        attackTargetView(state, target),
      )
    : [];

  if (link) {
    const attackCard = byId.get(link.attackInstanceId) ?? state.cards[link.attackInstanceId];
    if (attackCard) {
      attacker = projectCombatChainCardFromState(attackCard, state, "attack");
    }
    for (const id of link.defendingInstanceIds) {
      // The engine retains defender ids on the chain-link record as combat
      // history. A card stops defending as soon as an effect moves it off the
      // combat chain (CR 7.0.5a), so only live zone membership belongs in the
      // active defender fan.
      const card = byId.get(id);
      if (!card) continue;
      defenders.push(projectCombatChainCardFromState(card, state, "defend"));
    }
    for (const id of link.reactionInstanceIds) {
      const card = byId.get(id) ?? state.cards[id];
      if (!card) continue;
      const def = state.cardDefinitions[card.cardId];
      const role = inferRole(card, def, combat);
      reactions.push(projectCombatChainCardFromState(card, state, role));
    }
    // A played reaction can reach the physical combat-chain zone one state
    // before the active-link bookkeeping records its id. Keep that visible
    // destination mounted so the hand-to-chain transfer has real geometry.
    const represented = new Set([
      link.attackInstanceId,
      ...link.defendingInstanceIds,
      ...link.reactionInstanceIds,
    ]);
    for (const card of chainCards) {
      if (represented.has(card.id)) continue;
      const def = state.cardDefinitions[card.cardId];
      const role = inferRole(card, def, combat);
      if (role !== "attack-reaction" && role !== "defense-reaction") continue;
      reactions.push(projectCombatChainCardFromState(card, state, role));
    }
  } else {
    for (const card of chainCards) {
      const def = state.cardDefinitions[card.cardId];
      const role = inferRole(card, def, combat);
      const view = projectCombatChainCardFromState(card, state, role);
      if (role === "attack" && !attacker) attacker = view;
      else if (role === "defend") defenders.push(view);
      else if (role === "attack-reaction" || role === "defense-reaction") reactions.push(view);
      else if (!attacker && (def?.power ?? 0) > 0) attacker = view;
      else defenders.push(view);
    }
  }

  const totalDefense = defenders.reduce(
    (sum, defender) => sum + (combatCardNumeric(defender, "defense") ?? 0),
    0,
  );
  const attackPower =
    link?.attackPower ?? (attacker ? combatCardNumeric(attacker, "power") : 0) ?? 0;
  const projectedDamage =
    attacker && !damageResolved ? Math.max(0, attackPower - totalDefense) : null;
  const resolvedDamage = damageResolved
    ? (link?.damage ?? Math.max(0, attackPower - totalDefense))
    : null;

  const step = combat?.step ?? null;
  const stepLabel = step ? STEP_LABELS[step] : null;
  // Some persisted/fixture combat states retain the engine's first-link
  // counter while also carrying projected resolved links. History tabs must
  // remain ordered and uniquely addressable even when that counter is stale.
  const activeLinkIndex = Math.max(combat?.chainLinkNumber ?? 0, resolvedLinks.length + 1);

  let summary: string;
  if (!attacker) {
    summary = "Combat chain open";
  } else if (damageResolved) {
    summary = didHit
      ? `${attacker.entity.title} hit for damage`
      : `${attacker.entity.title} did not hit`;
  } else if (defenders.length === 0) {
    summary = `${attacker.entity.title} · ${attackPower} power · undefended`;
  } else {
    summary = `${attacker.entity.title} ${attackPower} vs Σ ${totalDefense} defense → ${projectedDamage} damage`;
  }

  const activeHistoryEntry: FabCombatResolvedLinkView | null = attacker
    ? {
        index: activeLinkIndex,
        attackInstanceId: attacker.entity.id,
        attacker,
        attackName: attacker.entity.title,
        attackTargets,
        defenders,
        reactions,
        attackPower,
        totalDefense,
        damage: resolvedDamage ?? projectedDamage ?? 0,
        damageResolved,
        didHit,
        blocked: damageResolved && !didHit,
        outcomeLabel: damageResolved
          ? didHit
            ? `${resolvedDamage ?? 0} damage`
            : "Blocked"
          : `${projectedDamage ?? 0} / ${totalDefense}`,
        summary: damageResolved
          ? `Link ${activeLinkIndex} · ${attacker.entity.title} · ${didHit ? `${resolvedDamage ?? 0} damage` : "Blocked"}`
          : `Link ${activeLinkIndex} · ${attacker.entity.title} · Active`,
        // During the next attack's Layer Step the engine intentionally retains
        // the prior active link until the new attack resolves. Present that
        // prior link as complete so the pending attack owns the current link UI.
        active: pendingAttack === null,
      }
    : null;

  const linkHistory = activeHistoryEntry ? [...resolvedLinks, activeHistoryEntry] : resolvedLinks;
  const heroTarget = attackTargets.find((target) => target.kind === "hero");
  const defendingHeroId = findHeroId(
    state,
    heroTarget?.kind === "hero" ? heroTarget.playerId : null,
  );
  const defendingHeroCard = defendingHeroId ? state.cards[defendingHeroId] : undefined;
  const defendingHero = defendingHeroCard
    ? projectCombatChainCard(
        defendingHeroCard,
        state.cardDefinitions[defendingHeroCard.cardId],
        "other",
      )
    : null;

  return {
    empty: false,
    open: combat?.open ?? true,
    mode: "active-link",
    step,
    stepLabel,
    stepProgress: buildStepProgress(step, "active-link"),
    attacker,
    pendingAttack,
    defenders,
    reactions,
    totalDefense,
    attackPower,
    projectedDamage,
    keywords,
    damageResolved,
    didHit,
    summary,
    resolvedLinks,
    linkHistory,
    stack,
    attackingPlayerId: attackingPlayerId ?? attacker?.entity.ownerId ?? null,
    defendingPlayerId,
    defendingHeroId,
    defendingHero,
    attackTargets,
    priorityPlayerId,
    actionHint:
      step === "resolution"
        ? "The turn-player may play another attack. Combat closes after all players pass."
        : "Pass Priority",
  };
}
