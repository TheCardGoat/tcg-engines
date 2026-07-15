// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { ResolveBar } from "../ui/PendingEffects.tsx";
import type { PendingEffect } from "../ui/types.ts";
import { pendingOrderingOptions } from "./PendingEffectsContainer.tsx";

afterEach(cleanup);

describe("pending effect ordering", () => {
  it("lets the player choose the second pending effect instead of auto-resolving the head", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const effect: PendingEffect = {
      id: "first-effect",
      source: { name: "Pending effects" },
      title: "Choose which pending effect to resolve next.",
      kind: "choose-one",
      chooseOptions: pendingOrderingOptions(
        [
          { effectId: "first-effect", label: "Destined Battle: Add this card to your hand." },
          { effectId: "second-effect", label: "Pala Sys: Add this card to your hand." },
        ],
        onSelect,
      ),
    };
    const view = render(
      <ResolveBar
        effect={effect}
        onAccept={() => undefined}
        onDecline={() => undefined}
        onExpand={() => undefined}
      />,
    );

    await user.click(
      view.getByRole("button", { name: "Choose Pala Sys: Add this card to your hand." }),
    );

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith("second-effect");
  });
});
