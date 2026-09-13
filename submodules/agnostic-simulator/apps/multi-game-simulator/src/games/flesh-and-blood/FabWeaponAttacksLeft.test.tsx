// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { FabWeaponAttacksLeft } from "./FabWeaponAttacksLeft";

afterEach(cleanup);

beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterAll(() => vi.unstubAllGlobals());

describe("FabWeaponAttacksLeft", () => {
  it("renders a compact remaining-count chip instead of covering copy", () => {
    render(<FabWeaponAttacksLeft weaponName="Dawnblade" remaining={1} total={2} side="bottom" />);

    const trigger = screen.getByRole("button", {
      name: "Dawnblade: 1 of 2 attacks remaining this turn",
    });
    expect(trigger.textContent).toContain("1");
    expect(screen.queryByText(/attack left/i)).toBeNull();
  });

  it("does not render for a once-per-turn weapon", () => {
    const view = render(
      <FabWeaponAttacksLeft weaponName="Cintari Saber" remaining={1} total={1} side="bottom" />,
    );
    expect(view.container.textContent).toBe("");
  });

  it("opens from tap or focus and names remaining activations", () => {
    render(<FabWeaponAttacksLeft weaponName="Dawnblade" remaining={1} total={2} side="bottom" />);
    const trigger = screen.getByRole("button", {
      name: "Dawnblade: 1 of 2 attacks remaining this turn",
    });

    fireEvent.pointerDown(trigger, { pointerType: "touch" });
    fireEvent.click(trigger);
    expect(screen.getByText("Attacks remaining")).not.toBeNull();
    expect(screen.getByText("1 of 2 left this turn")).not.toBeNull();
  });

  it("keeps the chip from activating the weapon underneath", () => {
    const onWeaponActivate = vi.fn();
    render(
      <div onClick={onWeaponActivate}>
        <FabWeaponAttacksLeft weaponName="Dawnblade" remaining={0} total={2} side="top" />
      </div>,
    );

    fireEvent.pointerDown(screen.getByTestId("fab-weapon-attacks-left"));
    fireEvent.click(screen.getByTestId("fab-weapon-attacks-left"));
    expect(onWeaponActivate).not.toHaveBeenCalled();
    expect(screen.getByTestId("fab-weapon-attacks-left").getAttribute("data-remaining")).toBe("0");
  });

  it("closes with Escape and returns focus", async () => {
    render(<FabWeaponAttacksLeft weaponName="Dawnblade" remaining={2} total={2} side="bottom" />);
    const trigger = screen.getByRole("button", {
      name: "Dawnblade: 2 of 2 attacks remaining this turn",
    });

    trigger.focus();
    fireEvent.focus(trigger);
    expect(screen.getByText("2 of 2 left this turn")).not.toBeNull();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByText("2 of 2 left this turn")).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});
