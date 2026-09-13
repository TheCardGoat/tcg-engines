import { describe, expect, it } from "vitest";

import {
  FAB_CUBE_GITHUB_API,
  FAB_CUBE_RAW_BASE,
  FleshAndBloodScrapeError,
  scrapeFabCube,
} from "./index.ts";

const sha = "7".repeat(40);
const card = {
  unique_id: "card-001",
  name: "Romping Club",
  types: ["Brute", "Weapon", "Club", "2H"],
  printings: [],
};
const set = { unique_id: "set-001", id: "WTR", name: "Welcome to Rathe", printings: [] };
const cardSchema = {
  type: "array",
  items: {
    type: "object",
    required: ["unique_id", "name", "types", "printings"],
    properties: {
      unique_id: { type: "string" },
      printings: {
        type: "array",
        items: {
          type: "object",
          required: ["unique_id", "image_url"],
          properties: {
            unique_id: { type: "string" },
            image_url: { type: ["string", "null"] },
          },
        },
      },
    },
  },
};
const setSchema = {
  type: "array",
  items: { type: "object", required: ["id", "name", "printings"] },
};

function response(value: unknown): Response {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

function sourceFetch(
  overrides: {
    commit?: unknown;
    cards?: unknown;
    cardSchema?: unknown;
    commitRef?: string;
    language?: string;
  } = {},
): {
  fetchImpl: typeof fetch;
  urls: string[];
} {
  const urls: string[] = [];
  const values = new Map<string, unknown>([
    [
      `${FAB_CUBE_GITHUB_API}/commits/${overrides.commitRef ?? "usurp-the-shadow-throne"}`,
      overrides.commit ?? {
        sha,
        commit: { committer: { date: "2026-08-28T10:00:00.000Z" } },
      },
    ],
    [
      `${FAB_CUBE_RAW_BASE}/${sha}/json/${overrides.language ?? "english"}/card.json`,
      overrides.cards ?? [card],
    ],
    [`${FAB_CUBE_RAW_BASE}/${sha}/json/${overrides.language ?? "english"}/set.json`, [set]],
    [
      `${FAB_CUBE_RAW_BASE}/${sha}/json-schema/card-schema.json`,
      overrides.cardSchema ?? cardSchema,
    ],
    [`${FAB_CUBE_RAW_BASE}/${sha}/json-schema/set-schema.json`, setSchema],
  ]);
  const fetchImpl = (async (input: string | URL | Request) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    urls.push(url);
    const value = values.get(url);
    return value === undefined ? new Response("not found", { status: 404 }) : response(value);
  }) as typeof fetch;
  return { fetchImpl, urls };
}

describe("The FAB Cube source adapter", () => {
  it("resolves a branch and downloads every artifact by immutable commit SHA", async () => {
    const fake = sourceFetch();
    const snapshot = await scrapeFabCube({ fetchImpl: fake.fetchImpl, maxAttempts: 1 });

    expect(snapshot.schemaVersion).toBe(2);
    expect(snapshot.source).toBe("fab-cube");
    expect(snapshot.sourceRef).toBe("usurp-the-shadow-throne");
    expect(snapshot.sourceVersion).toBe(sha);
    expect(snapshot.artifacts).toHaveLength(4);
    expect(snapshot.artifacts.every((entry) => /^[a-f0-9]{64}$/.test(entry.sha256))).toBe(true);
    expect(fake.urls.slice(1).every((url) => url.includes(`/${sha}/`))).toBe(true);
  });

  it("is byte-for-byte deterministic for the same commit", async () => {
    const first = sourceFetch();
    const second = sourceFetch();

    expect(JSON.stringify(await scrapeFabCube({ fetchImpl: first.fetchImpl }))).toBe(
      JSON.stringify(await scrapeFabCube({ fetchImpl: second.fetchImpl })),
    );
  });

  it("pins another language to an already resolved immutable commit", async () => {
    const fake = sourceFetch({ commitRef: sha, language: "french" });
    const snapshot = await scrapeFabCube({
      fetchImpl: fake.fetchImpl,
      language: "french",
      sourceRef: "develop",
      sourceVersion: sha,
    });

    expect(snapshot.sourceRef).toBe("develop");
    expect(snapshot.sourceVersion).toBe(sha);
    expect(snapshot.locale).toBe("fr-FR");
    expect(fake.urls[0]).toBe(`${FAB_CUBE_GITHUB_API}/commits/${sha}`);
    expect(fake.urls.slice(1).every((url) => url.includes(`/${sha}/`))).toBe(true);
  });

  it("rejects an invalid pinned source version before fetching", async () => {
    const fake = sourceFetch();
    await expect(
      scrapeFabCube({ fetchImpl: fake.fetchImpl, sourceVersion: "develop" }),
    ).rejects.toThrow("not a commit SHA");
    expect(fake.urls).toEqual([]);
  });

  it("rejects malformed upstream schemas", async () => {
    const fake = sourceFetch({ cardSchema: { type: "object" } });
    await expect(scrapeFabCube({ fetchImpl: fake.fetchImpl, maxAttempts: 1 })).rejects.toThrow(
      "not an array JSON schema",
    );
  });

  it("rejects source payloads that fail the downloaded schema", async () => {
    const fake = sourceFetch({ cards: [{ name: "Missing identity" }] });
    await expect(scrapeFabCube({ fetchImpl: fake.fetchImpl, maxAttempts: 1 })).rejects.toThrow(
      "missing required field unique_id",
    );
  });

  it("validates nested printing records against the downloaded schema", async () => {
    const fake = sourceFetch({
      cards: [{ ...card, printings: [{ unique_id: "printing-1", image_url: 42 }] }],
    });
    await expect(scrapeFabCube({ fetchImpl: fake.fetchImpl, maxAttempts: 1 })).rejects.toThrow(
      "cards[0].printings[0].image_url has the wrong JSON type",
    );
  });

  it("rejects branch resolution without an immutable SHA", async () => {
    const fake = sourceFetch({
      commit: { sha: "moving-ref", commit: { committer: { date: "2026-08-28" } } },
    });
    await expect(
      scrapeFabCube({ fetchImpl: fake.fetchImpl, maxAttempts: 1 }),
    ).rejects.toBeInstanceOf(FleshAndBloodScrapeError);
  });
});
