import type { BrowserTransportConfig } from "@tcg/lorcana-engine/testing";
import { normalizeBrowserTransportConfig } from "@tcg/lorcana-engine/testing";
import type {
  LorcanaSimulatorFixture,
  LorcanaSimulatorView,
} from "@/features/simulator/model/contracts.js";
import {
  getLorcanaFixture,
  LORCANA_SIMULATOR_FIXTURES,
} from "@/features/simulator-devtools/fixtures";
import { decodeInlineFixtureParam, deserializeInlineFixture } from "./browser-fixture";
import {
  LORCANA_HARNESS_DEFAULT_BROWSER_TRANSPORT,
  LORCANA_HARNESS_DEFAULT_FIXTURE_ID,
  LORCANA_HARNESS_DEFAULT_VIEW,
} from "./browser-harness";

export interface LorcanaBrowserRouteState {
  browserTransport: BrowserTransportConfig;
  fixture: LorcanaSimulatorFixture;
  fixtureId: string;
  view: LorcanaSimulatorView;
}

export function normalizeView(value: string | null): LorcanaSimulatorView {
  return value === "playerOne" ||
    value === "playerTwo" ||
    value === "spectator" ||
    value === "authoritative"
    ? value
    : LORCANA_HARNESS_DEFAULT_VIEW;
}

export function normalizeFixtureId(value: string | null): string {
  const candidate = value?.trim();
  if (!candidate) {
    return LORCANA_HARNESS_DEFAULT_FIXTURE_ID;
  }

  return candidate in LORCANA_SIMULATOR_FIXTURES ? candidate : LORCANA_HARNESS_DEFAULT_FIXTURE_ID;
}

function normalizeTransportMode(value: string | null): BrowserTransportConfig["mode"] {
  return value === "async" ? "async" : LORCANA_HARNESS_DEFAULT_BROWSER_TRANSPORT.mode;
}

function parseLatencyMs(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function normalizeLatencyModel(value: string | null): BrowserTransportConfig["latencyModel"] {
  return value === "one-way" || value === "rtt" ? value : undefined;
}

export function resolveBrowserTransportConfig(url: URL): BrowserTransportConfig {
  const transportParam = url.searchParams.get("transport");
  if (!transportParam) {
    return { ...LORCANA_HARNESS_DEFAULT_BROWSER_TRANSPORT };
  }

  const mode = normalizeTransportMode(transportParam);
  if (mode === "sync") {
    return { mode: "sync" };
  }

  return normalizeBrowserTransportConfig({
    mode,
    latencyMs: parseLatencyMs(url.searchParams.get("latencyMs")),
    latencyModel: normalizeLatencyModel(url.searchParams.get("latencyModel")),
  });
}

export function resolveBrowserRouteState(url: URL): LorcanaBrowserRouteState {
  const browserTransport = resolveBrowserTransportConfig(url);
  const view = normalizeView(url.searchParams.get("view"));
  const fixtureId = normalizeFixtureId(url.searchParams.get("fixtureId"));
  const parsedFixture = decodeInlineFixtureParam(url.searchParams.get("fixture"));
  const fixture = parsedFixture
    ? deserializeInlineFixture(parsedFixture)
    : getLorcanaFixture(fixtureId);

  return {
    browserTransport,
    fixture,
    fixtureId: parsedFixture?.id ?? fixture.id ?? fixtureId,
    view,
  };
}
