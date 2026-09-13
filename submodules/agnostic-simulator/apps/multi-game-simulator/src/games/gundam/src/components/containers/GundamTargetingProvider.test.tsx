// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources } from "@tcg/gundam-engine";
import {
  gd02ZetaGundam069,
  st10GundamBarbatos4thForm007,
  st10MarkGuilder012,
  st10PhoenixGundamPowerUnleashedEx006,
} from "@tcg/gundam-cards";

import { GundamGameProvider, asViewerId, useInteractionView } from "../../game/index.ts";
import {
  GundamInteractionDraftProvider,
  useGundamInteractionDraft,
} from "../../game/interaction-draft.tsx";
import { useLinkTargetPreview } from "../ui/link-target-preview-context.tsx";
import { GundamTargetingProvider } from "./GundamTargetingProvider.tsx";
import { PromptContainer } from "./PromptContainer.tsx";
import { SubmitErrorProvider } from "./submit-error-context.tsx";

afterEach(cleanup);

function PairingHarness({ pilotId }: { readonly pilotId: string }) {
  const draft = useGundamInteractionDraft();
  const interactionView = useInteractionView();
  const preview = useLinkTargetPreview();
  const sourceInput = interactionView.actions
    .find((action) => action.id === "assignPilot")
    ?.inputs.find((input) => input.kind === "entity-selection" && input.role === "source");

  return (
    <>
      <button
        type="button"
        onClick={() =>
          draft.begin("assignPilot", sourceInput ? { [sourceInput.id]: [pilotId] } : undefined)
        }
      >
        Pair Mark
      </button>
      <output data-testid="link-candidate-ids">
        {[...preview.linkCandidateIds].sort().join(",")}
      </output>
      <PromptContainer />
    </>
  );
}

describe("GundamTargetingProvider · Link target preview", () => {
  it("marks only the eligible Unit whose Link Condition the selected Pilot meets", async () => {
    const user = userEvent.setup();
    const engine = GundamTestEngine.create({
      hand: [st10MarkGuilder012],
      play: [st10PhoenixGundamPowerUnleashedEx006, st10GundamBarbatos4thForm007, gd02ZetaGundam069],
      resourceArea: activeResources(8),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const pilotId = p1.getHand()[0]!;
    const [phoenixId, barbatosId, zetaId] = p1.getCardsInZone("battleArea");

    const view = render(
      <SubmitErrorProvider>
        <GundamGameProvider
          runtime={engine.getRuntime()}
          staticResources={engine.getRuntime().getStaticResources()}
          viewerId={asViewerId(PLAYER_ONE)}
        >
          <GundamInteractionDraftProvider>
            <GundamTargetingProvider>
              <PairingHarness pilotId={pilotId} />
            </GundamTargetingProvider>
          </GundamInteractionDraftProvider>
        </GundamGameProvider>
      </SubmitErrorProvider>,
    );

    await user.click(view.getByRole("button", { name: "Pair Mark" }));

    expect(view.getByTestId("link-candidate-ids").textContent).toBe(
      [phoenixId, barbatosId].sort().join(","),
    );
    expect(view.getByTestId("link-candidate-ids").textContent).not.toContain(zetaId);
  });
});
