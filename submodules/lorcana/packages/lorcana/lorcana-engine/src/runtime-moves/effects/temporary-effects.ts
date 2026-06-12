import type { PlayerId } from "#core";
import type {
  LorcanaCardMeta,
  TemporaryGrantedAbilityPayload,
  TemporaryKeywordPayload,
  TemporaryPlayerRestrictionPayload,
  TemporaryRestrictionPayload,
  TemporaryPlayerRestrictionsState,
} from "../../types";

import {
  isEffectExpired,
  resolveEffectWindow,
  type EffectDuration,
} from "../../rules/effect-registry";

function normalizeEffectMap(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }

  const normalized: Record<string, number> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof key !== "string" || key.length === 0) {
      continue;
    }
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
      continue;
    }
    normalized[key] = Math.floor(value);
  }

  return normalized;
}

function normalizeValueMap(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }

  const normalized: Record<string, number> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof key !== "string" || key.length === 0) {
      continue;
    }
    if (typeof value !== "number" || !Number.isFinite(value)) {
      continue;
    }
    normalized[key] = value;
  }

  return normalized;
}

function normalizePayloadMap(raw: unknown): Record<string, TemporaryGrantedAbilityPayload> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }

  const normalized: Record<string, TemporaryGrantedAbilityPayload> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (
      typeof key !== "string" ||
      key.length === 0 ||
      !value ||
      typeof value !== "object" ||
      Array.isArray(value)
    ) {
      continue;
    }

    const payload = value as Record<string, unknown>;
    if (typeof payload.type !== "string" || payload.type.trim().length === 0) {
      continue;
    }

    normalized[key] = payload as TemporaryGrantedAbilityPayload;
  }

  return normalized;
}

function normalizeKeywordPayloadMap(raw: unknown): Record<string, TemporaryKeywordPayload> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }

  const normalized: Record<string, TemporaryKeywordPayload> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (
      typeof key !== "string" ||
      key.length === 0 ||
      !value ||
      typeof value !== "object" ||
      Array.isArray(value)
    ) {
      continue;
    }

    const payload = value as Record<string, unknown>;
    if (typeof payload.type !== "string" || payload.type.trim().length === 0) {
      continue;
    }

    normalized[key] = payload as unknown as TemporaryKeywordPayload;
  }

  return normalized;
}

function normalizeRestrictionPayloadMap(raw: unknown): Record<string, TemporaryRestrictionPayload> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }

  const normalized: Record<string, TemporaryRestrictionPayload> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (
      typeof key !== "string" ||
      key.length === 0 ||
      !value ||
      typeof value !== "object" ||
      Array.isArray(value)
    ) {
      continue;
    }

    const payload = value as Record<string, unknown>;
    if (typeof payload.type !== "string" || payload.type.trim().length === 0) {
      continue;
    }

    normalized[key] = payload as unknown as TemporaryRestrictionPayload;
  }

  return normalized;
}

function normalizePlayerRestrictionPayloadMap(
  raw: unknown,
): Record<string, TemporaryPlayerRestrictionPayload> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }

  const normalized: Record<string, TemporaryPlayerRestrictionPayload> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (
      typeof key !== "string" ||
      key.length === 0 ||
      !value ||
      typeof value !== "object" ||
      Array.isArray(value)
    ) {
      continue;
    }

    const payload = value as Record<string, unknown>;
    if (typeof payload.type !== "string" || payload.type.trim().length === 0) {
      continue;
    }

    normalized[key] = payload as unknown as TemporaryPlayerRestrictionPayload;
  }

  return normalized;
}

function normalizeTemporaryKey(raw: unknown): string | undefined {
  if (typeof raw !== "string") {
    return undefined;
  }

  const normalized = raw.trim();
  return normalized.length > 0 ? normalized : undefined;
}

export function resolveTemporaryEffectWindow(
  currentTurn: number,
  duration: unknown,
  options?: {
    currentPlayerId?: PlayerId;
    targetOwnerId?: PlayerId;
  },
): { startsAtTurn: number; expiresAtTurn: number } {
  return resolveEffectWindow(currentTurn, duration, options);
}

