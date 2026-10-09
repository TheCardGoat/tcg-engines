/// <reference types="bun-types" />
/**
 * Launch the shipped Bun replay reader against minimal player archives.
 * Collected by the Cyberpunk `vp test` gate, so this file stays on vite-plus/test
 * and uses `import.meta.dirname` (Node), not Bun-only `import.meta.dir`.
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { deflateRawSync } from "node:zlib";
import { expect, test } from "vite-plus/test";

const READER = join(import.meta.dirname, "read_replay.ts");

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeU16(bytes: number[], value: number): void {
  bytes.push(value & 0xff, (value >> 8) & 0xff);
}

function writeU32(bytes: number[], value: number): void {
  bytes.push(value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >> 24) & 0xff);
}

function storedZip(files: Record<string, string>): Uint8Array {
  const locals: number[] = [];
  const central: number[] = [];
  let offset = 0;
  for (const [name, text] of Object.entries(files)) {
    const nameBytes = [...new TextEncoder().encode(name)];
    const raw = new TextEncoder().encode(text);
    const compressed = deflateRawSync(raw);
    const crc = crc32(raw);
    const localStart = offset;
    writeU32(locals, 0x04034b50);
    writeU16(locals, 20);
    writeU16(locals, 0);
    writeU16(locals, 8);
    writeU16(locals, 0);
    writeU16(locals, 0);
    writeU32(locals, crc);
    writeU32(locals, compressed.length);
    writeU32(locals, raw.length);
    writeU16(locals, nameBytes.length);
    writeU16(locals, 0);
    locals.push(...nameBytes, ...compressed);
    offset = locals.length;
    writeU32(central, 0x02014b50);
    writeU16(central, 20);
    writeU16(central, 20);
    writeU16(central, 0);
    writeU16(central, 8);
    writeU16(central, 0);
    writeU16(central, 0);
    writeU32(central, crc);
    writeU32(central, compressed.length);
    writeU32(central, raw.length);
    writeU16(central, nameBytes.length);
    writeU16(central, 0);
    writeU16(central, 0);
    writeU16(central, 0);
    writeU16(central, 0);
    writeU32(central, 0);
    writeU32(central, localStart);
    central.push(...nameBytes);
  }
  const centralOffset = locals.length;
  const eocd: number[] = [];
  writeU32(eocd, 0x06054b50);
  writeU16(eocd, 0);
  writeU16(eocd, 0);
  writeU16(eocd, Object.keys(files).length);
  writeU16(eocd, Object.keys(files).length);
  writeU32(eocd, central.length);
  writeU32(eocd, centralOffset);
  writeU16(eocd, 0);
  return Uint8Array.from([...locals, ...central, ...eocd]);
}

function writeArchive(
  directory: string,
  slug: string,
  gameId: string,
  participants: Array<{ id: string; seat: number; displayName: string }>,
  steps: unknown[],
): string {
  const path = join(directory, `${slug}.replay.zip`);
  const replay = {
    version: 3,
    gameType: slug,
    gameId,
    matchId: `match-${gameId}`,
    participants,
    steps,
    metadata: { totalTurns: 1, totalMoves: steps.length },
  };
  const manifest = {
    format: "tcg-replay-archive",
    version: 1,
    gameSlug: slug,
    gameId,
    replayFile: "replay.json",
  };
  writeFileSync(
    path,
    storedZip({
      "manifest.json": JSON.stringify(manifest),
      "replay.json": JSON.stringify({ replay }),
    }),
  );
  return path;
}

function acceptedMove(turn: number, actorId: string, moveId: string) {
  return { stateVersion: turn, turnNumber: turn, actorId, moveId, timestamp: turn };
}

function publicStep(
  turn: number,
  actorId: string,
  moveId: string,
  entries: unknown[],
  patches: unknown[] = [],
) {
  return {
    acceptedMove: acceptedMove(turn, actorId, moveId),
    patches,
    logs: [{ tag: "engine_log", data: { public: entries } }],
  };
}

function narrativeStep(turn: number, actorId: string, moveId: string, data: unknown) {
  return {
    acceptedMove: acceptedMove(turn, actorId, moveId),
    patches: [],
    logs: [{ tag: "engine_log", data }],
  };
}

function runReader(path: string) {
  return spawnSync("bun", [READER, path], { encoding: "utf8" });
}

test("allowed games print logs and lorcana is rejected", () => {
  const ada = { id: "p1", seat: 1, displayName: "Ada" };
  const bea = { id: "p2", seat: 2, displayName: "Bea" };
  const participants = [ada, bea];
  const directory = mkdtempSync(join(tmpdir(), "replay-reader-"));
  try {
    const cyberpunk = writeArchive(directory, "cyberpunk", "cp-match", participants, [
      publicStep(1, ada.id, "playCard", [
        {
          key: "cyberpunk.move.playCard",
          values: { params: { cardName: "Meredith Stout: Stone Cold Corpo", cost: 4 } },
        },
      ]),
      publicStep(
        1,
        bea.id,
        "resolveAdjustGig",
        [
          {
            key: "cyberpunk.move.resolveAdjustGig",
            values: { params: { dieLabel: "D6", dieId: "gd1", previousValue: 2, value: 4 } },
          },
        ],
        [
          {
            op: "add",
            path: `/players/${ada.id}/zones/gigArea/0`,
            value: { instanceId: "gd1", definitionId: "d6", power: 4 },
          },
        ],
      ),
    ]);
    const playKey = "flesh-and-blood.play";
    const attackKey = "flesh-and-blood.attack";
    const fab = writeArchive(directory, "flesh-and-blood", "fab-match", participants, [
      narrativeStep(2, ada.id, "play", {
        kind: "player-narrative",
        schemaVersion: 1,
        entries: [
          { entryId: "play-1", message: { key: playKey, values: { cardName: "Dawnblade" } } },
        ],
      }),
      narrativeStep(3, bea.id, "attack", {
        kind: "player-narrative",
        schemaVersion: 1,
        entries: [
          {
            entryId: "attack-1",
            publicMessage: { key: attackKey, values: { cardName: "Snatch" } },
          },
        ],
      }),
    ]);
    const gundamKey = "gundam.battle.deploy";
    const gundam = writeArchive(directory, "gundam", "gd-match", participants, [
      publicStep(1, bea.id, "deploy", [
        { key: gundamKey, values: { unit: "RX-78", zone: "space" } },
      ]),
    ]);
    const lorcana = writeArchive(directory, "lorcana", "lor-match", participants, [
      publicStep(1, ada.id, "quest", [{ key: "lorcana.quest", values: { card: "Elsa" } }]),
    ]);

    const cyberpunkResult = runReader(cyberpunk);
    expect(cyberpunkResult.status, cyberpunkResult.stderr).toBe(0);
    const cyberpunkOut = cyberpunkResult.stdout;
    expect(cyberpunkOut).toContain("cp-match");
    expect(cyberpunkOut).toContain("Ada");
    expect(cyberpunkOut).toContain("Bea");
    const playedAt = cyberpunkOut.indexOf("Played Meredith Stout: Stone Cold Corpo for 4 eddies.");
    const adjustedAt = cyberpunkOut.indexOf("Adjusted D6 gd1 from 2 to 4.");
    expect(playedAt).toBeGreaterThanOrEqual(0);
    expect(adjustedAt).toBeGreaterThan(playedAt);
    expect(cyberpunkOut).toContain("increase D6 gd1 2->4 controller=Ada");

    const fabResult = runReader(fab);
    expect(fabResult.status, fabResult.stderr).toBe(0);
    const fabOut = fabResult.stdout;
    expect(fabOut).toContain("fab-match");
    expect(fabOut).toContain("Ada");
    expect(fabOut).toContain("Bea");
    const playAt = fabOut.indexOf(playKey);
    const attackAt = fabOut.indexOf(attackKey);
    expect(playAt).toBeGreaterThanOrEqual(0);
    expect(attackAt).toBeGreaterThan(playAt);
    expect(fabOut).toContain("Dawnblade");
    expect(fabOut).toContain("Snatch");
    const fabGigs = fabOut.split("--- GIG ADJUSTMENTS ---")[1] ?? "";
    expect(fabGigs).toContain("(none)");
    expect(fabGigs).not.toContain("controller=");

    const gundamResult = runReader(gundam);
    expect(gundamResult.status, gundamResult.stderr).toBe(0);
    const gundamOut = gundamResult.stdout;
    expect(gundamOut).toContain("gd-match");
    expect(gundamOut).toContain("Ada");
    expect(gundamOut).toContain("Bea");
    expect(gundamOut).toContain(gundamKey);
    expect(gundamOut).toContain("RX-78");
    const gundamGigs = gundamOut.split("--- GIG ADJUSTMENTS ---")[1] ?? "";
    expect(gundamGigs).toContain("(none)");
    expect(gundamGigs).not.toContain("controller=");

    const lorcanaResult = runReader(lorcana);
    expect(lorcanaResult.status).not.toBe(0);
    expect(lorcanaResult.stderr).toContain("lorcana");
    expect(lorcanaResult.stdout).not.toContain("lor-match");
    expect(lorcanaResult.stdout).not.toContain("Elsa");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
