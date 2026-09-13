// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { isSimulatorAudioDebugEnabled, simulatorAudioDebug } from "./debug";

describe("simulator audio diagnostics", () => {
  afterEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, "", "/");
    vi.restoreAllMocks();
  });

  it("stays silent unless explicitly enabled", () => {
    const debug = vi.spyOn(console, "debug").mockImplementation(() => undefined);

    simulatorAudioDebug("played", { cue: "card.play" });

    expect(isSimulatorAudioDebugEnabled()).toBe(false);
    expect(debug).not.toHaveBeenCalled();
  });

  it("reports cue activity when enabled for a QA session", () => {
    window.localStorage.setItem("tcg:audioDebug", "1");
    const debug = vi.spyOn(console, "debug").mockImplementation(() => undefined);

    simulatorAudioDebug("played", { cue: "card.play" });

    expect(isSimulatorAudioDebugEnabled()).toBe(true);
    expect(debug).toHaveBeenCalledWith("[sim-audio] played", { cue: "card.play" });
  });
});