export function resolveTemporaryEffectExpiryTurn(
  currentTurn: number,
  duration: unknown,
  options?: {
    currentPlayerId?: PlayerId;
    targetOwnerId?: PlayerId;
  },
): number {
  return resolveTemporaryEffectWindow(currentTurn, duration, options).expiresAtTurn;
}

export function addTemporaryKeyword(
  meta: LorcanaCardMeta,
  keyword: string,
  expiresAtTurn: number,
  value?: number,
  startsAtTurn?: number,
  payload?: TemporaryKeywordPayload,
): LorcanaCardMeta {
  const normalizedKeyword = normalizeTemporaryKey(keyword);
  if (!normalizedKeyword) {
    return meta;
  }

  if (!Number.isFinite(expiresAtTurn) || expiresAtTurn < 1) {
    return meta;
  }

  const normalizedStartsAtTurn =
    typeof startsAtTurn === "number" && Number.isFinite(startsAtTurn) && startsAtTurn >= 1
      ? Math.floor(startsAtTurn)
      : 1;
  const normalizedExpiresAtTurn = Math.floor(expiresAtTurn);
  if (normalizedStartsAtTurn > normalizedExpiresAtTurn) {
    return meta;
  }

  const keywordMap = normalizeEffectMap(meta.temporaryKeywords);
  const keywordStarts = normalizeEffectMap(meta.temporaryKeywordStarts);
  const currentExpiry = keywordMap[normalizedKeyword] ?? 0;
  if (normalizedExpiresAtTurn > currentExpiry) {
    keywordMap[normalizedKeyword] = normalizedExpiresAtTurn;
    keywordStarts[normalizedKeyword] = normalizedStartsAtTurn;
  } else if (normalizedExpiresAtTurn === currentExpiry) {
    keywordStarts[normalizedKeyword] = Math.min(
      keywordStarts[normalizedKeyword] ?? normalizedStartsAtTurn,
      normalizedStartsAtTurn,
    );
  }

  const keywordValues = normalizeValueMap(meta.temporaryKeywordValues);
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    keywordValues[normalizedKeyword] = (keywordValues[normalizedKeyword] ?? 0) + value;
  }

  const keywordPayloads = normalizeKeywordPayloadMap(meta.temporaryKeywordPayloads);
  if (payload && typeof payload.type === "string" && payload.type.trim().length > 0) {
    keywordPayloads[normalizedKeyword] = payload;
  }

  return {
    ...meta,
    temporaryKeywords: keywordMap,
    temporaryKeywordStarts: Object.keys(keywordStarts).length > 0 ? keywordStarts : undefined,
    temporaryKeywordValues: Object.keys(keywordValues).length > 0 ? keywordValues : undefined,
    temporaryKeywordPayloads: Object.keys(keywordPayloads).length > 0 ? keywordPayloads : undefined,
  };
}

export function addTemporaryLostKeyword(
  meta: LorcanaCardMeta,
  keyword: string,
  expiresAtTurn: number,
  startsAtTurn?: number,
): LorcanaCardMeta {
  const normalizedKeyword = normalizeTemporaryKey(keyword);
  if (!normalizedKeyword) {
    return meta;
  }

  if (!Number.isFinite(expiresAtTurn) || expiresAtTurn < 1) {
    return meta;
  }

  const normalizedStartsAtTurn =
    typeof startsAtTurn === "number" && Number.isFinite(startsAtTurn) && startsAtTurn >= 1
      ? Math.floor(startsAtTurn)
      : 1;
  const normalizedExpiresAtTurn = Math.floor(expiresAtTurn);
  if (normalizedStartsAtTurn > normalizedExpiresAtTurn) {
    return meta;
  }

  const lostKeywordMap = normalizeEffectMap(meta.temporaryLostKeywords);
  const lostKeywordStarts = normalizeEffectMap(meta.temporaryLostKeywordStarts);
  const currentExpiry = lostKeywordMap[normalizedKeyword] ?? 0;
  if (normalizedExpiresAtTurn > currentExpiry) {
    lostKeywordMap[normalizedKeyword] = normalizedExpiresAtTurn;
    lostKeywordStarts[normalizedKeyword] = normalizedStartsAtTurn;
  } else if (normalizedExpiresAtTurn === currentExpiry) {
    lostKeywordStarts[normalizedKeyword] = Math.min(
      lostKeywordStarts[normalizedKeyword] ?? normalizedStartsAtTurn,
      normalizedStartsAtTurn,
    );
  }

  return {
    ...meta,
    temporaryLostKeywords: Object.keys(lostKeywordMap).length > 0 ? lostKeywordMap : undefined,
    temporaryLostKeywordStarts:
      Object.keys(lostKeywordStarts).length > 0 ? lostKeywordStarts : undefined,
  };
}

