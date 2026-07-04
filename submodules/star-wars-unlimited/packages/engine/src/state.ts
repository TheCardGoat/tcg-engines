import { allCards, getCard } from "@tcg/star-wars-unlimited-cards";
import type {
  SwuAbility,
  SwuCardDefinition,
  SwuComparison,
  SwuCondition,
  SwuController,
  SwuEffect,
  SwuKeyword,
  SwuTarget,
} from "@tcg/star-wars-unlimited-types";
import type { MatchState, PlayerId, RuntimeCard, RuntimePlayer } from "./types.ts";

export interface DeckConfig {
  readonly baseId: string;
  readonly leaderId: string;
  readonly deckIds: readonly string[];
}

export interface CreateMatchOptions {
  readonly id: string;
  readonly players: Record<PlayerId, { readonly name: string; readonly deck: DeckConfig }>;
  readonly firstPlayer?: PlayerId;
}

function createRuntimeCard(
  definition: SwuCardDefinition,
  owner: PlayerId,
  zone: RuntimeCard["zone"],
  index: number,
  overrides: Partial<Omit<RuntimeCard, "instanceId" | "definitionId" | "owner">> = {},
): RuntimeCard {
  return {
    instanceId: `${owner}-${index}`,
    definitionId: definition.id,
    owner,
    controller: owner,
    zone,
    exhausted: false,
    playedThisPhase: false,
    damage: 0,
    experience: 0,
    shield: 0,
    upgrades: [],
    capturedCards: [],
    temporaryPower: 0,
    temporaryHp: 0,
    keywords: [...(definition.keywords ?? [])],
    traits: [...(definition.traits ?? [])],
    ...overrides,
  };
}

function createPlayer(
  id: PlayerId,
  name: string,
  deck: DeckConfig,
  firstPlayer: PlayerId,
): RuntimePlayer {
  return {
    id,
    name,
    baseId: deck.baseId,
    leaderId: deck.leaderId,
    resources: 0,
    readyResources: 0,
    hasInitiative: id === firstPlayer,
    passed: false,
    force: 0,
    credits: 0,
    advantage: 0,
  };
}

export function createInitialState(options: CreateMatchOptions): MatchState {
  const firstPlayer = options.firstPlayer ?? "player-one";
  const definitions = Object.fromEntries(allCards.map((card) => [card.id, card])) as Record<
    string,
    SwuCardDefinition
  >;
  const cards: Record<string, RuntimeCard> = {};
  let nextInstanceNumber = 1;

  for (const playerId of ["player-one", "player-two"] as const) {
    const deck = options.players[playerId].deck;
    for (const [definitionId, zone] of [
      [deck.baseId, "base"],
      [deck.leaderId, "leader"],
      ...deck.deckIds.map((id) => [id, "deck"] as const),
    ] as const) {
      const definition = definitions[definitionId] ?? getCard(definitionId);
      const card = createRuntimeCard(definition, playerId, zone, nextInstanceNumber++);
      cards[card.instanceId] = card;
    }
  }

  return {
    id: options.id,
    cards,
    definitions,
    players: {
      "player-one": createPlayer(
        "player-one",
        options.players["player-one"].name,
        options.players["player-one"].deck,
        firstPlayer,
      ),
      "player-two": createPlayer(
        "player-two",
        options.players["player-two"].name,
        options.players["player-two"].deck,
        firstPlayer,
      ),
    },
    activePlayer: firstPlayer,
    phase: "setup",
    pendingChoices: [],
    delayedEffects: [],
    moveLog: [],
    phaseHistory: {
      unitsDefeatedByController: {
        "player-one": 0,
        "player-two": 0,
      },
    },
    nextInstanceNumber,
    nextChoiceNumber: 1,
    nextLogNumber: 1,
  };
}

export function registerDefinition(
  state: MatchState,
  definition: SwuCardDefinition,
): SwuCardDefinition {
  state.definitions[definition.id] = definition;
  return definition;
}

export function addCardToState(
  state: MatchState,
  definition: SwuCardDefinition | string,
  owner: PlayerId,
  zone: RuntimeCard["zone"],
  overrides: Partial<Omit<RuntimeCard, "instanceId" | "definitionId" | "owner">> = {},
): RuntimeCard {
  const resolvedDefinition =
    typeof definition === "string"
      ? (state.definitions[definition] ?? getCard(definition))
      : registerDefinition(state, definition);
  if (!state.definitions[resolvedDefinition.id]) {
    state.definitions[resolvedDefinition.id] = resolvedDefinition;
  }
  const card = createRuntimeCard(
    resolvedDefinition,
    owner,
    zone,
    state.nextInstanceNumber++,
    overrides,
  );
  state.cards[card.instanceId] = card;
  return card;
}

