// @vitest-environment jsdom
import { asPlayerId } from "@tcg/gundam-engine";
import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import { loadMainPhaseDemo } from "../../game/fixtures/main-phase-demo.ts";
import { loadSt10DevelopmentLab } from "../../game/fixtures/st10-development-lab.ts";
import { DEV_PLAYER_ONE } from "../../game/dev-runtime.ts";
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

  it("opens the same card dossier from a named timeline entry", async () => {
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

      expect(
        dev.runtime.executeCommand(
          {
            commandID: "post-game-timeline-card-preview",
            move: "playCommand",
            prevStateID: dev.runtime.getState().ctx._stateID,
            actorRole: "player",
            args: { cardId: commandId, mode: "normal" },
          },
          asPlayerId(DEV_PLAYER_ONE),
        ).success,
      ).toBe(true);
      expect(
        dev.runtime.executeCommand(
          {
            commandID: "post-game-timeline-card-preview-concede",
            move: "concede",
            prevStateID: dev.runtime.getState().ctx._stateID,
            actorRole: "player",
            args: {},
          },
          asPlayerId(DEV_PLAYER_ONE),
        ).success,
      ).toBe(true);
      return dev;
    };

    renderSimulator(fixture);

    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: /timeline/i }));
    const namedCard = within(dialog).getByText("Nemo", { exact: true });

    expect(namedCard.tagName).toBe("SPAN");
    fireEvent.pointerEnter(namedCard, { pointerType: "mouse" });
    expect((await screen.findByTestId("card-hover-preview")).getAttribute("data-card-id")).toBe(
      namedCard.getAttribute("data-card-id"),
    );
    expect(await screen.findByRole("region", { name: "Dossier: Nemo" })).toBeTruthy();
  });
});
