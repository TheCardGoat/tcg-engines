// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { TargetingProvider } from "@tcg/simulator-ui";
import { describe, expect, it, vi } from "vite-plus/test";

import type { GameCardData } from "../types.ts";
import { BaseSection } from "./BaseSection.tsx";

const establishedBase: GameCardData = {
  id: "established-base",
  name: "Established Base",
  cardType: "base",
  hp: 3,
};

const incomingBase: GameCardData = {
  id: "incoming-base",
  name: "Incoming Base",
  cardType: "base",
  hp: 5,
};

describe("BaseSection target selection", () => {
  it("makes an empty base section explicit instead of leaving an unlabeled placeholder", () => {
    render(<BaseSection cards={[]} label="Your base section" isTop={false} compact />);

    expect(screen.getByText("NO BASE")).not.toBeNull();
  });

  it("renders only the legal existing Base as an interactive excess-management target", () => {
    const onCardClick = vi.fn();
    render(
      <TargetingProvider active candidateIds={[establishedBase.id!]} role="effectTarget">
        <BaseSection
          cards={[establishedBase, incomingBase]}
          label="Your base section"
          isTop={false}
          selectedCardIds={[]}
          highlightCardIds={[establishedBase.id!]}
          onCardClick={onCardClick}
        />
      </TargetingProvider>,
    );

    const established = screen.getByRole("button", { name: establishedBase.name });
    expect(established.dataset.targetingState).toBe("candidate");
    expect(screen.queryByRole("button", { name: incomingBase.name })).toBeNull();
    expect(screen.getAllByRole("listitem")[0]?.style.zIndex).toBe("3");
    expect(screen.getAllByRole("listitem")[1]?.style.zIndex).toBe("2");

    fireEvent.click(established);
    expect(onCardClick).toHaveBeenCalledWith(establishedBase.id);
  });
});
