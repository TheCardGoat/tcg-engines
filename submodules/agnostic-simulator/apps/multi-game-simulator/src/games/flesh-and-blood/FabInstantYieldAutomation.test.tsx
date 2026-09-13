// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  FabInstantYieldAutomationControl,
  FabInstantYieldAutomationProvider,
} from "./FabInstantYieldAutomation";

afterEach(cleanup);

describe("FabInstantYieldAutomationControl", () => {
  it("toggles auto-yield without activating the card", () => {
    const toggle = vi.fn();
    const activateCard = vi.fn();
    render(
      <FabInstantYieldAutomationProvider states={{ tuffnut: { enabled: false } }} onToggle={toggle}>
        <div onClick={activateCard}>
          <FabInstantYieldAutomationControl
            instanceId="tuffnut"
            cardName="Tuffnut, Bumbling Hulkster"
          />
        </div>
      </FabInstantYieldAutomationProvider>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Configure Instant auto-yield for Tuffnut, Bumbling Hulkster. Current setting: Ask every priority window",
      }),
    );
    const options = within(screen.getByRole("group", { name: "Instant priority behavior" }));
    expect(screen.getByText(/Auto-yield never activates the ability/)).not.toBeNull();
    expect(
      options
        .getByRole("button", { name: /Ask every priority window/ })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    expect(options.getByRole("button", { name: /Auto-yield this card/ }).textContent).toContain(
      "Pass only when this card's Instant ability is your only remaining action.",
    );
    fireEvent.click(options.getByRole("button", { name: /Auto-yield this card/ }));

    expect(toggle).toHaveBeenCalledWith("tuffnut");
    expect(activateCard).not.toHaveBeenCalled();
    expect(screen.getByRole("status").textContent).toContain(
      "Instant auto-yield enabled for Tuffnut, Bumbling Hulkster",
    );
  });

  it("explains why auto-yield is unavailable in always-hold mode", () => {
    render(
      <FabInstantYieldAutomationProvider
        states={{
          tuffnut: {
            enabled: false,
            disabledReason: "Unavailable while Hold every priority window is active.",
          },
        }}
      >
        <FabInstantYieldAutomationControl
          instanceId="tuffnut"
          cardName="Tuffnut, Bumbling Hulkster"
        />
      </FabInstantYieldAutomationProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Configure Instant auto-yield/ }));
    expect(
      screen.getByText("Unavailable while Hold every priority window is active."),
    ).not.toBeNull();
    expect(
      (screen.getByRole("button", { name: /Auto-yield this card/ }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });
});
