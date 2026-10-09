/// <reference types="bun-types" />
/**
 * Read a player-exported replay archive and print its public game log.
 *
 * Accepts a .replay.zip (manifest.json + replay.json) or a raw replay.json for
 * cyberpunk, flesh-and-blood, and gundam. This is the public projection players
 * download. It is not the internal server replay consumed by tools/replay-cli.
 *
 * Run with: bun read_replay.ts <replay.zip>
 */

import { readFileSync } from "node:fs";
import { inflateRawSync } from "node:zlib";

const ALLOWED_GAMES = new Set(["cyberpunk", "flesh-and-blood", "gundam"]);

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
type RecordJson = { [key: string]: Json };

interface DieFace {
  id: string;
  type: Json | undefined;
  face: Json | undefined;
}

function isRecord(value: unknown): value is RecordJson {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function display(value: unknown): string {
  if (value === undefined || value === null) return "None";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}

function pad(value: unknown, width: number): string {
  const text =
    typeof value === "number" && Number.isFinite(value)
      ? String(Math.trunc(value))
      : display(value);
  return text.padStart(width, "0");
}

function readU16(buf: Uint8Array, offset: number): number {
  return buf[offset]! | (buf[offset + 1]! << 8);
}

function readU32(buf: Uint8Array, offset: number): number {
  return (
    (buf[offset]! |
      (buf[offset + 1]! << 8) |
      (buf[offset + 2]! << 16) |
      (buf[offset + 3]! << 24)) >>>
    0
  );
}

function unzip(buf: Uint8Array): Map<string, Uint8Array> {
  let eocd = -1;
  const earliest = Math.max(0, buf.length - 22 - 65535);
  for (let index = buf.length - 22; index >= earliest; index -= 1) {
    if (
      buf[index] === 0x50 &&
      buf[index + 1] === 0x4b &&
      buf[index + 2] === 0x05 &&
      buf[index + 3] === 0x06
    ) {
      eocd = index;
      break;
    }
  }
  if (eocd < 0) throw new Error("zip end of central directory not found");
  const count = readU16(buf, eocd + 10);
  let offset = readU32(buf, eocd + 16);
  const files = new Map<string, Uint8Array>();
  for (let index = 0; index < count; index += 1) {
    if (readU32(buf, offset) !== 0x02014b50) throw new Error("bad zip central directory");
    const method = readU16(buf, offset + 10);
    const compressedSize = readU32(buf, offset + 20);
    const nameLength = readU16(buf, offset + 28);
    const extraLength = readU16(buf, offset + 30);
    const commentLength = readU16(buf, offset + 32);
    const localOffset = readU32(buf, offset + 42);
    const name = new TextDecoder().decode(buf.subarray(offset + 46, offset + 46 + nameLength));
    const localNameLength = readU16(buf, localOffset + 26);
    const localExtraLength = readU16(buf, localOffset + 28);
    const dataStart = localOffset + 30 + localNameLength + localExtraLength;
    const compressed = buf.subarray(dataStart, dataStart + compressedSize);
    const data = method === 0 ? compressed : method === 8 ? inflateRawSync(compressed) : null;
    if (!data) throw new Error(`unsupported zip method ${method}`);
    files.set(name, data);
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return files;
}

function requireAllowedGame(slug: unknown, gameType: unknown): string {
  const candidates = [slug, gameType].filter(
    (game): game is string => typeof game === "string" && game.length > 0,
  );
  const disallowed = candidates.find((game) => !ALLOWED_GAMES.has(game));
  if (disallowed) {
    console.error(`unsupported replay game: ${disallowed}`);
    process.exit(1);
  }
  if (new Set(candidates).size > 1) {
    console.error(`unsupported replay game: ${candidates[0]}`);
    process.exit(1);
  }
  if (candidates.length === 0) {
    console.error("unsupported replay game: None");
    process.exit(1);
  }
  return candidates[0]!;
}

function loadReplay(path: string): RecordJson {
  const bytes = readFileSync(path);
  let manifest: RecordJson | null = null;
  let payload: unknown;
  if (path.endsWith(".zip")) {
    const files = unzip(bytes);
    const manifestBytes = files.get("manifest.json");
    if (!manifestBytes) throw new Error("manifest.json missing");
    manifest = JSON.parse(new TextDecoder().decode(manifestBytes)) as RecordJson;
    const replayName =
      typeof manifest.replayFile === "string" ? manifest.replayFile : "replay.json";
    const replayBytes = files.get(replayName);
    if (!replayBytes) throw new Error(`${replayName} missing`);
    payload = JSON.parse(new TextDecoder().decode(replayBytes));
  } else {
    payload = JSON.parse(new TextDecoder().decode(bytes));
  }
  const replay =
    isRecord(payload) && isRecord(payload.replay)
      ? payload.replay
      : isRecord(payload)
        ? payload
        : null;
  if (!replay) {
    console.error(`unsupported replay game: ${path}`);
    process.exit(1);
  }
  const loaded: RecordJson = replay;
  const slug = manifest && typeof manifest.gameSlug === "string" ? manifest.gameSlug : null;
  loaded._game = requireAllowedGame(slug, loaded.gameType);
  loaded._manifest = manifest;
  return loaded;
}

function namesOf(replay: RecordJson): Map<string, string> {
  const names = new Map<string, string>();
  const participants = Array.isArray(replay.participants) ? replay.participants : [];
  for (const participant of participants) {
    if (!isRecord(participant) || typeof participant.id !== "string") continue;
    names.set(
      participant.id,
      typeof participant.displayName === "string" && participant.displayName
        ? participant.displayName
        : participant.id,
    );
  }
  return names;
}

function asLogMessage(value: unknown): RecordJson | null {
  if (isRecord(value) && typeof value.key === "string") return value;
  return null;
}

function messagesIn(source: RecordJson): RecordJson[] {
  const found: RecordJson[] = [];
  if (Array.isArray(source.public)) {
    for (const item of source.public) {
      const message = asLogMessage(item);
      if (message) found.push(message);
    }
  }
  if (Array.isArray(source.entries)) {
    for (const item of source.entries) {
      if (!isRecord(item)) continue;
      const message = asLogMessage(item.message) ?? asLogMessage(item.publicMessage);
      if (message) found.push(message);
    }
  }
  return found;
}

function publicEntries(step: RecordJson): RecordJson[] {
  const entries: RecordJson[] = [];
  const logs = Array.isArray(step.logs) ? step.logs : [];
  for (const log of logs) {
    if (!isRecord(log)) continue;
    const source = isRecord(log.data) ? log.data : log;
    entries.push(...messagesIn(source));
  }
  return entries;
}

function paramsOf(entry: RecordJson): RecordJson {
  const values = isRecord(entry.values) ? entry.values : {};
  return isRecord(values.params) ? values.params : values;
}

function namedParams(entry: RecordJson, names: Map<string, string>): RecordJson {
  const params = { ...paramsOf(entry) };
  for (const field of ["playerId", "targetOwnerId"]) {
    const value = params[field];
    if (typeof value === "string") params[field] = names.get(value) ?? value;
  }
  return params;
}

function sentence(key: string, entry: RecordJson, names: Map<string, string>): string {
  const params = namedParams(entry, names);
  const short = key.startsWith("cyberpunk.") ? key.slice("cyberpunk.".length) : key;
  if (short === "move.playCard") {
    return `Played ${display(params.cardName)} for ${display(params.cost)} eddies.`;
  }
  if (short === "move.playCard.gear") {
    return `Played ${display(params.cardName)} for ${display(params.cost)} eddies, attached to ${display(params.attachedToName)}.`;
  }
  if (short === "trigger.autoResolved") {
    return `Auto-resolved ${display(params.cardName)}: ${display(params.abilityText)}`;
  }
  if (short === "trigger.resolved") {
    return `Resolved ${display(params.cardName)}: ${display(params.abilityText)}`;
  }
  if (short === "move.resolveAdjustGig") {
    return `Adjusted ${display(params.dieLabel)} ${display(params.dieId)} from ${display(params.previousValue)} to ${display(params.value)}.`;
  }
  if (short === "trigger.targetResolved") {
    return `Selected ${display(params.targetNames)} for ${display(params.sourceCardName)} (${display(params.targetKind)} ${display(params.targetId)}).`;
  }
  if (short === "move.gainGig") {
    return `${display(params.playerId)} rolled ${display(params.dieType)} ${display(params.dieId)} at ${display(params.faceValue)}.`;
  }
  if (short === "move.resolveStealGigs") {
    const stolen = Array.isArray(params.stolenGigs) ? params.stolenGigs : [];
    const faces = stolen
      .map((item) =>
        isRecord(item) ? `${display(item.dieType)} ${display(item.faceValue)}` : display(item),
      )
      .join(", ");
    return `${display(params.attackerName)} stole ${display(params.stolenCount)} (${faces}).`;
  }
  if (short === "effect.draw.resolved") {
    return `${display(params.sourceCardName)} drew ${display(params.drawnCount)}.`;
  }
  if (short === "effect.draw.skipped") {
    return `${display(params.sourceCardName)} did not draw: ${display(params.reason)}.`;
  }
  if (
    short === "effect.noValidTargets" ||
    short === "effect.noAction" ||
    short === "effect.skipped"
  ) {
    const label = short.split(".").at(-1) ?? short;
    const detail = params.effectName ?? params.reason ?? "";
    const detailText = detail === "" ? "" : display(detail);
    return `${display(params.sourceCardName)} ${label}: ${detailText}`.trimEnd();
  }
  if (short === "trigger.noValidTargets") {
    return `${display(params.cardName)} had no valid targets: ${display(params.reason)}.`;
  }
  if (short === "move.callLegend") return `Called ${display(params.legendName)}.`;
  if (short === "move.sellCard") {
    const values = isRecord(entry.values) ? entry.values : {};
    return `Sold ${display(params.cardName ?? values.cardName)}.`;
  }
  const compact: RecordJson = {};
  for (const [paramKey, value] of Object.entries(params)) {
    if (paramKey !== "playerId") compact[paramKey] = value as Json;
  }
  return `${short} ${JSON.stringify(compact)}`;
}

function applyGigPatch(areas: Map<string, DieFace[]>, patch: RecordJson): void {
  const rawPath = typeof patch.path === "string" ? patch.path : "";
  const parts = rawPath.replace(/^\/+|\/+$/g, "").split("/");
  if (
    parts.length < 5 ||
    parts[0] !== "players" ||
    parts[2] !== "zones" ||
    parts[3] !== "gigArea"
  ) {
    return;
  }
  const owner = parts[1]!;
  const area = areas.get(owner) ?? [];
  areas.set(owner, area);
  const op = patch.op;
  const value = patch.value;
  if (
    parts.length === 5 &&
    op === "add" &&
    isRecord(value) &&
    typeof value.instanceId === "string"
  ) {
    area.push({ id: value.instanceId, type: value.definitionId, face: value.power });
    return;
  }
  if (parts.length === 5 && op === "remove") {
    const index = Number(parts[4]);
    if (index >= 0 && index < area.length) area.splice(index, 1);
    return;
  }
  if (parts.length === 6 && op === "replace") {
    const index = Number(parts[4]);
    if (index < 0 || index >= area.length) return;
    const field = parts[5];
    const die = area[index]!;
    if (field === "power") die.face = value as Json;
    else if (field === "instanceId" && typeof value === "string") die.id = value;
    else if (field === "definitionId") die.type = value as Json;
  }
}

function controllersOf(areas: Map<string, DieFace[]>, dieId: string): string[] {
  const owners: string[] = [];
  for (const [owner, dice] of areas) {
    if (dice.some((die) => die.id === dieId)) owners.push(owner);
  }
  return owners;
}

function parseArgs(argv: string[]): { replay: string; card: string | null } {
  let replay: string | null = null;
  let card: string | null = null;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]!;
    if (arg === "--card") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        console.error("--card requires a value");
        process.exit(2);
      }
      card = value;
      index += 1;
      continue;
    }
    if (!replay) replay = arg;
  }
  if (!replay) {
    console.error("missing replay path");
    process.exit(2);
  }
  return { replay, card };
}

