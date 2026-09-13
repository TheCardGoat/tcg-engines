// @vitest-environment jsdom

import { asPlayerId } from "@tcg/gundam-engine";
import { gd01OverflowingAffection118 } from "@tcg/gundam-cards";
import { screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vite-plus/test";

import { createDevRuntime, DEV_PLAYER_ONE } from "../../game/dev-runtime.ts";
import { realMainDeckCards, realResourceCards } from "../../game/fixtures/real-cards.ts";
import { renderSimulator } from "../../test/renderSimulator.tsx";

function loadOverflowingAffectionChoice() {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [gd01OverflowingAffection118, ...realMainDeckCards(4)],
      deck: realMainDeckCards(5),
      resourceArea: realResourceCards(2),
      resourceDeck: 10,
    },
    p2: { deck: 30, resourceDeck: 10 },
  });
  const hand = dev.runtime.getState().ctx.zones.private.zoneCards[`hand:${DEV_PLAYER_ONE}`] ?? [];
  const commandId = hand.find((instanceId) => {
    const instance = dev.staticResources.cardsMaps.instances.get(instanceId);
    const definition = instance
      ? dev.staticResources.getDefinition(instance.definitionId)
      : undefined;
    return definition?.name === "Overflowing Affection";
  });
  expect(commandId).toBeDefined();

  const result = dev.runtime.executeCommand(
    {
      commandID: "focused-partition-selection",
      move: "playCommand",
      prevStateID: dev.runtime.getState().ctx._stateID,
      actorRole: "player",
      args: { cardId: commandId, mode: "normal" },
    },
    asPlayerId(DEV_PLAYER_ONE),
  );
  expect(result.success).toBe(true);
  return dev;
}

describe("Main-phase · visible hand partition selection", () => {
  it("selects the discard directly from the visible hand", async () => {
    const user = userEvent.setup();
    renderSimulator(loadOverflowingAffectionChoice);

    const prompt = screen.getByRole("region", { name: "Current effect" });
    const hand = screen.getByRole("list", { name: /your hand/i });
    const boardCard = within(hand).getAllByRole("button")[0]!;
    const confirm = within(prompt).getByRole("button", {
      name: /^confirm$/i,
    }) as HTMLButtonElement;

    expect(boardCard.getAttribute("tabindex")).not.toBeNull();
    expect(boardCard.querySelector("[data-targeting-state='candidate']")).not.toBeNull();
    expect(within(prompt).queryByRole("button", { name: /select card 1 for discard/i })).toBeNull();
    expect(confirm.disabled).toBe(true);

    await user.click(boardCard);
    expect(confirm.disabled).toBe(false);
    await user.click(confirm);

    await waitFor(() => {
      expect(screen.queryByRole("region", { name: "Current effect" })).toBeNull();
    });
  });
});
