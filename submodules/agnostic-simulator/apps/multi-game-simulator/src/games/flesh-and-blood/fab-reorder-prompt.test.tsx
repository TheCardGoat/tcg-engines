// @vitest-environment jsdom
import { cleanup, fireEvent, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderFabSimulatorScenario } from "./testing/render-fab-simulator";

describe("FAB deck reorder prompt", () => {
  afterEach(cleanup);

  it.each([
    ["song-of-sinew-reorder", "Song of Sinew", /song of sinew/i, 4, "play"],
    [
      "sutcliffe-research-notes-reorder",
      "Sutcliffe's Research Notes",
      /sutcliffe's research notes/i,
      3,
      "play",
    ],
    ["spire-sniping-reorder", "Spire Sniping", /spire sniping/i, 2, "crosswrap"],
  ] as const)(
    "performs the authored action, shows real art, and completes the reorder on %s",
    async (scenarioId, sourceCard, sourceName, candidateCount, startAction) => {
      const session = renderFabSimulatorScenario({ scenarioId });
      await session.pom.waitForReady();
      const player = session.pom.as("player-1");

      expect(screen.queryByTestId("interaction-resolution-prompt")).toBeNull();

      if (startAction === "play") {
        expect(await player.zoneHas("hand", sourceCard)).toBe(true);
        await player.play(sourceCard);
      } else {
        expect(await player.zoneHas("head", "Skullbone Crosswrap")).toBe(true);
        expect(await player.zoneCount("arsenal")).toBe(1);
        await player.activate("Skullbone Crosswrap");

        expect(screen.queryByTestId("target-filter-modal")).toBeNull();
        const turnUpPrompt = await screen.findByTestId("interaction-resolution-prompt");
        const arsenalChoice = within(turnUpPrompt).getByRole("button", {
          name: /spire sniping/i,
        });
        fireEvent.click(arsenalChoice);
      }

      const prompt = await screen.findByTestId("interaction-resolution-prompt");
      expect(within(prompt).getByRole("button", { name: sourceName })).not.toBeNull();

      let dragHandles: HTMLElement[] = [];
      await waitFor(() => {
        dragHandles = within(prompt).getAllByRole("button", {
          name: /position \d of \d\. drag to reorder/i,
        });
        expect(dragHandles).toHaveLength(candidateCount);
        expect(prompt.querySelectorAll('img[data-art-variant="no-text"]')).toHaveLength(
          candidateCount,
        );
      });

      fireEvent.keyDown(dragHandles[0]!, { key: "ArrowRight" });
      fireEvent.click(within(prompt).getByRole("button", { name: "Confirm order" }));

      if (startAction === "play") {
        await waitFor(() => {
          expect(screen.queryByTestId("interaction-resolution-prompt")).toBeNull();
        });
        await waitFor(async () => {
          expect(await player.zoneHas("graveyard", sourceCard)).toBe(true);
        });
      } else {
        const optPrompt = await screen.findByTestId("interaction-resolution-prompt");
        expect(within(optPrompt).getByText("Skullbone Crosswrap")).not.toBeNull();
        expect(within(optPrompt).getByRole("heading", { name: "Keep on top" })).not.toBeNull();
        expect(within(optPrompt).getByRole("heading", { name: "Put on bottom" })).not.toBeNull();
        expect(optPrompt.querySelectorAll("img")).toHaveLength(1);
        const sourceName = within(optPrompt).getByRole("button", { name: "Skullbone Crosswrap" });
        fireEvent.mouseEnter(sourceName);
        await waitFor(() => {
          expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");
          expect(
            within(screen.getByTestId("fab-card-preview")).getByText("Skullbone Crosswrap"),
          ).not.toBeNull();
        });
        fireEvent.mouseLeave(sourceName);

        const optCard = optPrompt.querySelector<HTMLElement>(".fab-board-card-face-shell");
        expect(optCard).not.toBeNull();
        fireEvent.mouseEnter(optCard!);
        await waitFor(() => {
          expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");
          expect(
            within(screen.getByTestId("fab-card-preview")).queryByText("Skullbone Crosswrap"),
          ).toBeNull();
        });
        fireEvent.mouseLeave(optCard!);

        const confirmOrder = within(optPrompt).getByRole("button", { name: "Confirm order" });
        expect(confirmOrder.getAttribute("disabled")).toBeNull();
        fireEvent.click(confirmOrder);

        await waitFor(() => {
          expect(screen.queryByTestId("interaction-resolution-prompt")).toBeNull();
        });
        expect(await player.zoneCount("arsenal")).toBe(1);
        expect(await player.actionPoints()).toBe(1);
      }

      session.unmount();
    },
  );
});