export function moveCardToZone(state: MatchState, cardId: string, zone: RuntimeCard["zone"]): void {
  const card = state.cards[cardId];
  if (!card) throw new Error(`Missing runtime card: ${cardId}`);
  const previousZone = card.zone;
  const previousExhausted = card.exhausted;
  const definition = getDefinition(state, card.instanceId);
  const wasDefeatedUnit =
    (previousZone === "groundArena" || previousZone === "spaceArena") &&
    (zone === "discard" || zone === "capture") &&
    (definition.cardType === "unit" || definition.cardType === "token");
  const shouldCollectBounty = wasDefeatedUnit && hasPrintedBountyAbility(definition);
  card.zone = zone;
  if (wasDefeatedUnit) {
    state.phaseHistory.unitsDefeatedByController[card.controller] += 1;
  }
  if (previousZone === "resource" && zone !== "resource") {
    state.players[card.controller].resources = Math.max(
      0,
      state.players[card.controller].resources - 1,
    );
    if (!previousExhausted) {
      state.players[card.controller].readyResources = Math.max(
        0,
        state.players[card.controller].readyResources - 1,
      );
    }
  } else if (previousZone !== "resource" && zone === "resource") {
    state.players[card.controller].resources += 1;
  }
  if (zone === "discard" || zone === "deck" || zone === "hand" || zone === "resource") {
    card.exhausted = false;
    card.temporaryPower = 0;
    card.temporaryHp = 0;
  }
  if (shouldCollectBounty) collectBounty(state, card);
}

export function opponentOf(playerId: PlayerId): PlayerId {
  return playerId === "player-one" ? "player-two" : "player-one";
}

export function getDefinition(state: MatchState, instanceId: string): SwuCardDefinition {
  const card = state.cards[instanceId];
  if (!card) throw new Error(`Missing runtime card: ${instanceId}`);
  const definition = state.definitions[card.definitionId];
  if (!definition) throw new Error(`Missing card definition: ${card.definitionId}`);
  return definition;
}

function controlledUnitCount(state: MatchState, playerId: PlayerId): number {
  return Object.values(state.cards).filter((card) => {
    const definition = state.definitions[card.definitionId];
    return (
      card.controller === playerId &&
      (card.zone === "groundArena" || card.zone === "spaceArena") &&
      definition?.cardType === "unit"
    );
  }).length;
}

function hasActiveCoordinate(state: MatchState, card: RuntimeCard): boolean {
  return card.keywords.includes("coordinate") && controlledUnitCount(state, card.controller) >= 3;
}

function coordinateStatBonus(definition: SwuCardDefinition): {
  readonly power: number;
  readonly hp: number;
} {
  const match = definition.text?.match(/Coordinate\s+—\s+This unit gets\s+([+−-]\d+)\/([+−-]\d+)/i);
  if (!match) return { power: 0, hp: 0 };
  const parseModifier = (value: string) => Number.parseInt(value.replace("−", "-"), 10);
  return { power: parseModifier(match[1]), hp: parseModifier(match[2]) };
}

function coordinateGrantedKeywords(definition: SwuCardDefinition): SwuKeyword[] {
  const text = definition.text ?? "";
  const keywords: SwuKeyword[] = [];
  for (const keyword of [
    "ambush",
    "grit",
    "overwhelm",
    "raid",
    "restore",
    "saboteur",
    "sentinel",
  ] as const) {
    if (new RegExp(`Coordinate\\s+—\\s+${keyword}\\b`, "i").test(text)) keywords.push(keyword);
  }
  return keywords;
}

function grantedKeywordsFromText(text: string | null | undefined, prefix: string): SwuKeyword[] {
  const keywords: SwuKeyword[] = [];
  for (const keyword of [
    "ambush",
    "grit",
    "overwhelm",
    "raid",
    "restore",
    "saboteur",
    "sentinel",
    "shielded",
  ] as const) {
    if (new RegExp(`${prefix}\\s+${keyword}\\b`, "i").test(text ?? "")) keywords.push(keyword);
  }
  return keywords;
}

