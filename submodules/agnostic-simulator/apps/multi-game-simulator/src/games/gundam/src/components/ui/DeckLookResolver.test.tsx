// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { DeckLookResolver } from "./DeckLookResolver.tsx";
import type { PendingEffect } from "./types.ts";

afterEach(cleanup);

describe("DeckLookResolver random-bottom interaction", () => {
  it("asks only for the optional tutor and explains that the engine randomizes the rest", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const effect: PendingEffect = {
      id: "gd04-random-look",
      source: { name: "Encounter" },
      title: "Reveal a Pilot and return the rest randomly to the bottom.",
      kind: "deck-look",
      deckLook: {
        directiveIndex: 0,
        returnMode: "chooseTop",
        randomizeRemainingToBottom: true,
        tutorDestination: "hand",
        revealed: [
          { id: "pilot", name: "Chosen Pilot", cardType: "pilot" },
          { id: "unit", name: "Remaining Unit", cardType: "unit" },
        ],
        legalTutorIds: ["pilot"],
      },
    };
    const view = render(
      <DeckLookResolver effect={effect} onConfirm={onConfirm} onCancel={() => undefined} />,
    );

    expect(view.getByText("REMAINING CARDS WILL BE RANDOMIZED TO THE BOTTOM")).toBeTruthy();
    expect(view.queryByRole("button", { name: "TOP" })).toBeNull();
    expect(view.queryByRole("button", { name: "BOTTOM" })).toBeNull();

    await user.click(view.getByTestId("deck-look-action-pilot-HAND"));
    await user.click(view.getByTestId("deck-look-confirm"));

    expect(onConfirm).toHaveBeenCalledWith({
      directiveIndex: 0,
      tutorCardId: "pilot",
      toTop: [],
      toBottom: [],
      toTrash: [],
    });
  });
});
