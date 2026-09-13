// @vitest-environment jsdom
import { HeadlessMantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { SimulatorDebugExportV1 } from "@tcg/game-page-contract/debug-export";

import {
  EMPTY_SIMULATOR_ROUTE_CONTEXT,
  SimulatorRouteContextProvider,
} from "../providers/route-context";
import { SimulatorDebugExportControl } from "./SimulatorDebugExportControl";
import {
  SimulatorDebugExportProvider,
  useRegisterSimulatorDebugExportSource,
  type SimulatorDebugExportSource,
} from "./SimulatorDebugExportContext";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const fixture: SimulatorDebugExportV1 = {
  schemaVersion: 1,
  exportedAt: "2026-08-31T12:00:00.000Z",
  environment: "test",
  game: { slug: "naruto", gameId: "local-1", matchId: "local-1", seed: "7" },
  range: {
    startMove: 1,
    endMove: 2,
    startStateVersion: 1,
    endStateVersion: 2,
    totalMoves: 2,
  },
  originalInitialState: { turn: 0 },
  stateBeforeRange: { turn: 0 },
  moves: [
    {
      index: 1,
      stateVersion: 1,
      turnNumber: 1,
      actorId: "p1",
      moveId: "MULLIGAN",
      timestamp: 100,
    },
    {
      index: 2,
      stateVersion: 2,
      turnNumber: 1,
      actorId: "p2",
      moveId: "MULLIGAN",
      timestamp: 200,
    },
  ],
  domainEvents: [],
  warnings: [],
};

function RegisterSource({ source }: { readonly source: SimulatorDebugExportSource }) {
  useRegisterSimulatorDebugExportSource(source);
  return null;
}

describe("SimulatorDebugExportControl", () => {
  it("loads the complete range and copies a selected inclusive range", async () => {
    const load = vi.fn(async () => fixture);
    const writeText = vi.fn(async (_text: string) => undefined);
    Object.defineProperty(globalThis.navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(
      <HeadlessMantineProvider>
        <SimulatorRouteContextProvider
          value={{
            ...EMPTY_SIMULATOR_ROUTE_CONTEXT,
            gameSlug: "naruto",
            routeKind: "practice-vs-ai",
          }}
        >
          <SimulatorDebugExportProvider>
            <RegisterSource source={{ load }} />
            <SimulatorDebugExportControl />
          </SimulatorDebugExportProvider>
        </SimulatorRouteContextProvider>
      </HeadlessMantineProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Export simulator debug history" }));
    expect(await screen.findByText("2 accepted moves available.")).not.toBeNull();
    expect(load).toHaveBeenCalledWith({});

    fireEvent.click(screen.getByText("Copy JSON").closest("button")!);
    await waitFor(() => expect(writeText).toHaveBeenCalledOnce());
    expect(load).toHaveBeenLastCalledWith({ startMove: 1, endMove: 2 });
    expect(screen.getByText("JSON copied to clipboard.")).not.toBeNull();
  });

  it("reuses one serialized payload for copy and download of the same range", async () => {
    let exportNumber = 0;
    const load = vi.fn(async () => ({
      ...fixture,
      exportedAt: `2026-08-31T12:00:0${exportNumber++}.000Z`,
    }));
    const writeText = vi.fn(async (_text: string) => undefined);
    Object.defineProperty(globalThis.navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    let downloadedBlob: Blob | undefined;
    const createObjectURL = vi.fn((blob: Blob) => {
      downloadedBlob = blob;
      return "blob:debug-export";
    });
    const revokeObjectURL = vi.fn();
    Object.defineProperty(globalThis.URL, "createObjectURL", {
      configurable: true,
      value: createObjectURL,
    });
    Object.defineProperty(globalThis.URL, "revokeObjectURL", {
      configurable: true,
      value: revokeObjectURL,
    });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);

    render(
      <HeadlessMantineProvider>
        <SimulatorRouteContextProvider
          value={{
            ...EMPTY_SIMULATOR_ROUTE_CONTEXT,
            gameSlug: "naruto",
            routeKind: "practice-vs-ai",
          }}
        >
          <SimulatorDebugExportProvider>
            <RegisterSource source={{ load }} />
            <SimulatorDebugExportControl />
          </SimulatorDebugExportProvider>
        </SimulatorRouteContextProvider>
      </HeadlessMantineProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Export simulator debug history" }));
    expect(await screen.findByText("2 accepted moves available.")).not.toBeNull();

    fireEvent.click(screen.getByText("Copy JSON").closest("button")!);
    await waitFor(() => expect(writeText).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByText("Download").closest("button")!);
    await waitFor(() => expect(createObjectURL).toHaveBeenCalledOnce());

    expect(load).toHaveBeenCalledTimes(2);
    const downloadedText = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => {
        if (typeof reader.result !== "string") {
          reject(new Error("Downloaded debug export was not text."));
          return;
        }
        resolve(reader.result);
      };
      reader.readAsText(downloadedBlob!);
    });
    expect(downloadedText).toBe(writeText.mock.calls[0]?.[0]);
  });
});
