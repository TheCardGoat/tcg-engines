import {
  registerFabCardDefinition,
  type FabCardDefinitionInput,
  type FabRegisteredCardDefinition,
} from "./cards.ts";
import type { FabPublicCardIdentity } from "@tcg/flesh-and-blood-types";

/** Immutable executable card input selected when a FAB match is created. */
export interface FabMatchProgram {
  readonly fingerprint: string;
  readonly cardDefinitions: Readonly<Record<string, FabRegisteredCardDefinition>>;
  readonly publicCardIdentities: readonly FabPublicCardIdentity[];
}

/** Compiler-owned registries are detached and deeply frozen, so safe to share. */
const compiledDefinitionRegistries = new WeakMap<
  object,
  Readonly<Record<string, FabRegisteredCardDefinition>>
>();

/** Only compiler-owned, deeply frozen output pairs may reuse a whole program. */
const compiledPrograms = new WeakMap<object, WeakMap<object, FabMatchProgram>>();

export function compileFabMatchProgram(
  definitions: Readonly<Record<string, FabCardDefinitionInput>>,
  publicCardIdentities: readonly FabPublicCardIdentity[],
): FabMatchProgram {
  const compiled = compiledPrograms.get(definitions)?.get(publicCardIdentities);
  if (compiled) return compiled;
  // Borrowed input can change between compilations, even when its TypeScript
  // view is readonly. Reuse only registries this compiler owns and froze.
  const cachedDefinitions = compiledDefinitionRegistries.get(definitions);
  const cardDefinitions =
    cachedDefinitions ??
    deepFreeze(
      structuredClone(
        Object.fromEntries(
          Object.entries(definitions)
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([canonicalId, definition]) => [
              canonicalId,
              registerFabCardDefinition(definition),
            ]),
        ),
      ),
    );
  compiledDefinitionRegistries.set(cardDefinitions, cardDefinitions);
  const normalizedPublicCardIdentities = normalizeFabPublicCardIdentities(publicCardIdentities);
  const program = Object.freeze({
    fingerprint: fingerprint(
      stableJson({ cardDefinitions, publicCardIdentities: normalizedPublicCardIdentities }),
    ),
    cardDefinitions,
    publicCardIdentities: normalizedPublicCardIdentities,
  });
  let byIdentities = compiledPrograms.get(cardDefinitions);
  if (!byIdentities) {
    byIdentities = new WeakMap();
    compiledPrograms.set(cardDefinitions, byIdentities);
  }
  byIdentities.set(normalizedPublicCardIdentities, program);
  return program;
}

/**
 * Validate and detach the global naming catalog at a match-program boundary.
 * Production callers must provide it explicitly; deriving it from the seated
 * decks would make name-card decisions depend on private match contents.
 */
export function normalizeFabPublicCardIdentities(
  publicCardIdentities: readonly FabPublicCardIdentity[],
): readonly FabPublicCardIdentity[] {
  const rawCatalog: unknown = publicCardIdentities;
  if (!Array.isArray(rawCatalog)) {
    throw new Error("FAB match initialization requires an explicit public card identity catalog.");
  }
  const normalized: FabPublicCardIdentity[] = rawCatalog.map((identity: unknown) => {
    if (
      !identity ||
      typeof identity !== "object" ||
      !("canonicalId" in identity) ||
      typeof identity.canonicalId !== "string" ||
      identity.canonicalId.trim().length === 0 ||
      !("names" in identity) ||
      !Array.isArray(identity.names) ||
      identity.names.some((name: unknown) => typeof name !== "string")
    ) {
      throw new Error("FAB public card identities require a canonical id and at least one name.");
    }
    const rawNames: string[] = identity.names;
    const names = [...new Set(rawNames.map((name) => name.trim()))]
      .filter(Boolean)
      .sort((left, right) => left.localeCompare(right));
    if (names.length === 0) {
      throw new Error("FAB public card identities require a canonical id and at least one name.");
    }
    const isHero = "isHero" in identity && identity.isHero === true;
    const legalInLivingLegend =
      "legalInLivingLegend" in identity && identity.legalInLivingLegend === true;
    if (legalInLivingLegend && !isHero) {
      throw new Error("Only FAB hero identities may be legal in Living Legend.");
    }
    return {
      canonicalId: identity.canonicalId,
      names,
      ...(isHero ? { isHero: true } : {}),
      ...(legalInLivingLegend ? { legalInLivingLegend: true } : {}),
    };
  });
  normalized.sort((left, right) => left.canonicalId.localeCompare(right.canonicalId));
  const duplicatePublicId = normalized.find(
    (identity, index) => index > 0 && normalized[index - 1]?.canonicalId === identity.canonicalId,
  );
  if (duplicatePublicId) {
    throw new Error(`Duplicate public FAB card identity: ${duplicatePublicId.canonicalId}`);
  }
  // Every level above was freshly allocated by normalization, so freezing this
  // graph already detaches it from the caller without another defensive copy.
  return deepFreeze(normalized);
}

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const nested of Object.values(value as Record<string, unknown>)) deepFreeze(nested);
  return Object.freeze(value);
}

function stableJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  return `{${Object.entries(value as Record<string, unknown>)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`)
    .join(",")}}`;
}

/** Deterministic FNV-1a hash; avoids a runtime-specific crypto dependency. */
function fingerprint(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fab-program-v1-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}
