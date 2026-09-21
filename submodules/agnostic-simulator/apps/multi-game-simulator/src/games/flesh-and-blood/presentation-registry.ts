import {
  PresentationBundleSchema,
  PresentationEnvelopeSchema,
  PresentationRecordsSchema,
  emptyPresentationRecords,
  mergePresentationRecords,
  stablePresentationJson,
  type PresentationBundle,
  type PresentationCatalogReference,
  type PresentationEnvelope,
  type PresentationRecords,
} from "@tcg/protocol/presentation";
import { FAB_PRESENTATION_CATALOG } from "@tcg/flesh-and-blood-cards/presentation-revision";
import { selectFabPresentationRecords } from "@tcg/flesh-and-blood-cards/presentation";
import {
  createFabCardArtResolver,
  type FabCardArtResolver,
  type FabPresentationDefinition,
} from "./cardArt";
import { isFabFixtureArtPlaceholder } from "./fixture-art-placeholders";

export type FabPresentationRegistryStatus = "loading" | "ready" | "error";

export interface FabPresentationRegistrySnapshot {
  readonly revision: number;
  readonly status: FabPresentationRegistryStatus;
  readonly resolver: FabCardArtResolver;
  readonly bindings: PresentationEnvelope["bindings"];
  readonly unavailableCanonicalIds: readonly string[];
  readonly error?: string;
}

const failedCatalogs = new Set<string>();
const catalogRequests = new Map<string, Promise<PresentationRecords>>();

async function sha256(bytes: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(bytes));
  return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, "0")).join("");
}

