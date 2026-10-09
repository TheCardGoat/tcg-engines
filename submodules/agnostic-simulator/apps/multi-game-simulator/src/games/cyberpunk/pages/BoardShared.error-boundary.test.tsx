// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import type { PlayerPrompt } from "@tcg/cyberpunk-engine";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { getScenario } from "../engine";
import { P1 } from "../engine/fixtures/scenarios";
import { BoardSharedPage } from "./BoardShared.page";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("renders an owned diagnostic when a mandatory interaction view cannot be built", () => {
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  const engine = getScenario("openingMain").build();
  const impossiblePrompt: PlayerPrompt = {
    status: "choice",
    availableMoves: [],
    choice: {
      type: "chooseTarget",
      chooserId: P1,
      payload: {
        type: "effectTarget",
        targetKind: "card",
        min: 1,
        max: 1,
        eligibleIds: [],
        canDecline: false,
      },
    },
  };
  vi.spyOn(engine, "getPrompt").mockReturnValue(impossiblePrompt);

  render(
    <MantineProvider env="test">
      <BoardSharedPage
        initialEngineBuilder={() => engine}
        initialAi={{ player: null, opponent: null }}
        initialAiMode="step"
      />
    </MantineProvider>,
  );

  expect(screen.getByRole("alert").textContent).toContain("Cyberpunk board unavailable");
  expect(screen.getByRole("alert").textContent).toContain(
    'interaction input "targetIds" requires 1 selections but has 0 enabled candidates',
  );
  expect(screen.getByRole("button", { name: "Reload board" })).toBeTruthy();
});
