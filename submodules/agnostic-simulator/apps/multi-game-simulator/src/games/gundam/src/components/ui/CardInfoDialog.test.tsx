// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";

import { CardInfoBody, CardInfoDialog } from "./CardInfoDialog.tsx";

const originalViewport = {
  width: window.innerWidth,
  height: window.innerHeight,
};

afterEach(() => {
  cleanup();
  document.body.classList.remove("gundam-simulator-active");
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: originalViewport.width,
  });
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: originalViewport.height,
  });
});

describe("CardInfoDialog mobile layout", () => {
  it.each(["unit", "base"] as const)("uses Gundam stat names for a %s", (cardType) => {
    render(<CardInfoBody card={{ name: "Test card", cardType, ap: 2, hp: 3 }} />);

    expect(screen.getByText(/\bHP$/u)).toBeTruthy();
    if (cardType === "unit") expect(screen.getByText(/\bAP$/u)).toBeTruthy();
    expect(screen.queryByText(/\bATK$/u)).toBeNull();
    expect(screen.queryByText(/\bARMOR$/u)).toBeNull();
  });

  it("identifies a colorless Resource without an unknown faction label", () => {
    render(<CardInfoBody card={{ name: "Resource", cardType: "resource", level: 0 }} />);

    expect(screen.getByText("◆ RESOURCE")).not.toBeNull();
    expect(screen.queryByText(/unknown/i)).toBeNull();
  });

  it("pins the dossier above mobile controls using the shared mobile chrome variables", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 844 });
    render(
      <CardInfoDialog
        card={{
          name: "Zeta Gundam (EX)",
          cardType: "unit",
          cost: 6,
          level: 7,
          ap: 5,
          hp: 5,
          effect: "When this Unit enters the battle area, draw 1 card.",
        }}
        actions={[{ id: "deploy", label: "Deploy Unit", hint: "Pay the cost and deploy it." }]}
        onClose={() => undefined}
      />,
    );

    const dossier = await screen.findByRole("region", { name: "Dossier: Zeta Gundam (EX)" });

    expect(dossier.style.bottom).toBe("calc(var(--mobile-menubar-height) + var(--safe-bottom))");
    expect(dossier.style.maxHeight).toBe(
      "calc(100dvh - var(--mobile-menubar-height) - var(--mobile-top-hud-height) - var(--safe-top) - var(--safe-bottom) - 16px)",
    );
    expect(dossier.style.overflowY).toBe("auto");
    expect(dossier.style.overscrollBehaviorY).toBe("contain");
  });
});
