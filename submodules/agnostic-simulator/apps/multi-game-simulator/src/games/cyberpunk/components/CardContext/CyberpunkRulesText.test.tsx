// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vite-plus/test";

import { CyberpunkRulesText, parseCyberpunkRulesText } from "./CyberpunkRulesText";

describe("CyberpunkRulesText", () => {
  test("parses printed ability markers and preserves line breaks", () => {
    expect(parseCyberpunkRulesText("{Attack} Draw 1.\n{Flip} Ready 1.")).toEqual([
      { kind: "token", raw: "Attack", label: "ATTACK" },
      { kind: "text", value: " Draw 1." },
      { kind: "break" },
      { kind: "token", raw: "Flip", label: "FLIP" },
      { kind: "text", value: " Ready 1." },
    ]);
  });

  test("renders official symbols and a readable fallback for unsupported markers", () => {
    const { container } = render(
      <p>
        <CyberpunkRulesText text="{Attack} If this Unit has power 5+, draw 1. {Flip}" />
      </p>,
    );

    const attack = screen.getByRole("img", { name: "ATTACK" });
    expect(attack.getAttribute("src")).toContain("/attack.svg");
    expect(container.textContent).toContain("If this Unit has power 5+, draw 1.");
    expect(screen.getByText("FLIP")).toBeTruthy();
  });

  test("renders Street Cred with a readable game symbol", () => {
    const { container } = render(<CyberpunkRulesText text="Your ☆ (Street Cred) is 5." />);

    const streetCred = container.querySelector('[aria-hidden="true"]');
    expect(streetCred?.textContent).toBe("☆");
    expect(streetCred?.getAttribute("aria-hidden")).toBe("true");
    expect(container.textContent).toContain("(Street Cred) is 5.");
  });

  test("renders a granted BLOCKER keyword with its official icon", () => {
    render(<CyberpunkRulesText text="{Blocker}" />);

    const blocker = screen.getByRole("img", { name: "BLOCKER" });
    expect(blocker.getAttribute("src")).toContain("/blocker.svg");
  });
});