export function hasTemporaryLostKeyword(
  meta: LorcanaCardMeta | undefined,
  currentTurn: number,
  keyword: string,
): boolean {
  if (!meta) {
    return false;
  }

  const normalizedKeyword = normalizeTemporaryKey(keyword);
  if (!normalizedKeyword) {
    return false;
  }

  const lostKeywordMap = normalizeEffectMap(meta.temporaryLostKeywords);
  const lostKeywordStarts = normalizeEffectMap(meta.temporaryLostKeywordStarts);
  const expiryTurn = lostKeywordMap[normalizedKeyword] ?? 0;
  const startTurn = lostKeywordStarts[normalizedKeyword] ?? 1;
  return currentTurn >= startTurn && currentTurn <= expiryTurn;
}

export function addTemporaryClassification(
  meta: LorcanaCardMeta,
  classification: string,
  expiresAtTurn: number,
  startsAtTurn?: number,
): LorcanaCardMeta {
  const normalizedClassification = classification.trim();
  if (!normalizedClassification) {
    return meta;
  }

  if (!Number.isFinite(expiresAtTurn) || expiresAtTurn < 1) {
    return meta;
  }

  const normalizedStartsAtTurn =
    typeof startsAtTurn === "number" && Number.isFinite(startsAtTurn) && startsAtTurn >= 1
      ? Math.floor(startsAtTurn)
      : 1;
  const normalizedExpiresAtTurn = Math.floor(expiresAtTurn);
  if (normalizedStartsAtTurn > normalizedExpiresAtTurn) {
    return meta;
  }

  const classificationMap = normalizeEffectMap(meta.temporaryClassifications);
  const classificationStarts = normalizeEffectMap(meta.temporaryClassificationStarts);
  const currentExpiry = classificationMap[normalizedClassification] ?? 0;
  if (normalizedExpiresAtTurn > currentExpiry) {
    classificationMap[normalizedClassification] = normalizedExpiresAtTurn;
    classificationStarts[normalizedClassification] = normalizedStartsAtTurn;
  } else if (normalizedExpiresAtTurn === currentExpiry) {
    classificationStarts[normalizedClassification] = Math.min(
      classificationStarts[normalizedClassification] ?? normalizedStartsAtTurn,
      normalizedStartsAtTurn,
    );
  }

  return {
    ...meta,
    temporaryClassifications:
      Object.keys(classificationMap).length > 0 ? classificationMap : undefined,
    temporaryClassificationStarts:
      Object.keys(classificationStarts).length > 0 ? classificationStarts : undefined,
  };
}

export function hasTemporaryKeyword(
  meta: LorcanaCardMeta | undefined,
  currentTurn: number,
  keyword: string,
  options?: {
    isSourceInPlay?: (sourceId: string) => boolean;
  },
): boolean {
  if (!meta) {
    return false;
  }

  const normalizedKeyword = normalizeTemporaryKey(keyword);
  if (!normalizedKeyword) {
    return false;
  }

  const keywordMap = normalizeEffectMap(meta.temporaryKeywords);
  const keywordStarts = normalizeEffectMap(meta.temporaryKeywordStarts);
  const expiryTurn = keywordMap[normalizedKeyword] ?? 0;
  const startTurn = keywordStarts[normalizedKeyword] ?? 1;
  if (!(currentTurn >= startTurn && currentTurn <= expiryTurn)) {
    return false;
  }

  const payload = normalizeKeywordPayloadMap(meta.temporaryKeywordPayloads)[normalizedKeyword];
  if (payload?.activeWhileSourceInPlay && payload.sourceId && options?.isSourceInPlay) {
    return options.isSourceInPlay(payload.sourceId);
  }

  return true;
}