function compareConditionValue(value: number, comparison: SwuComparison): boolean {
  switch (comparison.operator) {
    case "eq":
      return value === comparison.value;
    case "gt":
      return value > comparison.value;
    case "gte":
      return value >= comparison.value;
    case "lt":
      return value < comparison.value;
    case "lte":
      return value <= comparison.value;
  }
}

function constantConditionMet(
  state: MatchState,
  card: RuntimeCard,
  condition: SwuCondition,
): boolean {
  switch (condition.type) {
    case "always":
      return true;
    case "attackDefender":
      return false;
    case "hasInitiative": {
      const playerId =
        condition.controller === "opponent" ? opponentOf(card.controller) : card.controller;
      return state.players[playerId].hasInitiative;
    }
    case "resources": {
      const playerId =
        condition.controller === "opponent" ? opponentOf(card.controller) : card.controller;
      return compareConditionValue(state.players[playerId].resources, condition.comparison);
    }
    case "baseDamage": {
      const playerId =
        condition.controller === "opponent" ? opponentOf(card.controller) : card.controller;
      const base = Object.values(state.cards).find(
        (candidate) => candidate.controller === playerId && candidate.zone === "base",
      );
      return compareConditionValue(base?.damage ?? 0, condition.comparison);
    }
    case "controlsAspect": {
      const playerId =
        condition.controller === "opponent" ? opponentOf(card.controller) : card.controller;
      return Object.values(state.cards).some((candidate) => {
        const definition = state.definitions[candidate.definitionId];
        return (
          candidate.controller === playerId &&
          (!condition.excludeSelf || candidate.instanceId !== card.instanceId) &&
          (candidate.zone === "groundArena" || candidate.zone === "spaceArena") &&
          (definition.aspects ?? []).includes(condition.aspect)
        );
      });
    }
    case "controlsTrait": {
      const playerId =
        condition.controller === "opponent" ? opponentOf(card.controller) : card.controller;
      return compareConditionValue(
        Object.values(state.cards).filter(
          (candidate) =>
            candidate.controller === playerId &&
            (!condition.excludeSelf || candidate.instanceId !== card.instanceId) &&
            (candidate.zone === "groundArena" || candidate.zone === "spaceArena") &&
            hasTrait(candidate, condition.trait),
        ).length,
        condition.comparison ?? { operator: "gte", value: 1 },
      );
    }
    case "controlsMoreUnits": {
      const playerId =
        condition.controller === "opponent" ? opponentOf(card.controller) : card.controller;
      const otherPlayerId = opponentOf(playerId);
      const countUnits = (controller: string) =>
        Object.values(state.cards).filter((candidate) => {
          const definition = state.definitions[candidate.definitionId];
          return (
            candidate.controller === controller &&
            (candidate.zone === "groundArena" || candidate.zone === "spaceArena") &&
            definition?.cardType === "unit" &&
            (!condition.arena || definition.arena === condition.arena)
          );
        }).length;
      return countUnits(playerId) > countUnits(otherPlayerId);
    }
    case "sourceIsUpgraded":
      return card.upgrades.length > 0;
    case "sourceIsDamaged":
      return card.damage > 0;
    case "unitsDefeatedThisPhase": {
      const playerId =
        condition.controller === "opponent" ? opponentOf(card.controller) : card.controller;
      const count =
        condition.controller === "any"
          ? state.phaseHistory.unitsDefeatedByController["player-one"] +
            state.phaseHistory.unitsDefeatedByController["player-two"]
          : state.phaseHistory.unitsDefeatedByController[playerId];
      return compareConditionValue(count, condition.comparison);
    }
    case "cardsInHand":
    case "hasKeyword":
    case "sourceIsAttacking":
    case "sourceIsDefending":
      return false;
    case "hasTarget":
      return Object.values(state.cards).some((candidate) =>
        constantTargetMatchesCard(state, condition.target, card, candidate),
      );
  }
}

function isSelfEffect(effect: SwuEffect): boolean {
  return "target" in effect && effect.target.type === "self";
}

function isConstantSourceActive(card: RuntimeCard): boolean {
  return (
    card.zone === "base" ||
    card.zone === "leader" ||
    card.zone === "groundArena" ||
    card.zone === "spaceArena"
  );
}

