import { describe, expect, it, vi } from "vitest";
import type { SimulatorDebugExportV1 } from "@tcg/game-page-contract/debug-export";
import {
  copySimulatorDebugExport,
  downloadSimulatorDebugExport,
  serializeSimulatorDebugExport,
  simulatorDebugExportFilename,
} from "./debug-export-client";

const fixture: SimulatorDebugExportV1 = {
  schemaVersion: 1,
  exportedAt: "2026-08-31T12:00:00.000Z",
  environment: "test",
  game: { slug: "gundam", gameId: "game:1", matchId: "match-1" },
  range: {
    startMove: 10,
    endMove: 25,
    startStateVersion: 10,
    endStateVersion: 25,
    totalMoves: 30,
  },
  originalInitialState: {},
  stateBeforeRange: {},
  moves: Array.from({ length: 16 }, (_, offset) => ({
    index: 10 + offset,
    stateVersion: 10 + offset,
    turnNumber: 1,
    actorId: offset % 2 === 0 ? "player-1" : "player-2",
    moveId: "pass",
    timestamp: 1_000 + offset,
  })),
  domainEvents: [],
  warnings: [],
};

describe("debug export client", () => {
  it("copies the exact serialized bytes", async () => {
    const writeText = vi.fn(async () => undefined);
    const serialized = serializeSimulatorDebugExport(fixture);
    await copySimulatorDebugExport(serialized, { writeText });
    expect(writeText).toHaveBeenCalledWith(serialized);
  });

  it("downloads the same serialized bytes used by clipboard export", async () => {
    const serialized = serializeSimulatorDebugExport(fixture);
    let downloadedBlob: Blob | undefined;
    let scheduledCleanup: (() => void) | undefined;
    const timeoutHandle = globalThis.setTimeout(() => undefined, 0);
    globalThis.clearTimeout(timeoutHandle);
    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout").mockImplementation((callback) => {
      if (typeof callback === "function") scheduledCleanup = callback;
      return timeoutHandle;
    });
    const createObjectUrl = vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
      if (blob instanceof Blob) downloadedBlob = blob;
      return "blob:debug-export";
    });
    const revokeObjectUrl = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);

    downloadSimulatorDebugExport(serialized, simulatorDebugExportFilename(fixture));

    expect(downloadedBlob).toBeDefined();
    expect(await readBlob(downloadedBlob!)).toBe(serialized);
    expect(click).toHaveBeenCalledOnce();
    expect(createObjectUrl).toHaveBeenCalledOnce();
    expect(revokeObjectUrl).not.toHaveBeenCalled();
    scheduledCleanup?.();
    expect(revokeObjectUrl).toHaveBeenCalledWith("blob:debug-export");
    setTimeoutSpy.mockRestore();
  });

  it("builds a stable safe filename", () => {
    expect(simulatorDebugExportFilename(fixture)).toBe("gundam-game-1-moves-10-25.tcg-debug.json");
  });
});

function readBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result)));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsText(blob);
  });
}