export function getTemporaryKeywordValue(
  meta: LorcanaCardMeta | undefined,
  currentTurn: number,
  keyword: string,
): number {
  if (!hasTemporaryKeyword(meta, currentTurn, keyword)) {
    return 0;
  }

  const normalizedKeyword = normalizeTemporaryKey(keyword);
  if (!meta || !normalizedKeyword) {
    return 0;
  }

  const values = normalizeValueMap(meta.temporaryKeywordValues);
  const rawValue = values[normalizedKeyword];
  return typeof rawValue === "number" && Number.isFinite(rawValue) ? rawValue : 0;
}

export function addTemporaryAbility(
  meta: LorcanaCardMeta,
  ability: string,
  expiresAtTurn: number,
  startsAtTurn?: number,
  payload?: TemporaryGrantedAbilityPayload,
): LorcanaCardMeta {
  const normalizedAbility = normalizeTemporaryKey(ability);
  if (!normalizedAbility) {
    return meta;
  }

  if (!Number.isFinite(expiresAtTurn) || expiresAtTurn < 1) {
    return meta;
  }

  const normalizedStartsAtTurn =
    typeof startsAtTurn === "number" && Number.isFinite(startsAtTurn) && startsAtTurn >= 1
      ? Math.floor(startsAtTurn)
      : 1;
  const normalizedExpiresAtTurn = Math.floor(expiresAtTurn);
  if (normalizedStartsAtTurn > normalizedExpiresAtTurn) {
    return meta;
  }

  const abilityMap = normalizeEffectMap(meta.temporaryAbilities);
  const abilityStarts = normalizeEffectMap(meta.temporaryAbilityStarts);
  const abilityPayloads = normalizePayloadMap(meta.temporaryAbilityPayloads);
  const currentExpiry = abilityMap[normalizedAbility] ?? 0;
  if (normalizedExpiresAtTurn > currentExpiry) {
    abilityMap[normalizedAbility] = normalizedExpiresAtTurn;
    abilityStarts[normalizedAbility] = normalizedStartsAtTurn;
  } else if (normalizedExpiresAtTurn === currentExpiry) {
    abilityStarts[normalizedAbility] = Math.min(
      abilityStarts[normalizedAbility] ?? normalizedStartsAtTurn,
      normalizedStartsAtTurn,
    );
  }

  if (payload && typeof payload.type === "string" && payload.type.trim().length > 0) {
    abilityPayloads[normalizedAbility] = payload;
  }

  return {
    ...meta,
    temporaryAbilities: abilityMap,
    temporaryAbilityStarts: Object.keys(abilityStarts).length > 0 ? abilityStarts : undefined,
    temporaryAbilityPayloads: Object.keys(abilityPayloads).length > 0 ? abilityPayloads : undefined,
  };
}

export function hasTemporaryAbility(
  meta: LorcanaCardMeta | undefined,
  currentTurn: number,
  ability: string,
): boolean {
  if (!meta) {
    return false;
  }

  const normalizedAbility = normalizeTemporaryKey(ability);
  if (!normalizedAbility) {
    return false;
  }

  const abilityMap = normalizeEffectMap(meta.temporaryAbilities);
  const abilityStarts = normalizeEffectMap(meta.temporaryAbilityStarts);
  const expiryTurn = abilityMap[normalizedAbility] ?? 0;
  const startTurn = abilityStarts[normalizedAbility] ?? 1;
  return currentTurn >= startTurn && currentTurn <= expiryTurn;
}

export function getTemporaryAbilityPayload(
  meta: LorcanaCardMeta | undefined,
  currentTurn: number,
  ability: string,
): TemporaryGrantedAbilityPayload | undefined {
  if (!hasTemporaryAbility(meta, currentTurn, ability)) {
    return undefined;
  }

  const normalizedAbility = normalizeTemporaryKey(ability);
  if (!meta || !normalizedAbility) {
    return undefined;
  }

  return normalizePayloadMap(meta.temporaryAbilityPayloads)[normalizedAbility];
}

