// @vitest-environment jsdom

import { fireEvent, render } from "@testing-library/svelte";
import { describe, expect, test, vi } from "vite-plus/test";
import type { LorcanaCardSnapshot } from "../src/lib/features/simulator/model/contracts.js";

const setExternalPreviewCard = vi.fn();
const staticSnapshot: LorcanaCardSnapshot = {
  cardId: "instance-powerline",
  definitionId: "008-143",
  label: "Powerline - Musical Superstar",
  ownerId: "player-one",
  ownerSide: "playerOne",
  zoneId: "play",
  isMasked: false,
  facePresentation: "faceUp",
  inkType: ["ruby"],
  set: "8",
  cardNumber: 143,
};

vi.mock("@/features/simulator/context/simulator-card-context.svelte.js", () => ({
  maybeUseSimulatorCardContext: () => ({ setExternalPreviewCard }),
}));

vi.mock("@/features/simulator/context/game-context.svelte.js", () => ({
  maybeUseLorcanaSidebarPresenter: () => ({
    resolveStaticCardSnapshot: () => staticSnapshot,
    resolveCardName: () => staticSnapshot.label,
  }),
}));

describe("CardLogToken", () => {
  test("previews the static card snapshot even when the log supplies a fallback label", async () => {
    const { default: CardLogToken } =
      await import("../src/lib/features/simulator/panels/CardLogToken.svelte");
    const view = render(CardLogToken, {
      props: {
        cardId: staticSnapshot.cardId,
        fallbackLabel: staticSnapshot.label,
        fallbackInkType: staticSnapshot.inkType,
      },
    });

    const token = view.container.querySelector('[role="log"]');
    expect(token).not.toBeNull();

    await fireEvent.mouseEnter(token!);

    expect(setExternalPreviewCard).toHaveBeenCalledWith(staticSnapshot);
  });
});
