// @vitest-environment jsdom
import { asPlayerId } from "@tcg/gundam-engine";
import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import { loadMainPhaseDemo } from "../../game/fixtures/main-phase-demo.ts";
import { renderSimulator } from "../../test/renderSimulator.tsx";

describe("post-game match timeline", () => {
  it("shows the structured game log instead of an empty timeline", async () => {
    const fixture = () => {
      const dev = loadMainPhaseDemo();
      const result = dev.runtime.executeCommand(
        {
          commandID: "post-game-timeline-concede",
          move: "concede",
          prevStateID: dev.runtime.getState().ctx._stateID,
          actorRole: "player",
          args: {},
        },
        asPlayerId("player_one"),
      );
      expect(result.success).toBe(true);
      return dev;
    };

    renderSimulator(fixture);

    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: /timeline/i }));

    expect(within(dialog).queryByText(/no data/i)).toBeNull();
    expect(within(dialog).getByText(/game ended: concede/i)).toBeTruthy();
  });
});
