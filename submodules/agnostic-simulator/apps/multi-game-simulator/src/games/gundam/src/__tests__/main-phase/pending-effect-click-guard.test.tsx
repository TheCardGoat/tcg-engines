// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { findCardsByName } from "../../test/queries.ts";
import {
  loadPendingEffectClickGuardDemo,
  loadKshatriyaSingleTargetDemo,
  loadStrikerPackChoiceDemo,
} from "../../game/fixtures/pending-effect-click-guard-demo.ts";
import { loadCommandMultiTargetDemo } from "../../game/fixtures/command-multi-target-demo.ts";

async function waitForSimulatorIdle() {
  await waitFor(
    () => {
      expect(document.querySelector('[aria-busy="true"]')).toBeNull();
    },
    { timeout: 4_000 },
  );
}

describe("Main-phase pending-effect interactions", () => {
  it("keeps the target selection active when the player clicks their own attacker", async () => {
    const user = userEvent.setup();
    const { dev } = renderSimulator(loadPendingEffectClickGuardDemo);
    const viewerUnit = findCardsByName(dev, /Guncannon/i)[0]!;
    const hand = screen.getByRole("list", { name: /your hand/i });

    await user.click(within(hand).getByRole("listitem", { name: /Overwhelming Pressure/i }));
    await waitForSimulatorIdle();
    await user.click(viewerUnit);

    expect(screen.queryByText(/challenge with/i)).toBeNull();
    expect(viewerUnit.className).not.toContain("gd-target-selected");

    await user.click(findCardsByName(dev, /Gundam Gusion Rebake/i)[0]!);
    await waitForSimulatorIdle();
    await waitFor(() => {
      expect(
        findCardsByName(dev, /Gundam Gusion Rebake/i)[0]
          ?.querySelector("[data-testid='damage-counter-overlay']")
          ?.getAttribute("aria-label"),
      ).toBe("This card has taken 4 damage.");
    });
  });

  it("commits the chosen enemy and deals damage after selection", async () => {
    const user = userEvent.setup();
    const { dev } = renderSimulator(loadPendingEffectClickGuardDemo);
    const hand = screen.getByRole("list", { name: /your hand/i });

    await user.click(within(hand).getByRole("listitem", { name: /Overwhelming Pressure/i }));
    await waitForSimulatorIdle();

    expect(screen.queryByRole("button", { name: /^confirm$/i })).toBeNull();
    expect(
      findCardsByName(dev, /Gundam Gusion Rebake/i)[0]?.querySelector(
        "[data-testid='damage-counter-overlay']",
      ),
    ).toBeNull();

    await user.click(findCardsByName(dev, /Gundam Gusion Rebake/i)[0]!);
    await waitForSimulatorIdle();

    await waitFor(() => {
      const damage = findCardsByName(dev, /Gundam Gusion Rebake/i)[0]?.querySelector(
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
    await waitForSimulatorIdle();
    await user.click(screen.getByTestId("dual-mode-command"));
    await waitForSimulatorIdle();

    const confirm = screen.getByRole("button", { name: /^confirm$/i }) as HTMLButtonElement;
    const guncannon = findCardsByName(dev, /Guncannon/i)[0]!;
    const guntank = findCardsByName(dev, /Guntank/i)[0]!;
    expect(confirm.disabled).toBe(true);

    await user.click(guncannon);
    await user.click(guntank);

    expect(guncannon.className).toContain("gd-target-selected");
    expect(guntank.className).toContain("gd-target-selected");
    expect(confirm.disabled).toBe(false);
    await user.click(confirm);
    await waitForSimulatorIdle();
    await user.click(findCardsByName(dev, /^Gundam$/i)[0]!);
    await waitForSimulatorIdle();

    await waitFor(() => {
      const damage = findCardsByName(dev, /^Gundam$/i)[0]?.querySelector(
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
    expect(await screen.findByTestId("interaction-resolution-prompt")).not.toBeNull();

    expect(screen.getByRole("radio", { name: "Sword Strike Gundam" })).toBeDefined();
    await user.click(screen.getByRole("radio", { name: "Launcher Strike Gundam" }));

    await waitFor(() => {
      expect(screen.queryByTestId("interaction-resolution-prompt")).toBeNull();
      expect(findCardsByName(dev, /Launcher Strike Gundam/i)).not.toHaveLength(0);
      expect(findCardsByName(dev, /Sword Strike Gundam/i)).toHaveLength(0);
    });
  });

  it("resolves Kshatriya's When Paired effect after choosing its only enemy Unit", async () => {
    const user = userEvent.setup();
    const { dev } = renderSimulator(loadKshatriyaSingleTargetDemo);
    const hand = screen.getByRole("list", { name: /your hand/i });

    await user.click(within(hand).getByRole("listitem", { name: /Marida Cruz/i }));
    await waitForSimulatorIdle();
    await user.click(findCardsByName(dev, /Kshatriya/i)[0]!);
    await waitForSimulatorIdle();

    await user.click(findCardsByName(dev, /^GM$/i)[0]!);
    await waitForSimulatorIdle();

    await waitFor(() => {
      expect(
        findCardsByName(dev, /^GM$/i)[0]!
          .querySelector("[data-testid='damage-counter-overlay']")
          ?.getAttribute("aria-label"),
      ).toBe("This card has taken 1 damage.");
    });
  });
});
