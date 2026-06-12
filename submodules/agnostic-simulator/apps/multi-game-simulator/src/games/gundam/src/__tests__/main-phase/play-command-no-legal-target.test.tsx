// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import {
  loadNoLegalTargetEmptyDemo,
  loadNoLegalTargetOffBoardOnlyDemo,
  loadNoLegalTargetToughOnlyDemo,
} from "../../game/fixtures/no-legal-target-command-demo.ts";

/**
 * Rule 10-1-8-1-1 — a Command card that requires choosing a target
 * cannot be played when no legal target exists. The simulator hint
 * pipeline (engine `enumerateCandidates` → `selectableCardIds` →
 * `useCardLegality`) must mark such a card as `disabled`, never
 * `playable`, and clicking it must be a no-op.
 *
 * Hawk of Endymion (ST04-013): "Choose 1 enemy Unit with 3 or less HP."
 */
describe("Main-phase · Command with no legal target · rule 10-1-8-1-1", () => {
  it("Hawk of Endymion is disabled when the opponent has no units on the field", async () => {
    const user = userEvent.setup();
    renderSimulator(loadNoLegalTargetEmptyDemo);

    const hand = screen.getByRole("list", { name: /your hand/i });
    const hawkItem = within(hand).getByRole("listitem", { name: /Hawk of Endymion/i });

    await user.click(screen.getByRole("button", { name: /open match panel/i }));
    expect(screen.queryByTestId("interaction-card:playCommand")).toBeNull();

    expect(screen.queryByRole("button", { name: /^confirm$/i, hidden: true })).toBeNull();
    await user.click(hawkItem);
    await Promise.resolve();
    await Promise.resolve();
    expect(screen.queryByRole("button", { name: /^confirm$/i, hidden: true })).toBeNull();

    // Card stayed in hand.
    expect(within(hand).getByRole("listitem", { name: /Hawk of Endymion/i })).toBeDefined();
  });

  it("Hawk of Endymion is disabled when the only enemy unit has more than 3 HP", async () => {
    const user = userEvent.setup();
    renderSimulator(loadNoLegalTargetToughOnlyDemo);

    const hand = screen.getByRole("list", { name: /your hand/i });
    const hawkItem = within(hand).getByRole("listitem", { name: /Hawk of Endymion/i });

    await user.click(screen.getByRole("button", { name: /open match panel/i }));
    expect(screen.queryByTestId("interaction-card:playCommand")).toBeNull();

    expect(screen.queryByRole("button", { name: /^confirm$/i, hidden: true })).toBeNull();
    await user.click(hawkItem);
    await Promise.resolve();
    await Promise.resolve();
    expect(screen.queryByRole("button", { name: /^confirm$/i, hidden: true })).toBeNull();

    expect(within(hand).getByRole("listitem", { name: /Hawk of Endymion/i })).toBeDefined();
  });

  // Live-game regression: opponent has HP≤3 Units in shields/trash but none
  // on the field. The pre-fix `cardMatchesFilter` had no implicit-zone
  // default for `cardType: "unit"`, so the filter leaked off-board copies
  // into the candidate pool — Hawk lit up as playable, the click went
  // through, and the player got stuck on a pending effect with no
  // clickable target.
  it("Hawk of Endymion is disabled when matching enemy units sit only in shields/trash", async () => {
    const user = userEvent.setup();
    renderSimulator(loadNoLegalTargetOffBoardOnlyDemo);

    const hand = screen.getByRole("list", { name: /your hand/i });
    const hawkItem = within(hand).getByRole("listitem", { name: /Hawk of Endymion/i });

    await user.click(screen.getByRole("button", { name: /open match panel/i }));
    expect(screen.queryByTestId("interaction-card:playCommand")).toBeNull();

    expect(screen.queryByRole("button", { name: /^confirm$/i, hidden: true })).toBeNull();
    await user.click(hawkItem);
    await Promise.resolve();
    await Promise.resolve();
    expect(screen.queryByRole("button", { name: /^confirm$/i, hidden: true })).toBeNull();

    expect(within(hand).getByRole("listitem", { name: /Hawk of Endymion/i })).toBeDefined();
  });
});
