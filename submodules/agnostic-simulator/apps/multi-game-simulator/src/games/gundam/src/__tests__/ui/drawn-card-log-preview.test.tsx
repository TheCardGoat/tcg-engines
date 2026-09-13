// @vitest-environment jsdom
import { asPlayerId } from "@tcg/gundam-engine";
import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import { DEV_PLAYER_ONE } from "../../game/dev-runtime.ts";
import { loadSt10DevelopmentLab } from "../../game/fixtures/st10-development-lab.ts";
import { renderSimulator } from "../../test/renderSimulator.tsx";

describe("Gundam event log card previews", () => {
  it("opens a card dossier when the player hovers a visible drawn-card name", async () => {
    const fixture = () => {
      const dev = loadSt10DevelopmentLab();
      const hand =
        dev.runtime.getState().ctx.zones.private.zoneCards[`hand:${DEV_PLAYER_ONE}`] ?? [];
      const commandId = hand.find((instanceId) => {
        const instance = dev.staticResources.cardsMaps.instances.get(instanceId);
        const definition = instance
          ? dev.staticResources.getDefinition(instance.definitionId)
          : undefined;
        return definition?.name === "Unlocking the Development Diagram";
      });
      expect(commandId).toBeDefined();

      const result = dev.runtime.executeCommand(
        {
          commandID: "drawn-card-log-preview",
          move: "playCommand",
          prevStateID: dev.runtime.getState().ctx._stateID,
          actorRole: "player",
          args: { cardId: commandId, mode: "normal" },
        },
        asPlayerId(DEV_PLAYER_ONE),
      );
      expect(result.success).toBe(true);
      return dev;
    };

    renderSimulator(fixture);

    const eventLog = await screen.findByRole("region", { name: "Event log" });
    const drawnCard = within(eventLog).getByText("Nemo", { exact: true });
    expect(drawnCard.tagName).toBe("SPAN");
    expect(drawnCard.getAttribute("data-card-id")).toBeTruthy();

    fireEvent.pointerEnter(drawnCard, { pointerType: "mouse" });

    expect((await screen.findByTestId("card-hover-preview")).getAttribute("data-card-id")).toBe(
      drawnCard.getAttribute("data-card-id"),
    );
    expect(await screen.findByRole("region", { name: "Dossier: Nemo" })).toBeTruthy();
  });
});
