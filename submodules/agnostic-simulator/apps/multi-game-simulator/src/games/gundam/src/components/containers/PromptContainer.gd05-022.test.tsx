// @vitest-environment jsdom
import { cleanup, render, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vite-plus/test";
import { asPlayerId, type PlayerId } from "@tcg/gundam-engine";

import { GundamGameProvider, asViewerId, useInteractionView } from "../../game/index.ts";
import {
  GundamInteractionDraftProvider,
  useGundamInteractionDraft,
} from "../../game/interaction-draft.tsx";
import { DEV_PLAYER_ONE } from "../../game/dev-runtime.ts";
import { loadReleaseCardReviewLab } from "../../game/fixtures/release-card-review-labs.ts";
import { PromptContainer } from "./PromptContainer.tsx";
import { SubmitErrorProvider } from "./submit-error-context.tsx";
import { SubmitErrorToast } from "../ui/SubmitErrorToast.tsx";

afterEach(cleanup);

function ActivateHarness({ cardId }: { readonly cardId: string }) {
  const draft = useGundamInteractionDraft();
  const interactionView = useInteractionView();
  const action = interactionView.actions.find((candidate) => candidate.id === "activateAbility");
  const source = action?.inputs.find(
    (input) => input.kind === "entity-selection" && input.role === "source",
  );

  return (
    <button
      type="button"
      onClick={() => draft.begin("activateAbility", source ? { [source.id]: [cardId] } : undefined)}
    >
      Activate Gundam Schwarzette
    </button>
  );
}

function DeployHarness({ cardId }: { readonly cardId: string }) {
  const draft = useGundamInteractionDraft();

  return (
    <button type="button" onClick={() => draft.begin("deployUnit", { cardId: [cardId] })}>
      Deploy Demi Barding
    </button>
  );
}

describe("release-review-gd05-022-action shared interaction prompt", () => {
  it("selects exactly two Commands from Trash to pay the activated-effect cost", async () => {
    const dev = loadReleaseCardReviewLab("GD05-022", "action");
    const user = userEvent.setup();
    const state = dev.runtime.getState();
    const battleIds = state.ctx.zones.private.zoneCards[`battleArea:${DEV_PLAYER_ONE}`] ?? [];
    const trashIds = state.ctx.zones.private.zoneCards[`trash:${DEV_PLAYER_ONE}`] ?? [];
    const schwarzetteId = battleIds.find((instanceId) => {
      const definitionId = dev.staticResources.cardsMaps.instances.get(instanceId)?.definitionId;
      return (
        dev.staticResources.cardsMaps.definitions.get(definitionId ?? "")?.cardNumber === "GD05-022"
      );
    });
    const commandIds = trashIds.filter((instanceId) => {
      const definitionId = dev.staticResources.cardsMaps.instances.get(instanceId)?.definitionId;
      return dev.staticResources.cardsMaps.definitions.get(definitionId ?? "")?.type === "command";
    });

    expect(schwarzetteId).toBeDefined();
    expect(commandIds.length).toBeGreaterThanOrEqual(2);
    const passBlock = dev.runtime.executeCommand(
      {
        commandID: crypto.randomUUID(),
        move: "passBlock",
        prevStateID: dev.runtime.getState().ctx._stateID,
        actorRole: "player",
        args: {},
      },
      asPlayerId(DEV_PLAYER_ONE) as PlayerId,
    );
    expect(
      passBlock.success,
      JSON.stringify({ passBlock, status: dev.runtime.getState().ctx.status }),
    ).toBe(true);

    const view = render(
      <SubmitErrorProvider>
        <GundamGameProvider
          runtime={dev.runtime}
          staticResources={dev.staticResources}
          viewerId={asViewerId(DEV_PLAYER_ONE)}
        >
          <GundamInteractionDraftProvider>
            <ActivateHarness cardId={schwarzetteId!} />
            <PromptContainer />
            <SubmitErrorToast />
          </GundamInteractionDraftProvider>
        </GundamGameProvider>
      </SubmitErrorProvider>,
    );

    await user.click(view.getByRole("button", { name: "Activate Gundam Schwarzette" }));
    await user.click(view.getByRole("radio", { name: /Exile 2 Command cards/i }));
    await user.click(view.getByRole("button", { name: "Choose card" }));

    const choices = within(view.getByLabelText("Available choices"))
      .getAllByRole("button")
      .filter((button) => button.querySelector("[data-sim-entity-id]") !== null);
    expect(view.getByLabelText("Current action").textContent).toContain("Activate Ability");
    expect(view.getByText("Select cards to pay the activation cost.")).toBeTruthy();
    expect(view.container.textContent).not.toMatch(/gundam\.(move|input)\./);
    expect(choices).toHaveLength(2);
    await user.click(choices[0]!);
    await user.click(choices[1]!);
    await user.click(view.getAllByRole("button", { name: "Confirm" })[0]!);

    await waitFor(() => {
      const removalIds = dev.runtime.getState().ctx.zones.private.zoneCards.removalArea ?? [];
      expect(commandIds.filter((id) => removalIds.includes(id))).toHaveLength(2);
    });
    dev.bot?.dispose();
  });

  it("shows GD05-025's interaction-authorized deck reveal face-up", async () => {
    const dev = loadReleaseCardReviewLab("GD05-025", "deploy");
    const user = userEvent.setup();
    const handIds =
      dev.runtime.getState().ctx.zones.private.zoneCards[`hand:${DEV_PLAYER_ONE}`] ?? [];
    const demiBardingId = handIds.find((instanceId) => {
      const definitionId = dev.staticResources.cardsMaps.instances.get(instanceId)?.definitionId;
      return (
        dev.staticResources.cardsMaps.definitions.get(definitionId ?? "")?.cardNumber === "GD05-025"
      );
    });

    expect(demiBardingId).toBeDefined();

    const view = render(
      <SubmitErrorProvider>
        <GundamGameProvider
          runtime={dev.runtime}
          staticResources={dev.staticResources}
          viewerId={asViewerId(DEV_PLAYER_ONE)}
        >
          <GundamInteractionDraftProvider>
            <DeployHarness cardId={demiBardingId!} />
            <PromptContainer />
          </GundamInteractionDraftProvider>
        </GundamGameProvider>
      </SubmitErrorProvider>,
    );

    await user.click(view.getByRole("button", { name: "Deploy Demi Barding" }));

    await waitFor(() => {
      const revealedCards = view.container.querySelectorAll("[data-revealed-card-id]");
      expect(revealedCards).toHaveLength(3);
      for (const card of revealedCards) {
        if (!(card instanceof HTMLElement)) throw new Error("Expected an HTML revealed-card node");
        expect(card.querySelector("[data-card-id]")).not.toBeNull();
        expect(within(card).queryByRole("img", { name: "Face-down card" })).toBeNull();
      }
    });
    dev.bot?.dispose();
  });
});
