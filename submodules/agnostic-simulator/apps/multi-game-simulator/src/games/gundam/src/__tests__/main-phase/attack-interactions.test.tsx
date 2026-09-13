// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { loadSt10ShieldAssaultLab } from "../../game/fixtures/st10-shield-assault-lab.ts";
import { renderSimulator } from "../../test/renderSimulator.tsx";

function zetaActionCard(): HTMLElement {
  const actionControl = screen.getByRole("button", {
    name: /Zeta Gundam \(EX\) actions; drag to attack/i,
  });
  const card = actionControl.querySelector<HTMLElement>("[data-sim-entity-id]");
  if (!card) throw new Error("Expected the Zeta card inside its battlefield action control.");
  return card;
}

describe("Main phase · attack interactions", () => {
  it("auto-passes both Action Steps after Zeta destroys a Shield and attacks a Unit", async () => {
    const user = userEvent.setup();
    renderSimulator(loadSt10ShieldAssaultLab);

    fireEvent.click(zetaActionCard());
    let menuSurface = await screen.findByTestId("card-context-menu");
    fireEvent.click(
      within(menuSurface).getByText("Attack player", { exact: true }).closest("button")!,
    );
    await waitFor(() => expect(screen.queryByTestId("card-context-menu")).toBeNull());

    await waitFor(() => {
      expect(screen.getByText(/Zeta Gundam \(EX\) was readied/i)).not.toBeNull();
      expect(screen.getByText(/Combat resolved/i)).not.toBeNull();
      expect(screen.getByLabelText(/Zeta Gundam \(EX\), action available/i)).not.toBeNull();
    });
    await waitFor(() => {
      expect(
        document.querySelector("[data-animation-interaction-boundary]")?.getAttribute("aria-busy"),
      ).toBeNull();
    });

    // After the direct Shield attack, choose the remaining Unit attack from
    // the battlefield action menu.
    await user.click(screen.getByLabelText(/Zeta Gundam \(EX\), action available/i));
    menuSurface = await screen.findByTestId("card-context-menu");
    fireEvent.click(
      within(menuSurface).getByText("Attack a Unit", { exact: true }).closest("button")!,
    );
    await user.click(await screen.findByRole("button", { name: "Attack Gouf" }));

    await waitFor(() => {
      expect(screen.getByText(/Gouf was defeated/i)).not.toBeNull();
      expect(screen.getAllByText(/Combat resolved/i)).toHaveLength(2);
    });
    expect(screen.getAllByText(/passed the action window automatically/i)).toHaveLength(2);
    expect(screen.queryByRole("button", { name: "PASS ACTION" })).toBeNull();
  });

  it("splits player and Unit attacks and selects a Unit without speculative arrows", async () => {
    const user = userEvent.setup();
    renderSimulator(loadSt10ShieldAssaultLab);

    const zeta = zetaActionCard();
    const attackerId = zeta.getAttribute("data-sim-entity-id");
    expect(attackerId).toBeTruthy();
    expect(screen.getByTestId(`attack-drag-source-${attackerId}`)).not.toBeNull();

    await user.click(zeta);
    const menuSurface = await screen.findByTestId("card-context-menu");
    const attackPlayer = within(menuSurface)
      .getByText("Attack player", { exact: true })
      .closest("button");
    const attackUnit = within(menuSurface)
      .getByText("Attack a Unit", { exact: true })
      .closest("button");
    expect(attackPlayer).not.toBeNull();
    expect(attackUnit).not.toBeNull();

    expect(attackPlayer?.textContent).toContain(
      "The top Shield would receive damage if unblocked.",
    );
    expect(attackPlayer?.getAttribute("aria-disabled")).toBe("false");
    expect(attackUnit?.getAttribute("aria-disabled")).toBe("false");
    expect(within(menuSurface).queryByText("Attack", { exact: true })).toBeNull();

    fireEvent.click(attackUnit!);

    const targetingInstruction = await screen.findByTestId("attack-unit-targeting-instruction");
    expect(
      within(targetingInstruction).getByText("Select enemy Unit", { exact: true }),
    ).not.toBeNull();
    expect(screen.queryByTestId("interaction-resolution-prompt")).toBeNull();
    expect(screen.queryByRole("button", { name: "direct" })).toBeNull();
    expect(document.querySelector(".targeting-overlay")).toBeNull();
    const goufTarget = screen.getByRole("button", { name: "Attack Gouf" });
    expect(document.activeElement).toBe(goufTarget);

    fireEvent.keyDown(goufTarget, { key: "Enter" });

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /Zeta Gundam \(EX\), unit, blue, AP 5, HP 5, rested/i,
        }),
      ).not.toBeNull();
    });
    expect(screen.queryByTestId("attack-unit-targeting-instruction")).toBeNull();
    expect(screen.getByText(/Attacked Gouf with Zeta Gundam \(EX\)/i)).not.toBeNull();
  });

  it("cancels Unit targeting with the visible button without declaring an attack", async () => {
    const user = userEvent.setup();
    renderSimulator(loadSt10ShieldAssaultLab);
    await user.click(zetaActionCard());
    const menu = await screen.findByTestId("card-context-menu");
    const attack = within(menu).getByText("Attack a Unit", { exact: true }).closest("button");
    expect(attack).not.toBeNull();
    fireEvent.click(attack!);
    const instruction = await screen.findByTestId("attack-unit-targeting-instruction");

    await user.click(within(instruction).getByRole("button", { name: "Cancel" }));

    expect(screen.queryByTestId("attack-unit-targeting-instruction")).toBeNull();
    expect(screen.queryByRole("button", { name: "Attack Gouf" })).toBeNull();
    expect(
      screen.getByRole("button", { name: /Zeta Gundam \(EX\) actions; drag to attack/i }),
    ).not.toBeNull();
    expect(screen.queryByText(/Attacked Gouf with Zeta Gundam \(EX\)/i)).toBeNull();
  });

  it("commits Attack player directly and reports the Shield destination", async () => {
    const user = userEvent.setup();
    renderSimulator(loadSt10ShieldAssaultLab);

    await user.click(zetaActionCard());
    const menuSurface = await screen.findByTestId("card-context-menu");
    const attackPlayer = within(menuSurface)
      .getByText("Attack player", { exact: true })
      .closest("button");
    expect(attackPlayer).not.toBeNull();
    expect(attackPlayer?.textContent).toContain(
      "The top Shield would receive damage if unblocked.",
    );
    fireEvent.click(attackPlayer!);

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /Zeta Gundam \(EX\), unit, blue, AP 5, HP 5, rested/i,
        }),
      ).not.toBeNull();
    });
    expect(screen.queryByTestId("attack-unit-targeting-instruction")).toBeNull();
    expect(screen.getByText(/Attacked direct with Zeta Gundam \(EX\)/i)).not.toBeNull();
  });
});
