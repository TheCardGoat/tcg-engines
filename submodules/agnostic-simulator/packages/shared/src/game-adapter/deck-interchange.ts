import {
  DECK_DOCUMENT_SCHEMA_VERSION,
  flattenDeckDocument,
  parseDeckDocument,
  type DeckDocument,
  type DeckDocumentDiagnostic,
  type DeckDocumentEntryV1,
  type DeckDocumentEntryV2,
  type DeckDocumentJsonObject,
  type DeckDocumentV1,
  type DeckDocumentV2,
} from "@tcg/game-page-contract/deck-document";
import type {
  DeckCard,
  DeckDocumentSections,
  DeckFormatDefinition,
  DeckFormatExtensionFieldDefinition,
  DeckFormatSectionRole,
  DeckDocumentValidationMode,
  DeckInterchangeAdapter,
  DeckInterchangeResult,
} from "./types.js";

type LegacyMigration<TGame extends DeckDocumentV1["game"]> =
  | true
  | ((
      document: DeckDocumentV1,
    ) =>
      | { ok: true; document: DeckDocumentV2<TGame> }
      | { ok: false; diagnostics: DeckDocumentDiagnostic[] });

/**
 * Define format-owned deck topology and the V2 persistence bridge for one game.
 * Shared callers transport section ids; only the owning adapter interprets them.
 */
export function defineGameDeckInterchangeAdapter<
  const TGame extends DeckDocumentV1["game"],
  const TSection extends string,
  const TFormat extends string,