/** Immutable catalogs are the only cross-match cache. Rejections stay cached until explicit retry. */
export function loadFabPresentationCatalog(
  reference: PresentationCatalogReference = FAB_PRESENTATION_CATALOG,
  retry = false,
): Promise<PresentationRecords> {
  if (reference.url !== `https://cdn.tcg.online/public/fab/presentation/${reference.revision}.json`)
    return Promise.reject(new Error("Invalid catalog location"));
  if (retry && failedCatalogs.delete(reference.revision))
    catalogRequests.delete(reference.revision);
  const cached = catalogRequests.get(reference.revision);
  if (cached) return cached;
  const request = (async () => {
    for (let attempt = 0; ; attempt++) {
      try {
        const fetchPinned = async () => {
          const response = await fetch(reference.url, { signal: AbortSignal.timeout(5_000) });
          if (!response.ok) throw new Error(`Catalog recovery failed (${response.status})`);
          return response.text();
        };
        let bytes: string;
        if (reference.revision === FAB_PRESENTATION_CATALOG.revision) {
          try {
            const { fabPresentationCatalog } =
              await import("@tcg/flesh-and-blood-cards/presentation-catalog");
            bytes = `${JSON.stringify(fabPresentationCatalog)}\n`;
          } catch {
            // A long-lived tab can outlive its frontend chunks. The retained artifact survives.
            bytes = await fetchPinned();
          }
        } else bytes = await fetchPinned();
        if ((await sha256(bytes)) !== reference.revision)
          throw new Error("Catalog revision mismatch");
        const value: unknown = JSON.parse(bytes);
        const parsed = PresentationRecordsSchema.loose().parse(value);
        return PresentationRecordsSchema.parse({
          records: parsed.records,
          aliases: parsed.aliases,
        });
      } catch (error) {
        if (attempt === 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  })();
  void request.catch(() => failedCatalogs.add(reference.revision));
  catalogRequests.set(reference.revision, request);
  return request;
}

export class FabPresentationRegistry {
  private bundle: PresentationBundle | undefined;
  private records: PresentationRecords = emptyPresentationRecords();
  private listeners = new Set<() => void>();
  private attempted = new Set<string>();
  private requestedDefinitions = new Map<string, FabPresentationDefinition>();
  private fingerprint = "";
  private recovering: Promise<void> | undefined;
  private snapshot: FabPresentationRegistrySnapshot = {
    revision: 0,
    status: "loading",
    resolver: createFabCardArtResolver(),
    bindings: { printingIdByInstanceId: {} } as PresentationEnvelope["bindings"],
    unavailableCanonicalIds: [],
  };

  constructor(initial?: PresentationEnvelope) {
    if (initial) this.install(initial);
  }
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  getSnapshot = () => this.snapshot;
  getBundle = () => this.bundle;
  getRecords = () => this.records;

  /** Install before state projection. Conflicts leave the trusted snapshot intact. */
  install(value: unknown): boolean {
    try {
      const envelope = PresentationEnvelopeSchema.parse(value);
      const manifestId =
        envelope.kind === "full" ? envelope.bundle.manifestId : envelope.manifestId;
      if (this.bundle && this.bundle.manifestId !== manifestId)
        throw new Error("Presentation belongs to a different match bundle");
      if (!this.bundle && envelope.kind !== "full")
        throw new Error("Presentation base is missing; synchronize the match");
      const bundle = envelope.kind === "full" ? envelope.bundle : this.bundle;
      if (!bundle) return false;
      const records = mergePresentationRecords(
        mergePresentationRecords(this.records, bundle),
        envelope.supplements,
      );
      this.bundle = bundle;
      this.records = records;
      this.publish(envelope.bindings);
      return true;
    } catch (error) {
      this.snapshot = { ...this.snapshot, status: "error", error: String(error) };
      this.emit();
      return false;
    }
  }

  retry = () => this.ensure([...this.requestedDefinitions.values()], true);

  async ensure(definitions: readonly FabPresentationDefinition[], retry = false): Promise<void> {
    definitions = definitions.filter(
      (definition) => !isFabFixtureArtPlaceholder(definition.canonicalId),
    );
    for (const definition of definitions) {
      this.requestedDefinitions.set(definition.canonicalId, {
        ...this.requestedDefinitions.get(definition.canonicalId),
        ...definition,
      });
    }
    const references = definitions.flatMap((definition) => [
      definition.canonicalId,
      ...(definition.presentationReference ? [definition.presentationReference] : []),
      ...(definition.slug ? [definition.slug] : []),
      ...(definition.name ? [definition.name] : (definition.base?.names ?? [])),
    ]);
    const missing = definitions
      .filter(
        (definition) =>
          ![
            definition.canonicalId,
            definition.slug,
            definition.name,
            ...(definition.base?.names ?? []),
          ].some(
            (id) =>
              id &&
              (this.records.records[id] || this.records.records[this.records.aliases[id] ?? ""]),
          ),
      )
      .map((definition) => definition.canonicalId);
    const printingIds = Object.values(this.snapshot.bindings.printingIdByInstanceId);
    const missingPrintings = printingIds.filter(
      (id) => !Object.values(this.records.records).some((record) => record.printings[id]),
    );
    const recoveryKey = [...missing, ...missingPrintings].sort().join("\n");
    if (!retry && this.bundle && missing.length === 0 && missingPrintings.length === 0) return;
    if (!retry && this.attempted.has(recoveryKey)) return;
    if (this.snapshot.error && !retry) return;
    if (this.recovering) {
      await this.recovering;
      return this.ensure(definitions, retry);
    }
    this.attempted.add(recoveryKey);
    this.markLoading();
    const reference: PresentationCatalogReference =
      this.bundle?.catalog ?? FAB_PRESENTATION_CATALOG;
    this.recovering = (async () => {
      try {
        const catalog = await loadFabPresentationCatalog(reference, retry);
        const selected = PresentationRecordsSchema.parse(
          selectFabPresentationRecords(catalog, references, printingIds),
        );
        for (const definition of definitions) {
          if (!definition.presentationReference) continue;
          const canonicalId =
            catalog.records[definition.presentationReference]?.canonicalId ??
            catalog.aliases[definition.presentationReference];
          if (!canonicalId || !selected.records[canonicalId])
            throw new Error(
              `Unknown fixture presentation reference: ${definition.presentationReference}`,
            );
          selected.aliases[definition.canonicalId] = canonicalId;
        }
        if (!this.bundle) {
          const body = { schemaVersion: 1, catalog: reference, ...selected };
          const bundle = PresentationBundleSchema.parse({
            ...body,
            manifestId: await sha256(stablePresentationJson(body)),
          });
          this.install({
            kind: "full",
            bundle,
            supplements: emptyPresentationRecords(),
            bindings: this.snapshot.bindings,
          });
        } else {
          this.records = mergePresentationRecords(this.records, selected);
          this.publish(this.snapshot.bindings);
        }
        const unavailable = missing.filter(
          (id) =>
            !this.records.records[id] && !this.records.records[this.records.aliases[id] ?? ""],
        );
        this.markUnavailable(unavailable);
        if (unavailable.length)
          console.warn("fab.presentation.missing_descriptor", {
            revision: reference.revision,
            canonicalIds: unavailable,
          });
      } catch (error) {
        console.warn("fab.presentation.recovery_failed", {
          revision: reference.revision,
          error: String(error),
        });
        this.snapshot = {
          ...this.snapshot,
          status: "error",
          unavailableCanonicalIds: [],
          error: String(error),
        };
        this.emit();
      }
    })();
    try {
      await this.recovering;
    } finally {
      this.recovering = undefined;
    }
  }

  private publish(bindings: PresentationEnvelope["bindings"]) {
    const fingerprint = stablePresentationJson({ records: this.records, bindings });
    if (
      fingerprint === this.fingerprint &&
      this.snapshot.status === "ready" &&
      !this.snapshot.error
    )
      return;
    this.fingerprint = fingerprint;
    this.snapshot = {
      revision: this.snapshot.revision + 1,
      status: "ready",
      resolver: createFabCardArtResolver(this.records),
      bindings,
      unavailableCanonicalIds: [],
    };
    this.emit();
  }
  private markLoading() {
    if (this.snapshot.status === "loading" && !this.snapshot.error) return;
    this.snapshot = {
      ...this.snapshot,
      status: "loading",
      unavailableCanonicalIds: [],
      error: undefined,
    };
    this.emit();
  }
  private markUnavailable(canonicalIds: readonly string[]) {
    const unavailableCanonicalIds = [...new Set(canonicalIds)].sort();
    if (
      unavailableCanonicalIds.length === this.snapshot.unavailableCanonicalIds.length &&
      unavailableCanonicalIds.every(
        (canonicalId, index) => canonicalId === this.snapshot.unavailableCanonicalIds[index],
      )
    )
      return;
    this.snapshot = { ...this.snapshot, unavailableCanonicalIds };
    this.emit();
  }
  private emit() {
    for (const listener of this.listeners) listener();
  }
}

/** Bounded background work; visible <img> requests still have browser priority. */
export function prefetchFabBoardImages(
  urls: readonly string[],
  load = (url: string) =>
    new Promise<void>((resolve) => {
      const image = new Image();
      image.onload = image.onerror = () => resolve();
      image.src = url;
    }),
) {
  const pending = [...new Set(urls)];
  let cancelled = false;
  const worker = async () => {
    while (!cancelled && pending.length) {
      const url = pending.shift();
      if (url) await load(url).catch(() => undefined);
    }
  };
  void Promise.all(Array.from({ length: 4 }, worker));
  return () => {
    cancelled = true;
  };
}