export function addTemporaryRestriction(
  meta: LorcanaCardMeta,
  restriction: string,
  expiresAtTurn: number,
  startsAtTurn?: number,
  payload?: TemporaryRestrictionPayload,
): LorcanaCardMeta {
  const normalizedRestriction = normalizeTemporaryKey(restriction);
  if (!normalizedRestriction) {
    return meta;
  }

  if (!Number.isFinite(expiresAtTurn) || expiresAtTurn < 1) {
    return meta;
  }

  const normalizedStartsAtTurn =
    typeof startsAtTurn === "number" && Number.isFinite(startsAtTurn) && startsAtTurn >= 1
      ? Math.floor(startsAtTurn)
      : 1;
  const normalizedExpiresAtTurn = Math.floor(expiresAtTurn);
  if (normalizedStartsAtTurn > normalizedExpiresAtTurn) {
    return meta;
  }

  const restrictionMap = normalizeEffectMap(meta.temporaryRestrictions);
  const restrictionStarts = normalizeEffectMap(meta.temporaryRestrictionStarts);
  const restrictionPayloads = normalizeRestrictionPayloadMap(meta.temporaryRestrictionPayloads);
  const currentExpiry = restrictionMap[normalizedRestriction] ?? 0;
  if (normalizedExpiresAtTurn > currentExpiry) {
    restrictionMap[normalizedRestriction] = normalizedExpiresAtTurn;
    restrictionStarts[normalizedRestriction] = normalizedStartsAtTurn;
  } else if (normalizedExpiresAtTurn === currentExpiry) {
    restrictionStarts[normalizedRestriction] = Math.min(
      restrictionStarts[normalizedRestriction] ?? normalizedStartsAtTurn,
      normalizedStartsAtTurn,
    );
  }

  if (payload && typeof payload.type === "string" && payload.type.trim().length > 0) {
    restrictionPayloads[normalizedRestriction] = payload;
  }

  return {
    ...meta,
    temporaryRestrictions: restrictionMap,
    temporaryRestrictionStarts:
      Object.keys(restrictionStarts).length > 0 ? restrictionStarts : undefined,
    temporaryRestrictionPayloads:
      Object.keys(restrictionPayloads).length > 0 ? restrictionPayloads : undefined,
  };
}

export function hasTemporaryRestriction(
  meta: LorcanaCardMeta | undefined,
  currentTurn: number,
  restriction: string,
  options?: {
    isSourceInPlay?: (sourceId: string) => boolean;
    isCardAtLocation?: boolean;
  },
): boolean {
  if (!meta) {
    return false;
  }

  const normalizedRestriction = normalizeTemporaryKey(restriction);
  if (!normalizedRestriction) {
    return false;
  }

  const restrictionMap = normalizeEffectMap(meta.temporaryRestrictions);
  const restrictionStarts = normalizeEffectMap(meta.temporaryRestrictionStarts);
  const normalizedRestrictionKeys =
    normalizedRestriction === "cant-quest" || normalizedRestriction === "cant-challenge"
      ? [normalizedRestriction, "cant-quest-or-challenge"]
      : [normalizedRestriction];

  const matchedRestriction = normalizedRestrictionKeys.find((candidate) => {
    const expiryTurn = restrictionMap[candidate] ?? 0;
    const startTurn = restrictionStarts[candidate] ?? 1;
    return currentTurn >= startTurn && currentTurn <= expiryTurn;
  });

  if (!matchedRestriction) {
    return false;
  }

  const payload = normalizeRestrictionPayloadMap(meta.temporaryRestrictionPayloads)[
    matchedRestriction
  ];
  if (payload?.activeWhileSourceInPlay && payload.sourceId && options?.isSourceInPlay) {
    return options.isSourceInPlay(payload.sourceId);
  }

  // Evaluate payload condition (e.g., "unless at a location")
  if (payload?.condition && typeof payload.condition === "object") {
    const condition = payload.condition as { type: string; condition?: { type: string } };
    if (condition.type === "not" && condition.condition?.type === "at-location") {
      // Restriction is active only when the card is NOT at a location
      if (options?.isCardAtLocation === true) {
        return false;
      }
    }
  }

  return true;
}

