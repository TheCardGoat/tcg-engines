// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  FabOptionalTriggerAutomationControl,
  FabOptionalTriggerAutomationProvider,
} from "./FabOptionalTriggerAutomation";

afterEach(cleanup);

describe("FabOptionalTriggerAutomationControl", () => {
  it("exposes authoritative mode and toggles without activating the card", async () => {
    const toggle = vi.fn();
    const activateCard = vi.fn();
    render(
      <FabOptionalTriggerAutomationProvider modes={{ trackers: "ask" }} onToggle={toggle}>
        <div onClick={activateCard}>
          <FabOptionalTriggerAutomationControl instanceId="trackers" cardName="Beaten Trackers" />
        </div>
      </FabOptionalTriggerAutomationProvider>,
    );

    const control = screen.getByRole("button", {
      name: "Configure optional effects for Beaten Trackers. Current setting: Ask every time",
    });

    fireEvent.click(control);
    const options = within(screen.getByRole("group", { name: "Optional effect behavior" }));
    expect(screen.getByText("Choose how to handle this card's optional effects.")).not.toBeNull();
    expect(
      options.getByRole("button", { name: /Ask every time/ }).getAttribute("aria-pressed"),
    ).toBe("true");
    expect(options.getByRole("button", { name: /Always use/ }).textContent).toContain(
      "Use the effect, then yield priority for this trigger.",
    );
    expect(options.getByRole("button", { name: /Always decline/ }).textContent).toContain(
      "Decline the effect, then yield priority for this trigger.",
    );
    fireEvent.click(options.getByRole("button", { name: /Always use/ }));

    expect(toggle).toHaveBeenCalledWith("trackers", "auto-accept", "Beaten Trackers", undefined);
    expect(activateCard).not.toHaveBeenCalled();
    expect(screen.getByRole("status").textContent).toContain(
      "Always use enabled for optional effects from Beaten Trackers",
    );
  });

  it("passes the card's canonical id through for the settings write-back", () => {
    const toggle = vi.fn();
    render(
      <FabOptionalTriggerAutomationProvider modes={{ trackers: "ask" }} onToggle={toggle}>
        <FabOptionalTriggerAutomationControl
          instanceId="trackers"
          cardName="Beaten Trackers"
          canonicalId="c-beaten-trackers"
        />
      </FabOptionalTriggerAutomationProvider>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Configure optional effects for Beaten Trackers. Current setting: Ask every time",
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: /Always use/ }));

    expect(toggle).toHaveBeenCalledWith(
      "trackers",
      "auto-accept",
      "Beaten Trackers",
      "c-beaten-trackers",
    );
  });

  it("explains why the setting is unavailable during a rules decision", async () => {
    render(
      <FabOptionalTriggerAutomationProvider
        modes={{ trackers: "auto-decline" }}
        disabledReason="Complete the current rules decision before changing this setting."
      >
        <FabOptionalTriggerAutomationControl instanceId="trackers" cardName="Beaten Trackers" />
      </FabOptionalTriggerAutomationProvider>,
    );

    const control = screen.getByRole("button", {
      name: "Configure optional effects for Beaten Trackers. Current setting: Always decline",
    });
    fireEvent.click(control);
    expect(
      screen.getByText("Complete the current rules decision before changing this setting."),
    ).not.toBeNull();
    expect((screen.getByRole("button", { name: /Always use/ }) as HTMLButtonElement).disabled).toBe(
      true,
    );
  });
});
