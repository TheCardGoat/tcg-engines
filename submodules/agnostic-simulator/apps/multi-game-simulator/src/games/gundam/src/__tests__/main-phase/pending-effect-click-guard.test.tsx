// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { findCardsByName } from "../../test/queries.ts";
import {
  loadPendingEffectClickGuardDemo,
  loadStrikerPackChoiceDemo,
} from "../../game/fixtures/pending-effect-click-guard-demo.ts";
import { loadCommandMultiTargetDemo } from "../../game/fixtures/command-multi-target-demo.ts";

describe("Main-phase pending-effect interactions", () => {
  it("keeps the target prompt open when the player clicks their own attacker", async () => {
    const user = userEvent.setup();
    const { dev } = renderSimulator(loadPendingEffectClickGuardDemo);
    const viewerUnit = findCardsByName(dev, /Viewer Mock/i)[0]!;
    const hand = screen.getByRole("list", { name: /your hand/i });

    await user.click(within(hand).getByRole("listitem", { name: /Overwhelming Pressure/i }));
    await waitFor(() => {
      expect(screen.queryByText(/Choose 1 enemy Unit that is Lv\.6 or lower/i)).not.toBeNull();
    });

    await user.click(viewerUnit);

    expect(screen.queryByText(/challenge with/i)).toBeNull();
    expect(screen.queryByText(/Choose 1 enemy Unit that is Lv\.6 or lower/i)).not.toBeNull();
  });

  it("stages the chosen enemy and deals damage only after Confirm", async () => {
    const user = userEvent.setup();
    const { dev } = renderSimulator(loadPendingEffectClickGuardDemo);
    const hand = screen.getByRole("list", { name: /your hand/i });

    await user.click(within(hand).getByRole("listitem", { name: /Overwhelming Pressure/i }));
    await waitFor(() => {
      expect(screen.queryByText(/Choose 1 enemy Unit that is Lv\.6 or lower/i)).not.toBeNull();
    });

    const confirm = screen.getByRole("button", { name: /^confirm$/i }) as HTMLButtonElement;
    const enemyCard = findCardsByName(dev, /Rested Mock/i)[0]!;
    expect(confirm.disabled).toBe(true);
    expect(enemyCard.querySelector("[data-testid='damage-counter-overlay']")).toBeNull();

    await user.click(enemyCard);

    expect(screen.queryByText(/Choose 1 enemy Unit that is Lv\.6 or lower/i)).not.toBeNull();
    expect(confirm.disabled).toBe(false);
    expect(enemyCard.querySelector("[data-testid='damage-counter-overlay']")).toBeNull();

    await user.click(confirm);

    await waitFor(() => {
      expect(screen.queryByText(/Choose 1 enemy Unit that is Lv\.6 or lower/i)).toBeNull();
      const damage = findCardsByName(dev, /Rested Mock/i)[0]?.querySelector(
        "[data-testid='damage-counter-overlay']",
      );
      expect(damage?.getAttribute("aria-label")).toBe("This card has taken 4 damage.");
    });
  });

  it("resolves Extreme Hatred's friendly cost before asking for its enemy target", async () => {
    const user = userEvent.setup();
    const { dev } = renderSimulator(loadCommandMultiTargetDemo);
    const hand = screen.getByRole("list", { name: /your hand/i });

    await user.click(within(hand).getByRole("listitem", { name: /Extreme Hatred/i }));
    await user.click(screen.getByTestId("dual-mode-command"));
    await waitFor(() => {
      expect(screen.queryByText(/Choose 2 of your active Units/i)).not.toBeNull();
    });

    const confirm = screen.getByRole("button", { name: /^confirm$/i }) as HTMLButtonElement;
    const zaku = findCardsByName(dev, /Zaku II/i)[0]!;
    const dom = findCardsByName(dev, /Dom/i)[0]!;
    const enemy = findCardsByName(dev, /Enemy Gundam/i)[0]!;
    expect(confirm.disabled).toBe(true);

    await user.click(zaku);
    await user.click(dom);

    expect(zaku.className).toContain("gd-target-selected");
    expect(dom.className).toContain("gd-target-selected");
    expect(confirm.disabled).toBe(false);

    await user.click(confirm);
    await waitFor(() => {
      expect(screen.queryByText(/Then, choose 1 enemy Unit/i)).not.toBeNull();
    });

    await user.click(enemy);
    expect(enemy.className).toContain("gd-target-selected");
    const damageConfirm = screen.getByRole("button", {
      name: /^confirm$/i,
    }) as HTMLButtonElement;
    expect(damageConfirm.disabled).toBe(false);

    await user.click(damageConfirm);

    await waitFor(() => {
      expect(screen.queryByText(/Choose 2 of your active Units/i)).toBeNull();
      const damage = findCardsByName(dev, /Enemy Gundam/i)[0]?.querySelector(
        "[data-testid='damage-counter-overlay']",
      );
      expect(damage?.getAttribute("aria-label")).toBe("This card has taken 3 damage.");
    });
  });

  it("lets the player choose which printed Striker Pack token to deploy", async () => {
    const user = userEvent.setup();
    const { dev } = renderSimulator(loadStrikerPackChoiceDemo);
    const hand = screen.getByRole("list", { name: /your hand/i });

    await user.click(within(hand).getByRole("listitem", { name: /Striker Pack/i }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /Deploy 1 \[Sword Strike/i })).not.toBeNull();
    });

    expect(screen.getByRole("button", { name: /choose sword strike gundam/i })).toBeDefined();
    await user.click(screen.getByRole("button", { name: /choose launcher strike gundam/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /Deploy 1 \[Sword Strike/i })).toBeNull();
      expect(findCardsByName(dev, /Launcher Strike Gundam/i)).not.toHaveLength(0);
      expect(findCardsByName(dev, /Sword Strike Gundam/i)).toHaveLength(0);
    });
  });
});