export function pruneExpiredTemporaryEffects(
  meta: LorcanaCardMeta | undefined,
  currentTurn: number,
): LorcanaCardMeta | undefined {
  if (!meta) {
    return meta;
  }

  const temporaryKeywords = normalizeEffectMap(meta.temporaryKeywords);
  const temporaryKeywordStarts = normalizeEffectMap(meta.temporaryKeywordStarts);
  const temporaryKeywordPayloads = normalizeKeywordPayloadMap(meta.temporaryKeywordPayloads);
  const temporaryClassifications = normalizeEffectMap(meta.temporaryClassifications);
  const temporaryClassificationStarts = normalizeEffectMap(meta.temporaryClassificationStarts);
  const temporaryAbilities = normalizeEffectMap(meta.temporaryAbilities);
  const temporaryAbilityStarts = normalizeEffectMap(meta.temporaryAbilityStarts);
  const temporaryAbilityPayloads = normalizePayloadMap(meta.temporaryAbilityPayloads);
  const temporaryRestrictions = normalizeEffectMap(meta.temporaryRestrictions);
  const temporaryRestrictionStarts = normalizeEffectMap(meta.temporaryRestrictionStarts);
  const temporaryRestrictionPayloads = normalizeRestrictionPayloadMap(
    meta.temporaryRestrictionPayloads,
  );
  const temporaryKeywordValues = normalizeValueMap(meta.temporaryKeywordValues);

  let changed = false;

  for (const [keyword, expiryTurn] of Object.entries(temporaryKeywords)) {
    if (isEffectExpired({ expiresAtTurn: expiryTurn }, currentTurn)) {
      delete temporaryKeywords[keyword];
      changed = true;
    }
  }

  for (const keyword of Object.keys(temporaryKeywordValues)) {
    if (!(keyword in temporaryKeywords)) {
      delete temporaryKeywordValues[keyword];
      changed = true;
    }
  }
  for (const keyword of Object.keys(temporaryKeywordStarts)) {
    if (!(keyword in temporaryKeywords)) {
      delete temporaryKeywordStarts[keyword];
      changed = true;
    }
  }
  for (const keyword of Object.keys(temporaryKeywordPayloads)) {
    if (!(keyword in temporaryKeywords)) {
      delete temporaryKeywordPayloads[keyword];
      changed = true;
    }
  }

  for (const [classification, expiryTurn] of Object.entries(temporaryClassifications)) {
    if (isEffectExpired({ expiresAtTurn: expiryTurn }, currentTurn)) {
      delete temporaryClassifications[classification];
      changed = true;
    }
  }
  for (const classification of Object.keys(temporaryClassificationStarts)) {
    if (!(classification in temporaryClassifications)) {
      delete temporaryClassificationStarts[classification];
      changed = true;
    }
  }

  for (const [ability, expiryTurn] of Object.entries(temporaryAbilities)) {
    if (isEffectExpired({ expiresAtTurn: expiryTurn }, currentTurn)) {
      delete temporaryAbilities[ability];
      changed = true;
    }
  }
  for (const ability of Object.keys(temporaryAbilityStarts)) {
    if (!(ability in temporaryAbilities)) {
      delete temporaryAbilityStarts[ability];
      changed = true;
    }
  }
  for (const ability of Object.keys(temporaryAbilityPayloads)) {
    if (!(ability in temporaryAbilities)) {
      delete temporaryAbilityPayloads[ability];
      changed = true;
    }
  }

  for (const [restriction, expiryTurn] of Object.entries(temporaryRestrictions)) {
    if (isEffectExpired({ expiresAtTurn: expiryTurn }, currentTurn)) {
      delete temporaryRestrictions[restriction];
      changed = true;
    }
  }
  for (const restriction of Object.keys(temporaryRestrictionStarts)) {
    if (!(restriction in temporaryRestrictions)) {
      delete temporaryRestrictionStarts[restriction];
      changed = true;
    }
  }
  for (const restriction of Object.keys(temporaryRestrictionPayloads)) {
    if (!(restriction in temporaryRestrictions)) {
      delete temporaryRestrictionPayloads[restriction];
      changed = true;
    }
  }

  if (!changed) {
    return meta;
  }

  return {
    ...meta,
    temporaryKeywords: Object.keys(temporaryKeywords).length > 0 ? temporaryKeywords : undefined,
    temporaryKeywordStarts:
      Object.keys(temporaryKeywordStarts).length > 0 ? temporaryKeywordStarts : undefined,
    temporaryKeywordValues:
      Object.keys(temporaryKeywordValues).length > 0 ? temporaryKeywordValues : undefined,
    temporaryKeywordPayloads:
      Object.keys(temporaryKeywordPayloads).length > 0 ? temporaryKeywordPayloads : undefined,
    temporaryClassifications:
      Object.keys(temporaryClassifications).length > 0 ? temporaryClassifications : undefined,
    temporaryClassificationStarts:
      Object.keys(temporaryClassificationStarts).length > 0
        ? temporaryClassificationStarts
        : undefined,
    temporaryAbilities: Object.keys(temporaryAbilities).length > 0 ? temporaryAbilities : undefined,
    temporaryAbilityStarts:
      Object.keys(temporaryAbilityStarts).length > 0 ? temporaryAbilityStarts : undefined,
    temporaryAbilityPayloads:
      Object.keys(temporaryAbilityPayloads).length > 0 ? temporaryAbilityPayloads : undefined,
    temporaryRestrictions:
      Object.keys(temporaryRestrictions).length > 0 ? temporaryRestrictions : undefined,
    temporaryRestrictionStarts:
      Object.keys(temporaryRestrictionStarts).length > 0 ? temporaryRestrictionStarts : undefined,
    temporaryRestrictionPayloads:
      Object.keys(temporaryRestrictionPayloads).length > 0
        ? temporaryRestrictionPayloads
        : undefined,
  };
}

