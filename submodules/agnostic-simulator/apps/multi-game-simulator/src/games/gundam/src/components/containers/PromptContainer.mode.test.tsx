// @vitest-environment jsdom
import { cleanup, render, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import {
  gd01UnicornGundamDestroyMode002,
  st10UnlockingTheDevelopmentDiagram014,
} from "@tcg/gundam-cards";

import { GundamGameProvider, asViewerId } from "../../game/index.ts";
import {
  GundamInteractionDraftProvider,
  useGundamInteractionDraft,
} from "../../game/interaction-draft.tsx";
import { PromptContainer } from "./PromptContainer.tsx";
import { SubmitErrorProvider } from "./submit-error-context.tsx";

afterEach(cleanup);

function AlternateDeployHarness({
  cardId,
  destroyTargetId,
}: {
  readonly cardId: string;
  readonly destroyTargetId: string;
}) {
  const draft = useGundamInteractionDraft();
  const canChooseDestroyTarget = draft.candidateIds.has(destroyTargetId);

  return (
    <>
      <button type="button" onClick={() => draft.begin("deployUnit", { cardId: [cardId] })}>
        Deploy Destroy Mode
      </button>
      {canChooseDestroyTarget ? (
        <button type="button" onClick={() => draft.toggleEntity(draft.input!.id, destroyTargetId)}>
          Destroy Unicorn Mode
        </button>
      ) : null}
    </>
  );
}

function AlternateCommandHarness({
  cardId,
  discardId,
}: {
  readonly cardId: string;
  readonly discardId: string;
}) {
  const draft = useGundamInteractionDraft();
  const canChooseDiscard = draft.candidateIds.has(discardId);

  return (
    <>
      <button type="button" onClick={() => draft.begin("playCommand", { cardId: [cardId] })}>
        Play Unlocking
      </button>
      {canChooseDiscard ? (
        <button type="button" onClick={() => draft.toggleEntity(draft.input!.id, discardId)}>
          Discard Generation Unit
        </button>
      ) : null}
    </>
  );
}

describe("PromptContainer selectMode binding", () => {
  it("lets a player choose GD01-002's named alternate mode and complete the staged deploy", async () => {
    const user = userEvent.setup();
    const unicornMode = createMockUnit({
      name: "Unicorn Gundam (Unicorn Mode)",
      level: 5,
      linkCondition: "[Banagher Links]",
    });
    const banagher = createMockPilot({ name: "Banagher Links", level: 0, cost: 0 });
    const engine = GundamTestEngine.create({
      hand: [gd01UnicornGundamDestroyMode002, banagher],
      play: [unicornMode],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const destroyModeId = p1.getHand()[0]!;
    const banagherId = p1.getHand()[1]!;
    const unicornModeId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(banagherId, unicornModeId));
    const view = render(
      <SubmitErrorProvider>
        <GundamGameProvider
          runtime={engine.getRuntime()}
          staticResources={engine.getRuntime().getStaticResources()}
          viewerId={asViewerId(PLAYER_ONE)}
        >
          <GundamInteractionDraftProvider>
            <AlternateDeployHarness cardId={destroyModeId} destroyTargetId={unicornModeId} />
            <PromptContainer />
          </GundamInteractionDraftProvider>
        </GundamGameProvider>
      </SubmitErrorProvider>,
    );

    await user.click(view.getByRole("button", { name: "Deploy Destroy Mode" }));
    await user.click(view.getByRole("radio", { name: /When playing this card/i }));
    await user.click(view.getByRole("button", { name: "Destroy Unicorn Mode" }));

    await waitFor(() => {
      expect(p1.getCardZone(unicornModeId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(banagherId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(destroyModeId)).toBe(`battleArea:${PLAYER_ONE}`);
    });
  });

  it("lets a player choose ST10-014's alternate Command cost and discard its required Unit", async () => {
    const user = userEvent.setup();
    const discard = createMockUnit({ name: "Generation Unit", traits: ["g generation"] });
    const engine = GundamTestEngine.create({
      hand: [st10UnlockingTheDevelopmentDiagram014, discard],
      resourceArea: activeResources(4),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [commandId, discardId] = p1.getHand();
    const view = render(
      <SubmitErrorProvider>
        <GundamGameProvider
          runtime={engine.getRuntime()}
          staticResources={engine.getRuntime().getStaticResources()}
          viewerId={asViewerId(PLAYER_ONE)}
        >
          <GundamInteractionDraftProvider>
            <AlternateCommandHarness cardId={commandId!} discardId={discardId!} />
            <PromptContainer />
          </GundamInteractionDraftProvider>
        </GundamGameProvider>
      </SubmitErrorProvider>,
    );

    await user.click(view.getByRole("button", { name: "Play Unlocking" }));
    expect(view.getByRole("radio", { name: "Alternate · Lv. 2 / Cost 2" })).toBeTruthy();
    expect(view.queryByRole("button", { name: "Choose none" })).toBeNull();
    await user.click(view.getByRole("radio", { name: "Alternate · Lv. 2 / Cost 2" }));
    await user.click(view.getByRole("button", { name: "Discard Generation Unit" }));

    await waitFor(() => {
      expect(p1.getCardZone(commandId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(discardId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
      expect(p1.getHand()).toHaveLength(2);
    });
  });
});