function constantControllerMatches(
  candidate: RuntimeCard,
  controller: SwuController | undefined,
  sourcePlayerId: PlayerId,
): boolean {
  if (!controller || controller === "any") return true;
  if (controller === "friendly") return candidate.controller === sourcePlayerId;
  return candidate.controller === opponentOf(sourcePlayerId);
}

function constantTargetMatchesCard(
  state: MatchState,
  target: SwuTarget,
  source: RuntimeCard,
  candidate: RuntimeCard,
): boolean {
  if (target.type === "self") return source.instanceId === candidate.instanceId;
  if (target.type === "attachedUnit") return candidate.upgrades.includes(source.instanceId);
  if (target.type === "base") {
    const definition = getDefinition(state, candidate.instanceId);
    return (
      definition.cardType === "base" &&
      constantControllerMatches(candidate, target.controller, source.controller)
    );
  }
  if (target.type !== "card") return false;
  if (!constantControllerMatches(candidate, target.controller, source.controller)) return false;
  if (target.excludeSelf && candidate.instanceId === source.instanceId) return false;
  if (target.zones && !target.zones.includes(candidate.zone)) return false;
  if (candidate.exhausted !== (target.exhausted ?? candidate.exhausted)) return false;
  if (
    target.damaged !== undefined &&
    (target.damaged ? candidate.damage === 0 : candidate.damage > 0)
  ) {
    return false;
  }
  const definition = getDefinition(state, candidate.instanceId);
  return (
    (!target.ids || target.ids.includes(definition.id)) &&
    (!target.cardTypes || target.cardTypes.includes(definition.cardType)) &&
    (!target.aspects ||
      target.aspects.some((aspect) => (definition.aspects ?? []).includes(aspect))) &&
    (!target.arena || definition.arena === target.arena) &&
    (!target.traits || target.traits.some((trait) => hasTrait(candidate, trait))) &&
    (!target.withoutTraits || target.withoutTraits.every((trait) => !hasTrait(candidate, trait))) &&
    (!target.keywords || target.keywords.some((keyword) => candidate.keywords.includes(keyword))) &&
    (target.unique === undefined || definition.unique === target.unique) &&
    (!target.cost || compareConditionValue(definition.cost ?? 0, target.cost)) &&
    (!target.power ||
      compareConditionValue(
        (definition.power ?? 0) + candidate.experience + candidate.temporaryPower,
        target.power,
      )) &&
    (!target.hp ||
      compareConditionValue(
        (definition.hp ?? 0) + candidate.experience + candidate.temporaryHp,
        target.hp,
      ))
  );
}

function constantEffectAppliesToCard(
  state: MatchState,
  effect: SwuEffect,
  source: RuntimeCard,
  candidate: RuntimeCard,
): boolean {
  return (
    (effect.type === "modifyStats" ||
      effect.type === "modifyStatsPer" ||
      effect.type === "gainKeyword" ||
      effect.type === "gainTrait" ||
      effect.type === "restrictAttack" ||
      effect.type === "combatDamageFirst" ||
      effect.type === "preventDamage" ||
      effect.type === "loseHealing") &&
    constantTargetMatchesCard(state, effect.target, source, candidate)
  );
}

function statMultiplierForEffect(
  state: MatchState,
  card: RuntimeCard,
  source: RuntimeCard,
  effect: Extract<SwuEffect, { type: "modifyStatsPer" }>,
): number {
  if (effect.per === "damageOnTarget") return card.damage;
  if (effect.per === "friendlyResources") return state.players[card.controller].resources;
  if (effect.per === "targetCount") {
    return Object.values(state.cards).filter((candidate) =>
      constantTargetMatchesCard(state, effect.count, source, candidate),
    ).length;
  }
  return 0;
}

function hasTrait(card: RuntimeCard, trait: string): boolean {
  return card.traits.some((candidate) => candidate.toLowerCase() === trait.toLowerCase());
}

interface ActiveConstantEffect {
  readonly effect: SwuEffect;
  readonly source: RuntimeCard;
}

function activeConstantEffects(state: MatchState, card: RuntimeCard): ActiveConstantEffect[] {
  return Object.values(state.cards).flatMap((source) => {
    if (!isConstantSourceActive(source)) return [];
    const definition = getDefinition(state, source.instanceId);
    return (definition.abilities ?? []).flatMap((ability: SwuAbility) => {
      if (ability.kind !== "constant") return [];
      if (
        ability.conditions &&
        !ability.conditions.every((condition) => constantConditionMet(state, source, condition))
      ) {
        return [];
      }
      return (ability.effects ?? [])
        .filter(
          (effect) =>
            (source.instanceId === card.instanceId || !isSelfEffect(effect)) &&
            constantEffectAppliesToCard(state, effect, source, card),
        )
        .map((effect) => ({ effect, source }));
    });
  });
}