>(spec: {
  game: TGame;
  defaultFormatId: TFormat;
  formats: Readonly<Record<TFormat, DeckFormatDefinition<TFormat, TSection>>>;
  /** Present only for active games whose existing V1 documents must survive. */
  migrateV1?: LegacyMigration<TGame>;
  validateExtensions?: (
    document: DeckDocumentV2<TGame, TFormat, TSection>,
    options: { readonly validationMode: DeckDocumentValidationMode },
  ) => DeckDocumentDiagnostic[];
}): DeckInterchangeAdapter<TGame, TSection, TFormat> {
  function getFormatDefinition(formatId: string): DeckFormatDefinition<TFormat, TSection> | null {
    return Object.hasOwn(spec.formats, formatId) ? spec.formats[formatId as TFormat] : null;
  }

  function createDocument(input: {
    formatId?: TFormat;
    name?: string;
    sections: DeckDocumentSections<TSection>;
    declarations?: DeckDocumentJsonObject;
    appearance?: DeckDocumentJsonObject;
  }): DeckDocumentV2<TGame, TFormat, TSection> {
    const formatId = input.formatId ?? spec.defaultFormatId;
    const format = getFormatDefinition(formatId);
    if (!format) throw new Error(`Unknown ${spec.game} deck format "${formatId}".`);

    const allowedSectionIds = new Set(format.sections.map((section) => section.id));
    for (const sectionId of Object.keys(input.sections)) {
      if (!allowedSectionIds.has(sectionId as TSection)) {
        throw new Error(`Unknown ${spec.game} ${formatId} deck section "${sectionId}".`);
      }
    }

    const sections = Object.fromEntries(
      format.sections.map((section) => [
        section.id,
        normalizeEntries(input.sections[section.id] ?? []),
      ]),
    ) as Partial<Record<TSection, DeckDocumentEntryV2[]>>;
    const document: DeckDocumentV2<TGame, TFormat, TSection> = {
      schemaVersion: DECK_DOCUMENT_SCHEMA_VERSION,
      game: spec.game,
      formatId,
      ...(input.name === undefined ? {} : { name: input.name }),
      sections,
      ...(input.declarations === undefined ? {} : { declarations: input.declarations }),
      ...(input.appearance === undefined ? {} : { appearance: input.appearance }),
    };
    const diagnostics = validateDocument(document);
    if (diagnostics.length > 0) {
      throw new Error(diagnostics.map((diagnostic) => diagnostic.message).join("; "));
    }
    return document;
  }

  function createEmptyDocument(
    input: { formatId?: TFormat; name?: string } = {},
  ): DeckDocumentV2<TGame, TFormat, TSection> {
    const formatId = input.formatId ?? spec.defaultFormatId;
    const format = getFormatDefinition(formatId);
    if (!format) throw new Error(`Unknown ${spec.game} deck format "${formatId}".`);
    const sections = {} as Partial<Record<TSection, DeckDocumentEntryV1[]>>;
    for (const section of format.sections) sections[section.id] = [];
    return createDocument({ ...input, formatId, sections });
  }

  function projectDocument(
    input: DeckDocument,
    options: {
      role?: DeckFormatSectionRole;
      validationMode?: DeckDocumentValidationMode;
    } = {},
  ): DeckInterchangeResult {
    const migrated = migrateDocument(input);
    if (!migrated.ok) return { deck: [], diagnostics: migrated.diagnostics };
    const diagnostics = validateDocument(migrated.document, options);
    const format = getFormatDefinition(migrated.document.formatId);
    if (!format) return { deck: [], diagnostics };

    const includedSections = new Set(
      format.sections
        .filter((section) => !options.role || section.roles.includes(options.role))
        .map((section) => section.id),
    );
    const deck = flattenDeckDocument(migrated.document)
      .filter((entry) => includedSections.has(entry.sectionId as TSection))
      .map(
        (entry): DeckCard => ({
          cardId: entry.canonicalId,
          canonicalId: entry.canonicalId,
          ...(entry.printingId ? { printingId: entry.printingId } : {}),
          sectionId: entry.sectionId,
          quantity: entry.quantity,
        }),
      );
    return {
      deck,
      diagnostics,
      ...(migrated.document.declarations === undefined
        ? {}
        : { declarations: migrated.document.declarations }),
      ...(migrated.document.appearance === undefined
        ? {}
        : { appearance: migrated.document.appearance }),
    };
  }

  function migrateDocument(
    input: DeckDocument,
  ):
    | { ok: true; document: DeckDocumentV2<TGame, TFormat, TSection> }
    | { ok: false; diagnostics: DeckDocumentDiagnostic[] } {
    const parsed = parseDeckDocument(input);
    if (!parsed.ok) return parsed;
    if (parsed.document.game !== spec.game) {
      return {
        ok: false,
        diagnostics: [
          malformed(
            `Expected a ${spec.game} deck document, received ${parsed.document.game}.`,
            "game",
          ),
        ],
      };
    }
    if (parsed.document.schemaVersion === DECK_DOCUMENT_SCHEMA_VERSION) {
      return {
        ok: true,
        document: parsed.document as DeckDocumentV2<TGame, TFormat, TSection>,
      };
    }
    if (!spec.migrateV1) {
      return {
        ok: false,
        diagnostics: [
          malformed(
            `${spec.game} DeckDocumentV1 is unsupported; this game requires a new V2 deck.`,
            "schemaVersion",
          ),
        ],
      };
    }
    const migration =
      spec.migrateV1 === true
        ? { ok: true as const, document: migrateV1BySection(spec.game, parsed.document) }
        : spec.migrateV1(parsed.document);
    if (!migration.ok) return migration;
    const diagnostics = validateDocument(
      migration.document as DeckDocumentV2<TGame, TFormat, TSection>,
    );
    if (diagnostics.length > 0) return { ok: false, diagnostics };
    return {
      ok: true,
      document: migration.document as DeckDocumentV2<TGame, TFormat, TSection>,
    };
  }

  function validateDocument(
    document: DeckDocumentV2<TGame, TFormat, TSection>,
    options: { validationMode?: DeckDocumentValidationMode } = {},
  ): DeckDocumentDiagnostic[] {
    const parsed = parseDeckDocument(document);
    if (!parsed.ok) return parsed.diagnostics;
    const diagnostics: DeckDocumentDiagnostic[] = [];
    if (document.game !== spec.game) {
      diagnostics.push(
        malformed(`Expected a ${spec.game} deck document, received ${document.game}.`, "game"),
      );
      return diagnostics;
    }
    const format = getFormatDefinition(document.formatId);
    if (!format) {
      diagnostics.push(
        malformed(`Unsupported ${spec.game} deck format "${document.formatId}".`, "formatId"),
      );
      return diagnostics;
    }

    const definitions = new Map(format.sections.map((section) => [section.id, section]));
    for (const sectionId of Object.keys(document.sections)) {
      if (!definitions.has(sectionId as TSection)) {
        diagnostics.push(
          malformed(
            `Unsupported ${spec.game} ${document.formatId} deck section "${sectionId}".`,
            `sections.${sectionId}`,
          ),
        );
      }
    }
    for (const definition of format.sections) {
      const entries = document.sections[definition.id];
      if (definition.required && entries === undefined) {
        diagnostics.push(
          malformed(
            `${spec.game} ${document.formatId} deck is missing section "${definition.id}".`,
            "sections",
          ),
        );
      }
      if (options.validationMode === "registration") {
        const quantity = (entries ?? []).reduce((total, entry) => total + entry.card.quantity, 0);
        if (definition.exactCards !== undefined && quantity !== definition.exactCards) {
          diagnostics.push(
            malformed(
              `${definition.label} must contain exactly ${definition.exactCards} cards; received ${quantity}.`,
              `sections.${definition.id}`,
            ),
          );
        }
        if (definition.minimumCards !== undefined && quantity < definition.minimumCards) {
          diagnostics.push(
            malformed(
              `${definition.label} must contain at least ${definition.minimumCards} cards; received ${quantity}.`,
              `sections.${definition.id}`,
            ),
          );
        }
        if (definition.maximumCards !== undefined && quantity > definition.maximumCards) {
          diagnostics.push(
            malformed(
              `${definition.label} may contain at most ${definition.maximumCards} cards; received ${quantity}.`,
              `sections.${definition.id}`,
            ),
          );
        }
        if (
          definition.allowedCardCounts !== undefined &&
          !definition.allowedCardCounts.includes(quantity)
        ) {
          diagnostics.push(
            malformed(
              `${definition.label} must contain ${formatAllowedCounts(definition.allowedCardCounts)} cards; received ${quantity}.`,
              `sections.${definition.id}`,
            ),
          );
        }
      }
    }
    diagnostics.push(
      ...validateFormatExtensionObject({
        rootName: "declarations",
        value: document.declarations,
        fields: format.declarationFields ?? [],
        document,
        validationMode: options.validationMode ?? "draft",
      }),
      ...validateFormatExtensionObject({
        rootName: "appearance",
        value: document.appearance,
        fields: format.appearanceFields ?? [],
        document,
        validationMode: options.validationMode ?? "draft",
      }),
    );
    diagnostics.push(
      ...(spec.validateExtensions?.(document, {
        validationMode: options.validationMode ?? "draft",
      }) ?? []),
    );
    return diagnostics;
  }

  return {
    game: spec.game,
    defaultFormatId: spec.defaultFormatId,
    formats: spec.formats,
    getFormatDefinition,
    validateDocument,
    createDocument,
    createEmptyDocument,
    migrateDocument,
    projectDocument,
    toDocument(input) {
      const format = getFormatDefinition(input.formatId);
      if (!format) throw new Error(`Unknown ${spec.game} deck format "${input.formatId}".`);
      const sections = {} as Partial<Record<TSection, DeckDocumentEntryV1[]>>;
      for (const section of format.sections) sections[section.id] = [];
      const implicitSections = format.sections.filter((section) =>
        section.roles.some((role) => role === "validation" || role === "runtime"),
      );
      for (const entry of input.deck) {
        const sectionId = entry.sectionId as TSection | undefined;
        const resolvedSection =
          sectionId ?? (implicitSections.length === 1 ? implicitSections[0]?.id : undefined);
        if (!resolvedSection) {
          throw new Error(`${spec.game} ${input.formatId} deck entries require a sectionId.`);
        }
        if (!format.sections.some((section) => section.id === resolvedSection)) {
          throw new Error(`Unknown ${spec.game} deck section "${resolvedSection}".`);
        }
        (sections[resolvedSection] ??= []).push({
          canonicalId: entry.canonicalId ?? entry.cardId,
          ...(entry.printingId ? { printingId: entry.printingId } : {}),
          quantity: entry.quantity,
        });
      }
      return createDocument({
        formatId: input.formatId,
        ...(input.name === undefined ? {} : { name: input.name }),
        sections,
      });
    },
    fromDocument(document) {
      return projectDocument(document);
    },
  };
}