export function pruneTemporaryEffectsByDuration(
  meta: LorcanaCardMeta | undefined,
  duration: string,
): LorcanaCardMeta | undefined {
  if (!meta) {
    return meta;
  }

  const temporaryKeywords = normalizeEffectMap(meta.temporaryKeywords);
  const temporaryKeywordStarts = normalizeEffectMap(meta.temporaryKeywordStarts);
  const temporaryKeywordPayloads = normalizeKeywordPayloadMap(meta.temporaryKeywordPayloads);
  const temporaryKeywordValues = normalizeValueMap(meta.temporaryKeywordValues);
  let changed = false;

  for (const [keyword, payload] of Object.entries(temporaryKeywordPayloads)) {
    if (payload.duration !== duration) {
      continue;
    }
    delete temporaryKeywords[keyword];
    delete temporaryKeywordStarts[keyword];
    delete temporaryKeywordPayloads[keyword];
    delete temporaryKeywordValues[keyword];
    changed = true;
  }

  if (!changed) {
    return meta;
  }

  return {
    ...meta,
    temporaryKeywords: Object.keys(temporaryKeywords).length > 0 ? temporaryKeywords : undefined,
    temporaryKeywordStarts:
      Object.keys(temporaryKeywordStarts).length > 0 ? temporaryKeywordStarts : undefined,
    temporaryKeywordValues:
      Object.keys(temporaryKeywordValues).length > 0 ? temporaryKeywordValues : undefined,
    temporaryKeywordPayloads:
      Object.keys(temporaryKeywordPayloads).length > 0 ? temporaryKeywordPayloads : undefined,
  };
}

function getPlayerRestrictionMaps(
  state: TemporaryPlayerRestrictionsState,
  playerId: PlayerId,
): {
  restrictions: Record<string, number>;
  starts: Record<string, number>;
  payloads: Record<string, TemporaryPlayerRestrictionPayload>;
} {
  return {
    restrictions: normalizeEffectMap(state.restrictionsByPlayer[playerId]),
    starts: normalizeEffectMap(state.startsByPlayer[playerId]),
    payloads: normalizePlayerRestrictionPayloadMap(state.payloadsByPlayer?.[playerId]),
  };
}