function attachedUpgradeStatBonus(
  state: MatchState,
  card: RuntimeCard,
): { readonly power: number; readonly hp: number } {
  return card.upgrades.reduce(
    (total, upgradeId) => {
      const upgrade = state.cards[upgradeId];
      const definition = upgrade ? state.definitions[upgrade.definitionId] : undefined;
      return {
        power: total.power + (definition?.upgradePower ?? 0),
        hp: total.hp + (definition?.upgradeHp ?? 0),
      };
    },
    { power: 0, hp: 0 },
  );
}

export function effectiveKeywords(state: MatchState, card: RuntimeCard): SwuKeyword[] {
  const printedKeywords = card.keywords as SwuKeyword[];
  const definition = getDefinition(state, card.instanceId);
  const attachedKeywords = card.upgrades.flatMap((upgradeId) => {
    const upgrade = state.cards[upgradeId];
    if (!upgrade) return [];
    const upgradeDefinition = state.definitions[upgrade.definitionId];
    return [
      ...grantedKeywordsFromText(upgradeDefinition?.text, "Attached unit gains"),
      ...grantedKeywordsFromText(upgradeDefinition?.pilotText, "Attached unit gains"),
    ];
  });
  const coordinateKeywords = hasActiveCoordinate(state, card)
    ? coordinateGrantedKeywords(definition)
    : [];
  const constantKeywords = activeConstantEffects(state, card)
    .filter(
      (
        active,
      ): active is ActiveConstantEffect & {
        readonly effect: Extract<SwuEffect, { type: "gainKeyword" }>;
      } => active.effect.type === "gainKeyword",
    )
    .map((active) => active.effect.keyword);
  return Array.from(
    new Set<SwuKeyword>([
      ...printedKeywords,
      ...attachedKeywords,
      ...coordinateKeywords,
      ...constantKeywords,
    ]),
  );
}

export function effectiveTraits(state: MatchState, card: RuntimeCard): string[] {
  const constantTraits = activeConstantEffects(state, card)
    .filter(
      (
        active,
      ): active is ActiveConstantEffect & {
        readonly effect: Extract<SwuEffect, { type: "gainTrait" }>;
      } => active.effect.type === "gainTrait",
    )
    .map((active) => active.effect.trait);
  const traits = [...card.traits, ...constantTraits];
  return traits.filter(
    (trait, index) =>
      traits.findIndex((candidate) => candidate.toLowerCase() === trait.toLowerCase()) === index,
  );
}

export function effectiveAttackRestrictions(
  state: MatchState,
  card: RuntimeCard,
): Extract<SwuEffect, { type: "restrictAttack" }>["restriction"][] {
  return activeConstantEffects(state, card)
    .filter(
      (
        active,
      ): active is ActiveConstantEffect & {
        readonly effect: Extract<SwuEffect, { type: "restrictAttack" }>;
      } => active.effect.type === "restrictAttack",
    )
    .map((active) => active.effect.restriction);
}

export function dealsCombatDamageFirst(state: MatchState, card: RuntimeCard): boolean {
  return activeConstantEffects(state, card).some(
    (
      active,
    ): active is ActiveConstantEffect & {
      readonly effect: Extract<SwuEffect, { type: "combatDamageFirst" }>;
    } => active.effect.type === "combatDamageFirst",
  );
}

export function canBeHealed(state: MatchState, card: RuntimeCard): boolean {
  return !activeConstantEffects(state, card).some(
    (
      active,
    ): active is ActiveConstantEffect & {
      readonly effect: Extract<SwuEffect, { type: "loseHealing" }>;
    } => active.effect.type === "loseHealing",
  );
}