function formatAllowedCounts(counts: readonly number[]): string {
  if (counts.length <= 1) return String(counts[0] ?? 0);
  return `${counts.slice(0, -1).join(", ")} or ${counts.at(-1)}`;
}

function validateFormatExtensionObject(params: {
  rootName: "declarations" | "appearance";
  value: DeckDocumentJsonObject | undefined;
  fields: readonly DeckFormatExtensionFieldDefinition<string>[];
  document: DeckDocumentV2;
  validationMode: DeckDocumentValidationMode;
}): DeckDocumentDiagnostic[] {
  const diagnostics: DeckDocumentDiagnostic[] = [];
  const definitions = new Map(params.fields.map((field) => [field.id, field] as const));

  if (params.value) {
    inspectExtensionLeaves(params.value, "", definitions, params.rootName, diagnostics);
  }

  for (const field of params.fields) {
    const value = getExtensionValue(params.value, field.id);
    const path = `${params.rootName}.${field.id}`;
    if (value === undefined) {
      if (params.validationMode === "registration" && field.required) {
        diagnostics.push(malformed(`${field.label} is required.`, path));
      }
      continue;
    }

    if (!matchesExtensionKind(value, field.kind)) {
      diagnostics.push(
        malformed(`${field.label} must be a ${extensionKindLabel(field.kind)}.`, path),
      );
      continue;
    }

    if (field.kind === "card-reference" && field.sourceSectionId) {
      const sourceEntries = params.document.sections[field.sourceSectionId] ?? [];
      if (!sourceEntries.some((entry) => entry.card.canonicalId === value)) {
        diagnostics.push(
          malformed(
            `${field.label} must reference a card registered in ${field.sourceSectionId}.`,
            path,
          ),
        );
      }
    }
  }

  return diagnostics;
}

