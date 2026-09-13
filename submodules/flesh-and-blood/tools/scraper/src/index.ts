import { createHash } from "node:crypto";
import { mkdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type {
  FleshAndBloodRawSnapshot,
  FleshAndBloodSourceArtifact,
} from "@tcg/flesh-and-blood-types";

export const FAB_CUBE_REPOSITORY = "the-fab-cube/flesh-and-blood-cards";
export const FAB_CUBE_REPOSITORY_URL = `https://github.com/${FAB_CUBE_REPOSITORY}`;
export const FAB_CUBE_DEFAULT_REF = "usurp-the-shadow-throne";
export const FAB_CUBE_GITHUB_API = `https://api.github.com/repos/${FAB_CUBE_REPOSITORY}`;
export const FAB_CUBE_RAW_BASE = `https://raw.githubusercontent.com/${FAB_CUBE_REPOSITORY}`;

const SOURCE_PATHS = {
  cardSchema: "json-schema/card-schema.json",
  setSchema: "json-schema/set-schema.json",
} as const;

/**
 * Fab-cube ships one directory per printed language under `json/`. The
 * English tree is the full catalog; the translated trees carry the same
 * schema with localized display text and printing art for the cards they
 * cover (partial coverage is expected — see the per-locale extraction in
 * `tools/catalog`).
 */
export const FAB_CUBE_LANGUAGES = ["english", "french", "german", "italian", "spanish"] as const;

export type FabCubeLanguage = (typeof FAB_CUBE_LANGUAGES)[number];

/** BCP 47 locale recorded on snapshots and printings for each source language. */
export const FAB_CUBE_LANGUAGE_LOCALES: Record<FabCubeLanguage, string> = {
  english: "en-US",
  french: "fr-FR",
  german: "de-DE",
  italian: "it-IT",
  spanish: "es-ES",
};

function sourcePathsFor(language: FabCubeLanguage): { cards: string; sets: string } {
  return {
    cards: `json/${language}/card.json`,
    sets: `json/${language}/set.json`,
  };
}
const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_ATTEMPTS = 3;
const MAX_RETRY_DELAY_MS = 5_000;

export class FleshAndBloodScrapeError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "FleshAndBloodScrapeError";
  }
}

export interface ScrapeOptions {
  fetchImpl?: typeof fetch;
  now?: () => Date;
  timeoutMs?: number;
  maxAttempts?: number;
  sleep?: (milliseconds: number) => Promise<void>;
  sourceRef?: string;
  /** Pin every language request to a commit already resolved by an earlier request. */
  sourceVersion?: string;
  githubToken?: string;
  /** Fab-cube language directory to scrape. Defaults to the full English catalog. */
  language?: FabCubeLanguage;
}

interface FetchedJson {
  value: unknown;
  sha256: string;
  sourceUrl: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function defaultSleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function retryDelayMilliseconds(response: Response, attempt: number): number {
  const retryAfter = response.headers.get("retry-after");
  const seconds = retryAfter === null ? Number.NaN : Number(retryAfter);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.min(seconds * 1_000, MAX_RETRY_DELAY_MS);
  }
  return Math.min(250 * 2 ** (attempt - 1), MAX_RETRY_DELAY_MS);
}