function main(): void {
  const { replay: replayPath, card } = parseArgs(process.argv.slice(2));
  const replay = loadReplay(replayPath);
  const names = namesOf(replay);
  const meta = isRecord(replay.metadata) ? replay.metadata : {};
  const participants = Array.isArray(replay.participants) ? replay.participants : [];
  const game = typeof replay._game === "string" ? replay._game : "None";
  const steps = Array.isArray(replay.steps) ? replay.steps : [];
  const winnerId = meta.winnerId;
  const winner =
    typeof winnerId === "string" ? (names.get(winnerId) ?? winnerId) : display(winnerId);
  console.log(`=== ${game.toUpperCase()} REPLAY ${display(replay.gameId)} ===`);
  console.log(
    `matchId=${display(replay.matchId)} turns=${display(meta.totalTurns)} steps=${steps.length} winner=${winner} end=${display(meta.endReason)}`,
  );
  for (const participant of participants) {
    if (!isRecord(participant)) continue;
    console.log(
      `seat ${display(participant.seat)}: ${display(participant.displayName)} (${display(participant.id)})`,
    );
  }
  console.log("");
  console.log("--- LOG ---");
  const areas = new Map<string, DieFace[]>();
  for (const participant of participants) {
    if (isRecord(participant) && typeof participant.id === "string") areas.set(participant.id, []);
  }
  const adjustments: Array<{
    turn: unknown;
    step: number;
    actor: string;
    direction: string;
    label: unknown;
    die: unknown;
    previous: unknown;
    next: unknown;
    controllers: string[];
  }> = [];
  const lines: string[] = [];
  steps.forEach((stepValue, index) => {
    if (!isRecord(stepValue)) return;
    const move = isRecord(stepValue.acceptedMove) ? stepValue.acceptedMove : {};
    const patches = Array.isArray(stepValue.patches) ? stepValue.patches : [];
    for (const patch of patches) {
      if (isRecord(patch)) applyGigPatch(areas, patch);
    }
    const actorId = typeof move.actorId === "string" ? move.actorId : undefined;
    const actor = actorId ? (names.get(actorId) ?? actorId) : "None";
    for (const entry of publicEntries(stepValue)) {
      const key = typeof entry.key === "string" ? entry.key : "";
      const text = sentence(key, entry, names);
      const line = `T${pad(move.turnNumber, 2)} step${pad(index, 3)} ${actor} ${display(move.moveId)} | ${text}`;
      lines.push(line);
      console.log(line);
      if (key !== "cyberpunk.move.resolveAdjustGig") continue;
      const params = paramsOf(entry);
      const dieId = typeof params.dieId === "string" ? params.dieId : "";
      const owners = controllersOf(areas, dieId);
      const previous = params.previousValue;
      const next = params.value;
      const direction =
        typeof previous === "number" && typeof next === "number" && next > previous
          ? "increase"
          : typeof previous === "number" && typeof next === "number" && next < previous
            ? "decrease"
            : "unchanged";
      adjustments.push({
        turn: move.turnNumber,
        step: index,
        actor,
        direction,
        label: params.dieLabel,
        die: params.dieId,
        previous,
        next,
        controllers:
          owners.length > 0 ? owners.map((owner) => names.get(owner) ?? owner) : ["unknown"],
      });
    }
  });
  console.log("");
  console.log("--- GIG ADJUSTMENTS ---");
  if (adjustments.length === 0) console.log("(none)");
  for (const item of adjustments) {
    console.log(
      `T${pad(item.turn, 2)} step${pad(item.step, 3)} ${item.actor} ${item.direction} ${display(item.label)} ${display(item.die)} ${display(item.previous)}->${display(item.next)} controller=${item.controllers.join(", ")}`,
    );
  }
  if (card) {
    const needle = card.toLowerCase();
    console.log("");
    console.log(`--- CARD ${card} ---`);
    const matched = lines.filter((line) => line.toLowerCase().includes(needle));
    if (matched.length === 0) console.log("(no log line names this card)");
    for (const line of matched) console.log(line);
    const triggered = matched.filter(
      (line) =>
        line.includes("Auto-resolved") ||
        line.includes("Resolved ") ||
        line.toLowerCase().includes("no valid targets"),
    );
    console.log(`trigger lines: ${triggered.length}`);
  }
}

if (import.meta.main) {
  try {
    main();
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "EPIPE") process.exit(0);
    throw error;
  }
}