export function consumeDamagePrevention(state: MatchState, card: RuntimeCard): boolean {
  const active = Object.values(state.cards).flatMap((source) => {
    if (!isConstantSourceActive(source)) return [];
    const definition = getDefinition(state, source.instanceId);
    return (definition.abilities ?? []).flatMap((ability: SwuAbility) => {
      if (ability.kind !== "replacement") return [];
      if (
        ability.conditions &&
        !ability.conditions.every((condition) => constantConditionMet(state, source, condition))
      ) {
        return [];
      }
      return (ability.effects ?? [])
        .filter(
          (effect): effect is Extract<SwuEffect, { type: "preventDamage" }> =>
            effect.type === "preventDamage" &&
            constantTargetMatchesCard(state, effect.target, source, card),
        )
        .map((effect) => ({ effect, source }));
    });
  })[0];
  if (!active) return false;
  for (const candidate of Object.values(state.cards)) {
    candidate.upgrades = candidate.upgrades.filter(
      (upgradeId) => upgradeId !== active.source.instanceId,
    );
  }
  moveCardToZone(state, active.source.instanceId, "discard");
  return true;
}

function hasPrintedBountyAbility(definition: SwuCardDefinition): boolean {
  return /(?:^|\n|["“])\s*Bounty\s+[—-]/i.test(definition.text ?? "");
}

function drawForBountyCollector(state: MatchState, playerId: PlayerId, amount: number): void {
  for (const card of Object.values(state.cards)
    .filter((candidate) => candidate.owner === playerId && candidate.zone === "deck")
    .slice(0, amount)) {
    moveCardToZone(state, card.instanceId, "hand");
  }
}

function resourceForBountyCollector(state: MatchState, playerId: PlayerId): void {
  const card = Object.values(state.cards).find(
    (candidate) => candidate.owner === playerId && candidate.zone === "deck",
  );
  if (!card) return;
  moveCardToZone(state, card.instanceId, "resource");
  card.exhausted = true;
}

function collectBounty(state: MatchState, defeatedCard: RuntimeCard): void {
  const collector = opponentOf(defeatedCard.controller);
  const definition = getDefinition(state, defeatedCard.instanceId);
  const text = definition.text ?? "";
  if (/Bounty\s+[—-]\s+Draw 2 cards/i.test(text)) drawForBountyCollector(state, collector, 2);
  else if (/Bounty\s+[—-]\s+Draw a card/i.test(text)) drawForBountyCollector(state, collector, 1);
  else if (/Bounty\s+[—-]\s+Put the top card of your deck into play as a resource/i.test(text)) {
    resourceForBountyCollector(state, collector);
  }
  logMove(state, {
    playerId: collector,
    type: "framework.bounty.collect",
    message: `${definition.title} bounty was collected.`,
    public: true,
  });
}

export function effectivePower(state: MatchState, card: RuntimeCard): number {
  const definition = getDefinition(state, card.instanceId);
  const upgradeBonus = attachedUpgradeStatBonus(state, card);
  const coordinateBonus = hasActiveCoordinate(state, card)
    ? coordinateStatBonus(definition).power
    : 0;
  const constantPower = activeConstantEffects(state, card).reduce(
    (total, { effect, source }) =>
      total +
      (effect.type === "modifyStats"
        ? (effect.power ?? 0)
        : effect.type === "modifyStatsPer"
          ? (effect.power ?? 0) * statMultiplierForEffect(state, card, source, effect)
          : 0),
    0,
  );
  const gritPower = effectiveKeywords(state, card).includes("grit") ? card.damage : 0;
  return Math.max(
    0,
    (definition.power ?? 0) +
      card.experience +
      card.temporaryPower +
      upgradeBonus.power +
      coordinateBonus +
      constantPower +
      gritPower,
  );
}

export function effectiveHp(state: MatchState, card: RuntimeCard): number {
  const definition = getDefinition(state, card.instanceId);
  const upgradeBonus = attachedUpgradeStatBonus(state, card);
  const coordinateBonus = hasActiveCoordinate(state, card) ? coordinateStatBonus(definition).hp : 0;
  const constantHp = activeConstantEffects(state, card).reduce(
    (total, { effect, source }) =>
      total +
      (effect.type === "modifyStats"
        ? (effect.hp ?? 0)
        : effect.type === "modifyStatsPer"
          ? (effect.hp ?? 0) * statMultiplierForEffect(state, card, source, effect)
          : 0),
    0,
  );
  return Math.max(
    0,
    (definition.hp ?? 0) +
      card.experience +
      card.temporaryHp +
      upgradeBonus.hp +
      coordinateBonus +
      constantHp,
  );
}

export function logMove(
  state: MatchState,
  entry: Omit<MatchState["moveLog"][number], "sequence">,
): void {
  state.moveLog.push({ ...entry, sequence: state.nextLogNumber++ });
}