export function addTemporaryPlayerRestriction(
  state: TemporaryPlayerRestrictionsState,
  playerId: PlayerId,
  restriction: string,
  expiresAtTurn: number,
  startsAtTurn?: number,
  payload?: TemporaryPlayerRestrictionPayload,
): TemporaryPlayerRestrictionsState {
  const normalizedRestriction = normalizeTemporaryKey(restriction);
  if (!normalizedRestriction) {
    return state;
  }

  if (!Number.isFinite(expiresAtTurn) || expiresAtTurn < 1) {
    return state;
  }

  const normalizedStartsAtTurn =
    typeof startsAtTurn === "number" && Number.isFinite(startsAtTurn) && startsAtTurn >= 1
      ? Math.floor(startsAtTurn)
      : 1;
  const normalizedExpiresAtTurn = Math.floor(expiresAtTurn);
  if (normalizedStartsAtTurn > normalizedExpiresAtTurn) {
    return state;
  }

  const nextRestrictionsByPlayer = { ...state.restrictionsByPlayer };
  const nextStartsByPlayer = { ...state.startsByPlayer };
  const nextPayloadsByPlayer = { ...state.payloadsByPlayer };
  const { restrictions, starts, payloads } = getPlayerRestrictionMaps(state, playerId);
  const currentExpiry = restrictions[normalizedRestriction] ?? 0;

  if (normalizedExpiresAtTurn > currentExpiry) {
    restrictions[normalizedRestriction] = normalizedExpiresAtTurn;
    starts[normalizedRestriction] = normalizedStartsAtTurn;
  } else if (normalizedExpiresAtTurn === currentExpiry) {
    starts[normalizedRestriction] = Math.min(
      starts[normalizedRestriction] ?? normalizedStartsAtTurn,
      normalizedStartsAtTurn,
    );
  }

  nextRestrictionsByPlayer[playerId] = restrictions;
  nextStartsByPlayer[playerId] = starts;
  if (payload && typeof payload.type === "string" && payload.type.trim().length > 0) {
    payloads[normalizedRestriction] = payload;
  }
  nextPayloadsByPlayer[playerId] = payloads;

  return {
    restrictionsByPlayer: nextRestrictionsByPlayer,
    startsByPlayer: nextStartsByPlayer,
    payloadsByPlayer: nextPayloadsByPlayer,
  };
}

export function hasTemporaryPlayerRestriction(
  state: TemporaryPlayerRestrictionsState | undefined,
  playerId: PlayerId,
  currentTurn: number,
  restriction: string,
): boolean {
  if (!state) {
    return false;
  }

  const normalizedRestriction = normalizeTemporaryKey(restriction);
  if (!normalizedRestriction) {
    return false;
  }

  const { restrictions, starts } = getPlayerRestrictionMaps(state, playerId);
  const expiryTurn = restrictions[normalizedRestriction] ?? 0;
  const startTurn = starts[normalizedRestriction] ?? 1;
  return currentTurn >= startTurn && currentTurn <= expiryTurn;
}

export function pruneExpiredTemporaryPlayerRestrictions(
  state: TemporaryPlayerRestrictionsState | undefined,
  currentTurn: number,
): TemporaryPlayerRestrictionsState | undefined {
  if (!state) {
    return state;
  }

  const restrictionsByPlayer: Record<PlayerId, Record<string, number>> = {};
  const startsByPlayer: Record<PlayerId, Record<string, number>> = {};
  const payloadsByPlayer: Record<PlayerId, Record<string, TemporaryPlayerRestrictionPayload>> = {};

  for (const playerId of new Set<PlayerId>([
    ...(Object.keys(state.restrictionsByPlayer) as PlayerId[]),
    ...(Object.keys(state.startsByPlayer) as PlayerId[]),
    ...(Object.keys(state.payloadsByPlayer ?? {}) as PlayerId[]),
  ])) {
    const { restrictions, starts, payloads } = getPlayerRestrictionMaps(state, playerId);

    for (const [restriction, expiryTurn] of Object.entries(restrictions)) {
      if (isEffectExpired({ expiresAtTurn: expiryTurn }, currentTurn)) {
        delete restrictions[restriction];
      }
    }

    for (const restriction of Object.keys(starts)) {
      if (!(restriction in restrictions)) {
        delete starts[restriction];
      }
    }
    for (const restriction of Object.keys(payloads)) {
      if (!(restriction in restrictions)) {
        delete payloads[restriction];
      }
    }

    if (Object.keys(restrictions).length > 0) {
      restrictionsByPlayer[playerId] = restrictions;
    }
    if (Object.keys(starts).length > 0) {
      startsByPlayer[playerId] = starts;
    }
    if (Object.keys(payloads).length > 0) {
      payloadsByPlayer[playerId] = payloads;
    }
  }

  return {
    restrictionsByPlayer,
    startsByPlayer,
    payloadsByPlayer,
  };
}
