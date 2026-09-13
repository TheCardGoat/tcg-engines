import {
  SimulatorDebugExportV1Schema,
  stringifySimulatorDebugExport,
  type SimulatorDebugExportV1,
} from "@tcg/game-page-contract/debug-export";
import type { GameSlug } from "@tcg/simulator-contract";

import { apiUrl } from "../../runtime/gameRuntimeApi";
import type { SimulatorDebugExportRangeRequest } from "./SimulatorDebugExportContext";

export async function fetchHostedSimulatorDebugExport(
  gameSlug: GameSlug,
  gameId: string,
  request: SimulatorDebugExportRangeRequest,
  fetcher: typeof fetch = fetch,
): Promise<SimulatorDebugExportV1> {
  const query = new URLSearchParams();
  if (request.startMove !== undefined) query.set("startMove", String(request.startMove));
  if (request.endMove !== undefined) query.set("endMove", String(request.endMove));
  const suffix = query.size > 0 ? `?${query.toString()}` : "";
  const response = await fetcher(
    apiUrl(gameSlug, `/play/replays/${encodeURIComponent(gameId)}/debug-export${suffix}`),
    { credentials: "include" },
  );
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(
      readErrorMessage(detail) ?? `Debug history request failed (${response.status}).`,
    );
  }
  return SimulatorDebugExportV1Schema.parse(await response.json());
}

export function serializeSimulatorDebugExport(value: SimulatorDebugExportV1): string {
  return stringifySimulatorDebugExport(value);
}

export function simulatorDebugExportFilename(value: SimulatorDebugExportV1): string {
  const slug = safeFilenamePart(value.game.slug);
  const gameId = safeFilenamePart(value.game.gameId);
  return `${slug}-${gameId}-moves-${value.range.startMove}-${value.range.endMove}.tcg-debug.json`;
}

export async function copySimulatorDebugExport(
  serialized: string,
  clipboard: Pick<Clipboard, "writeText"> | undefined = globalThis.navigator?.clipboard,
): Promise<void> {
  if (!clipboard) throw new Error("Clipboard access is unavailable. Download the JSON instead.");
  await clipboard.writeText(serialized);
}

export function downloadSimulatorDebugExport(
  serialized: string,
  filename: string,
  documentRef: Document = document,
): void {
  const url = URL.createObjectURL(new Blob([serialized], { type: "application/json" }));
  const anchor = documentRef.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  documentRef.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function safeFilenamePart(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "unknown";
}

function readErrorMessage(value: unknown): string | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const error = "error" in value ? value.error : undefined;
  return error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
    ? error.message
    : undefined;
}
