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
import { gd01UnicornGundamDestroyMode002 } from "@tcg/gundam-cards";

import { GundamGameProvider, asViewerId, usePending } from "../../game/index.ts";
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
  const pending = usePending();
  const firstStep = pending.state.status === "collecting" ? pending.state.steps[0] : undefined;
  const canChooseDestroyTarget =
    firstStep?.kind === "selectTarget" && firstStep.candidateIds.includes(destroyTargetId);

  return (
    <>
      <button type="button" onClick={() => pending.startForCard("deployUnit", cardId)}>
        Deploy Destroy Mode
      </button>
      {canChooseDestroyTarget ? (
        <button type="button" onClick={() => pending.provideTarget(firstStep, destroyTargetId)}>
          Destroy Unicorn Mode
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
          <AlternateDeployHarness cardId={destroyModeId} destroyTargetId={unicornModeId} />
          <PromptContainer />
        </GundamGameProvider>
      </SubmitErrorProvider>,
    );

    await user.click(view.getByRole("button", { name: "Deploy Destroy Mode" }));
    await user.click(view.getByTestId("game-prompt-mode-alternate"));
    await user.click(view.getByRole("button", { name: "Destroy Unicorn Mode" }));

    await waitFor(() => {
      expect(p1.getCardZone(unicornModeId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(banagherId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(destroyModeId)).toBe(`battleArea:${PLAYER_ONE}`);
    });
  });
});
