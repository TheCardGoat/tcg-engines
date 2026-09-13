import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { gunzipSync } from "node:zlib";
import { afterEach, describe, expect, it } from "vitest";
import type { GrandArchiveRawSnapshot } from "@tcg/grand-archive-types";
import { writeRawSnapshot } from "./index.ts";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })),
  );
});

describe("Grand Archive scraper snapshots", () => {
  it("writes the maintained gzip snapshot format without manual conversion", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "grand-archive-snapshot-"));
    temporaryDirectories.push(directory);
    const snapshot: GrandArchiveRawSnapshot = {
      schemaVersion: 1,
      source: "gatcg-index-api",
      sourceUrl: "https://api.gatcg.com/cards/search",
      openApiUrl: "https://api.gatcg.com/openapi.json",
      fetchedAt: "2026-08-26T10:00:00.000Z",
      sha256: "fixture",
      payload: { cards: [] },
    };
    const target = await writeRawSnapshot(snapshot, directory);
    expect(path.basename(target)).toBe("gatcg-index-2026-08-26T10-00-00.000Z.json.gz");
    expect(JSON.parse(gunzipSync(await readFile(target)).toString("utf8"))).toEqual(snapshot);
  });
});