function inspectExtensionLeaves(
  value: DeckDocumentJsonObject,
  prefix: string,
  definitions: ReadonlyMap<string, DeckFormatExtensionFieldDefinition<string>>,
  rootName: "declarations" | "appearance",
  diagnostics: DeckDocumentDiagnostic[],
): void {
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const definition = definitions.get(path);
    if (definition) continue;
    const isKnownContainer = [...definitions.keys()].some((fieldId) =>
      fieldId.startsWith(`${path}.`),
    );
    if (isKnownContainer && isDeckDocumentJsonObject(child)) {
      inspectExtensionLeaves(child, path, definitions, rootName, diagnostics);
      continue;
    }
    diagnostics.push(
      malformed(
        `Unsupported ${rootName === "declarations" ? "declaration" : "appearance"} field "${path}".`,
        `${rootName}.${path}`,
      ),
    );
  }
}

function getExtensionValue(
  value: DeckDocumentJsonObject | undefined,
  path: string,
): DeckDocumentJsonObject[string] | undefined {
  let current: DeckDocumentJsonObject[string] | undefined = value;
  for (const segment of path.split(".")) {
    if (!isDeckDocumentJsonObject(current)) return undefined;
    current = current[segment];
  }
  return current;
}

function matchesExtensionKind(
  value: DeckDocumentJsonObject[string],
  kind: DeckFormatExtensionFieldDefinition["kind"],
): boolean {
  switch (kind) {
    case "card-reference":
    case "printing-reference":
    case "string":
      return typeof value === "string" && value.length > 0;
    case "number":
      return typeof value === "number" && Number.isFinite(value);
    case "boolean":
      return typeof value === "boolean";
    case "json":
      return true;
  }
}

function extensionKindLabel(kind: DeckFormatExtensionFieldDefinition["kind"]): string {
  switch (kind) {
    case "card-reference":
      return "card id";
    case "printing-reference":
      return "printing id";
    case "string":
      return "string";
    case "number":
      return "finite number";
    case "boolean":
      return "boolean";
    case "json":
      return "JSON value";
  }
}

function isDeckDocumentJsonObject(
  value: DeckDocumentJsonObject[string] | undefined,
): value is DeckDocumentJsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeEntries(entries: readonly DeckDocumentEntryV1[]): DeckDocumentEntryV2[] {
  const byCanonical = new Map<
    string,
    { quantity: number; allocations: Map<string, { printingId?: string; quantity: number }> }
  >();
  for (const entry of entries) {
    const current = byCanonical.get(entry.canonicalId) ?? {
      quantity: 0,
      allocations: new Map<string, { printingId?: string; quantity: number }>(),
    };
    current.quantity += entry.quantity;
    const allocationKey = entry.printingId ?? "";
    const allocation = current.allocations.get(allocationKey);
    current.allocations.set(allocationKey, {
      ...(entry.printingId ? { printingId: entry.printingId } : {}),
      quantity: (allocation?.quantity ?? 0) + entry.quantity,
    });
    byCanonical.set(entry.canonicalId, current);
  }

  return [...byCanonical].map(([canonicalId, value]) => {
    const allocations = [...value.allocations.values()];
    const hasExplicitPrinting = allocations.some(
      (allocation) => allocation.printingId !== undefined,
    );
    return {
      card: { canonicalId, quantity: value.quantity },
      ...(hasExplicitPrinting ? { appearance: { printingAllocations: allocations } } : {}),
    };
  });
}

function migrateV1BySection<TGame extends DeckDocumentV1["game"]>(
  game: TGame,
  document: DeckDocumentV1,
): DeckDocumentV2<TGame> {
  return {
    schemaVersion: DECK_DOCUMENT_SCHEMA_VERSION,
    game,
    formatId: document.formatId,
    ...(document.name === undefined ? {} : { name: document.name }),
    sections: Object.fromEntries(
      document.sections
        .filter((section) => !(section.roles?.length === 1 && section.roles[0] === "presentation"))
        .map((section) => [section.id, normalizeEntries(section.entries)]),
    ),
  };
}

function malformed(message: string, path?: string): DeckDocumentDiagnostic {
  return { kind: "malformed", message, ...(path ? { path } : {}) };
}
