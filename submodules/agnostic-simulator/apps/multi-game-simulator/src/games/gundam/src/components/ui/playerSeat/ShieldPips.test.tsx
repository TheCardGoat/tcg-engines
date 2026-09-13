// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";

import { ShieldPips } from "./ShieldPips.tsx";

describe("ShieldPips", () => {
  afterEach(cleanup);

  it("renders damage counters on damaged shield pips without revealing identity", () => {
    const { getByRole, getByTestId, getAllByRole, queryByText } = render(
      <ShieldPips
        value={2}
        max={6}
        low={false}
        listLabel="Your shields"
        shields={[
          { id: "shield-1", name: "Hidden Ace", faceDown: true, damage: 2 },
          { id: "shield-2", name: "?", faceDown: true, damage: 0 },
        ]}
      />,
    );

    expect(getAllByRole("listitem")).toHaveLength(2);
    const overlay = getByTestId("damage-counter-overlay");
    expect(overlay.textContent).toBe("2");
    expect(overlay.getAttribute("aria-label")).toBe("This card has taken 2 damage.");

    const trigger = getByRole("group", { name: "Your shields, 2 of 6" });
    fireEvent.mouseEnter(trigger);

    expect(getByTestId("shield-stack-preview")).toBeTruthy();
    const cardBacks = document.querySelectorAll("[data-shield-preview-stack] [role='img']");
    expect(cardBacks).toHaveLength(2);
    expect((cardBacks[0]!.parentElement as HTMLElement).style.zIndex).toBe("2");
    expect((cardBacks[1]!.parentElement as HTMLElement).style.zIndex).toBe("1");
    expect(queryByText("Hidden Ace")).toBeNull();
  });

  it("keeps the compact inline trigger touch-sized", () => {
    const { getByRole } = render(
      <ShieldPips value={2} max={6} low={false} listLabel="Your shields" compact inline />,
    );

    expect(getByRole("group", { name: "Your shields, 2 of 6" }).className).toContain("size-11");
  });

  it("bottom-aligns pips in the compact fill trigger", () => {
    const { getByRole } = render(
      <ShieldPips value={2} max={6} low={false} listLabel="Your shields" compact fill />,
    );

    const trigger = getByRole("group", { name: "Your shields, 2 of 6" });
    expect(trigger.className).toContain("h-full");
    expect(trigger.className).toContain("items-end");
    expect(trigger.className).toContain("pb-1");
  });

  it("submits a selected face-down Shield by position without revealing its identity", () => {
    const selected: string[] = [];
    const { getByRole, queryByText } = render(
      <ShieldPips
        value={2}
        max={6}
        low={false}
        listLabel="Your shields"
        shields={[
          { id: "shield-1", name: "Hidden Ace", faceDown: true },
          { id: "shield-2", name: "Hidden Choice", faceDown: true },
        ]}
        highlightCardIds={["shield-2"]}
        onShieldCardClick={(id) => selected.push(id)}
      />,
    );

    const candidate = getByRole("button", { name: "Shield 2" });
    expect(candidate.dataset.targetingState).toBe("candidate");
    fireEvent.click(candidate);

    expect(selected).toEqual(["shield-2"]);
    expect(queryByText("Hidden Choice")).toBeNull();
  });
});
