// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { TargetingProvider } from "@tcg/simulator-ui";
import { afterEach, describe, expect, it } from "vite-plus/test";

import { CardFace } from "./CardFace.tsx";
import type { GameCardData } from "../types.ts";

const playableCard: GameCardData = {
  name: "Crossbone Gundam X-1",
  cardType: "unit",
  color: "red",
  playable: true,
};

describe("CardFace · actionable affordance", () => {
  afterEach(cleanup);

  it("exposes an accessible action state for playable cards", () => {
    const { container } = render(<CardFace card={playableCard} width={72} height={101} />);
    const card = container.querySelector<HTMLElement>("[data-actionable='true']");

    expect(card).not.toBeNull();
    expect(card!.getAttribute("aria-label")).toContain("action available");
  });

  it("does not decorate an inert card as actionable", () => {
    const { container } = render(
      <CardFace card={{ ...playableCard, playable: false }} width={72} height={101} />,
    );
    const card = container.querySelector<HTMLElement>(".gd-card-visual")!;

    expect(card.dataset.actionable).toBeUndefined();
    expect(card.getAttribute("aria-label")).not.toContain("action available");
  });

  it("suppresses unrelated action affordances while a target choice is active", () => {
    const { container } = render(
      <TargetingProvider active candidateIds={["other-card"]} role="effectTarget">
        <CardFace card={playableCard} width={72} height={101} />
      </TargetingProvider>,
    );
    const card = container.querySelector<HTMLElement>(".gd-card-visual")!;

    expect(card.dataset.actionable).toBeUndefined();
    expect(card.getAttribute("aria-label")).not.toContain("action available");
  });
});