async function fetchJsonWithRetry(
  url: string,
  options: Required<Pick<ScrapeOptions, "fetchImpl" | "timeoutMs" | "maxAttempts" | "sleep">> & {
    githubToken?: string;
  },
): Promise<FetchedJson> {
  for (let attempt = 1; attempt <= options.maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs);
    try {
      const headers: Record<string, string> = {
        accept: "application/vnd.github+json",
        "user-agent": "tcg-online-fab-catalog",
        "x-github-api-version": "2022-11-28",
      };
      if (options.githubToken) headers.authorization = `Bearer ${options.githubToken}`;
      const response = await options.fetchImpl(url, {
        headers,
        signal: controller.signal,
        redirect: "follow",
      });
      if ((response.status === 429 || response.status >= 500) && attempt < options.maxAttempts) {
        await options.sleep(retryDelayMilliseconds(response, attempt));
        continue;
      }
      if (!response.ok) {
        throw new FleshAndBloodScrapeError(
          `The FAB Cube request failed with HTTP ${response.status}: ${url}`,
        );
      }
      const text = await response.text();
      try {
        return { value: JSON.parse(text) as unknown, sha256: sha256(text), sourceUrl: url };
      } catch (error) {
        throw new FleshAndBloodScrapeError(`The FAB Cube returned malformed JSON: ${url}`, {
          cause: error,
        });
      }
    } catch (error) {
      if (error instanceof FleshAndBloodScrapeError) throw error;
      const timedOut = controller.signal.aborted;
      if (attempt < options.maxAttempts && (error instanceof TypeError || timedOut)) {
        await options.sleep(Math.min(250 * 2 ** (attempt - 1), MAX_RETRY_DELAY_MS));
        continue;
      }
      throw new FleshAndBloodScrapeError(
        timedOut ? "The FAB Cube request timed out." : "The FAB Cube request failed.",
        { cause: error },
      );
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new FleshAndBloodScrapeError("The FAB Cube request exhausted its retry budget.");
}

function parseResolvedCommit(value: unknown): { sha: string; committedAt: string } {
  if (!isRecord(value) || typeof value.sha !== "string" || !/^[a-f0-9]{40}$/.test(value.sha)) {
    throw new FleshAndBloodScrapeError("GitHub did not return an immutable commit SHA.");
  }
  const commit = value.commit;
  const committer = isRecord(commit) ? commit.committer : undefined;
  const date = isRecord(committer) ? committer.date : undefined;
  if (typeof date !== "string" || Number.isNaN(Date.parse(date))) {
    throw new FleshAndBloodScrapeError("GitHub did not return the source commit timestamp.");
  }
  return { sha: value.sha, committedAt: new Date(date).toISOString() };
}

function validateSourceSchema(
  value: unknown,
  label: string,
  requiredKeys: readonly string[],
): void {
  if (!isRecord(value) || value.type !== "array" || !isRecord(value.items)) {
    throw new FleshAndBloodScrapeError(`${label} is not an array JSON schema.`);
  }
  const required = value.items.required;
  if (!Array.isArray(required) || required.some((entry) => typeof entry !== "string")) {
    throw new FleshAndBloodScrapeError(`${label} does not declare required fields.`);
  }
  const missing = requiredKeys.filter((key) => !required.includes(key));
  if (missing.length > 0) {
    throw new FleshAndBloodScrapeError(
      `${label} is missing required field(s): ${missing.join(", ")}`,
    );
  }
}

function matchesJsonSchemaType(value: unknown, type: unknown): boolean {
  const types = Array.isArray(type) ? type : [type];
  return types.some((candidate) => {
    if (candidate === "null") return value === null;
    if (candidate === "array") return Array.isArray(value);
    if (candidate === "object") return isRecord(value);
    if (candidate === "integer") return typeof value === "number" && Number.isInteger(value);
    return typeof candidate === "string" && typeof value === candidate;
  });
}

function validateValueAgainstSourceSchema(value: unknown, schema: unknown, path: string): void {
  if (!isRecord(schema)) {
    throw new FleshAndBloodScrapeError(`${path} has a malformed source schema.`);
  }
  if ("type" in schema && !matchesJsonSchemaType(value, schema.type)) {
    throw new FleshAndBloodScrapeError(`${path} has the wrong JSON type.`);
  }
  if (Array.isArray(value) && "items" in schema) {
    value.forEach((entry, index) =>
      validateValueAgainstSourceSchema(entry, schema.items, `${path}[${index}]`),
    );
    return;
  }
  if (!isRecord(value)) return;

  const required = Array.isArray(schema.required) ? schema.required : [];
  for (const key of required) {
    if (typeof key === "string" && !(key in value)) {
      throw new FleshAndBloodScrapeError(`${path} is missing required field ${key}.`);
    }
  }
  const properties = isRecord(schema.properties) ? schema.properties : {};
  for (const [key, propertySchema] of Object.entries(properties)) {
    if (key in value) {
      validateValueAgainstSourceSchema(value[key], propertySchema, `${path}.${key}`);
    }
  }
}

function validatePayloadAgainstSourceSchema(
  payload: unknown,
  schema: unknown,
  label: string,
): void {
  validateValueAgainstSourceSchema(payload, schema, label);
}

function artifact(pathname: string, fetched: FetchedJson): FleshAndBloodSourceArtifact {
  return { path: pathname, sourceUrl: fetched.sourceUrl, sha256: fetched.sha256 };
}

export async function scrapeFabCube(
  options: ScrapeOptions = {},
): Promise<FleshAndBloodRawSnapshot> {
  const sourceRef = options.sourceRef?.trim() || FAB_CUBE_DEFAULT_REF;
  const sourceVersion = options.sourceVersion?.trim();
  if (sourceVersion && !/^[a-f0-9]{40}$/.test(sourceVersion)) {
    throw new FleshAndBloodScrapeError("The pinned FAB Cube source version is not a commit SHA.");
  }
  const language = options.language ?? "english";
  const locale = FAB_CUBE_LANGUAGE_LOCALES[language];
  const sourcePaths = sourcePathsFor(language);
  const fetchOptions = {
    fetchImpl: options.fetchImpl ?? fetch,
    sleep: options.sleep ?? defaultSleep,
    timeoutMs: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    maxAttempts: Math.max(1, Math.min(options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS, 5)),
    ...(options.githubToken ? { githubToken: options.githubToken } : {}),
  };
  const resolved = await fetchJsonWithRetry(
    `${FAB_CUBE_GITHUB_API}/commits/${encodeURIComponent(sourceVersion ?? sourceRef)}`,
    fetchOptions,
  );
  const { sha, committedAt } = parseResolvedCommit(resolved.value);
  if (sourceVersion && sha !== sourceVersion) {
    throw new FleshAndBloodScrapeError(
      `GitHub resolved pinned FAB Cube commit ${sourceVersion} to unexpected commit ${sha}.`,
    );
  }
  const fetchArtifact = (pathname: string) =>
    fetchJsonWithRetry(`${FAB_CUBE_RAW_BASE}/${sha}/${pathname}`, fetchOptions);
  const [cards, sets, cardSchema, setSchema] = await Promise.all([
    fetchArtifact(sourcePaths.cards),
    fetchArtifact(sourcePaths.sets),
    fetchArtifact(SOURCE_PATHS.cardSchema),
    fetchArtifact(SOURCE_PATHS.setSchema),
  ]);
  if (!Array.isArray(cards.value) || cards.value.length === 0) {
    throw new FleshAndBloodScrapeError("The FAB Cube card file returned no cards.");
  }
  if (!Array.isArray(sets.value)) {
    throw new FleshAndBloodScrapeError("The FAB Cube set file is not an array.");
  }
  validateSourceSchema(cardSchema.value, "The FAB Cube card schema", [
    "unique_id",
    "name",
    "types",
    "printings",
  ]);
  validateSourceSchema(setSchema.value, "The FAB Cube set schema", ["id", "name", "printings"]);
  validatePayloadAgainstSourceSchema(cards.value, cardSchema.value, "The FAB Cube cards");
  validatePayloadAgainstSourceSchema(sets.value, setSchema.value, "The FAB Cube sets");

  const payload = {
    cards: cards.value,
    sets: sets.value,
    schemas: { card: cardSchema.value, set: setSchema.value },
    totalCards: cards.value.length,
    totalSets: sets.value.length,
  };
  return {
    schemaVersion: 2,
    source: "fab-cube",
    sourceUrl: FAB_CUBE_REPOSITORY_URL,
    sourceRef,
    locale,
    language,
    fetchedAt: options.now?.().toISOString() ?? committedAt,
    sourceVersion: sha,
    artifacts: [
      artifact(sourcePaths.cards, cards),
      artifact(sourcePaths.sets, sets),
      artifact(SOURCE_PATHS.cardSchema, cardSchema),
      artifact(SOURCE_PATHS.setSchema, setSchema),
    ],
    sha256: sha256(JSON.stringify(payload)),
    payload,
  };
}

export async function writeRawSnapshot(
  snapshot: FleshAndBloodRawSnapshot,
  outputRoot = path.resolve(".cache/raw"),
): Promise<string> {
  const directory = path.join(outputRoot, snapshot.source, snapshot.locale);
  const target = path.join(directory, `${snapshot.sourceVersion}.json`);
  const temporary = `${target}.tmp`;
  await mkdir(directory, { recursive: true });
  await writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  await rename(temporary, target);
  return target;
}
