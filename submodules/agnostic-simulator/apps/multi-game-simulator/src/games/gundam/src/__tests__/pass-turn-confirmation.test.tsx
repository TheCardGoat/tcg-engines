// @vitest-environment jsdom
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";
import { userEvent } from "@testing-library/user-event";

import { loadMultiTurnDemo } from "../game/fixtures/multi-turn-demo.ts";
import { loadSt10ShieldAssaultLab } from "../game/fixtures/st10-shield-assault-lab.ts";
import { renderSimulator } from "../test/renderSimulator.tsx";

async function chooseZetaAction(
  user: ReturnType<typeof userEvent.setup>,
  action: "Attack player" | "Attack a Unit",
) {
  await user.click(
    screen.getByRole("button", {
      name: /Zeta Gundam \(EX\) actions; drag to attack/i,
    }),
  );
  // When both Attack player and Attack a Unit are legal, the menu opens.
  // When only one remains legal, the click auto-activates that action.
  const menu = screen.queryByTestId("card-context-menu");
  if (!menu) return;
  fireEvent.click(within(menu).getByText(action, { exact: true }).closest("button")!);
}

/**
 * Combined activity tabs mount EventLogPanel and ChatPanel together as role="log".
 * Prefer named/testid event-log surfaces so chat does not shadow match-log assertions.
 */
function getMatchEventLog(): HTMLElement {
  return (
    screen.queryByTestId("event-log") ?? screen.getByRole("log", { name: /event log|comms log/i })
  );
}

async function expectPassWithoutOpenActionsWarning(user: ReturnType<typeof userEvent.setup>) {
  const logBeforePass = getMatchEventLog().textContent;
  await user.click(screen.getByTestId("primary-action"));

  await waitFor(() => {
    expect(screen.queryByRole("dialog", { name: /actions still available/i })).toBeNull();
    expect(getMatchEventLog().textContent).not.toBe(logBeforePass);
  });
}

describe("Pass turn confirmation", () => {
  it("passes without warning after Zeta attacks a Shield and then a Unit", async () => {
    const user = userEvent.setup();
    renderSimulator(loadSt10ShieldAssaultLab);

    await chooseZetaAction(user, "Attack player");
    await waitFor(() => {
      expect(screen.getByText("Zeta Gundam (EX) was readied.", { exact: true })).toBeTruthy();
    });

    await chooseZetaAction(user, "Attack a Unit");
    await user.click(await screen.findByRole("button", { name: "Attack Gouf" }));
    await waitFor(() => {
      expect(screen.getByText("Gouf was defeated.", { exact: true })).toBeTruthy();
    });

    await expectPassWithoutOpenActionsWarning(user);
  });

  it("passes without warning after Zeta attacks only the Unit", async () => {
    const user = userEvent.setup();
    renderSimulator(loadSt10ShieldAssaultLab);

    await chooseZetaAction(user, "Attack a Unit");
    await user.click(await screen.findByRole("button", { name: "Attack Gouf" }));
    await waitFor(() => {
      expect(screen.getByText("Gouf was defeated.", { exact: true })).toBeTruthy();
    });

    await expectPassWithoutOpenActionsWarning(user);
  });

  it("warns when passing immediately because Zeta can still attack", async () => {
    const user = userEvent.setup();
    renderSimulator(loadSt10ShieldAssaultLab);

    await user.click(screen.getByTestId("primary-action"));

    const dialog = screen.getByRole("dialog", { name: /actions still available/i });
    expect(within(dialog).getByRole("button", { name: /keep playing/i })).toBeTruthy();
    expect(within(dialog).getByRole("button", { name: /^pass turn$/i })).toBeTruthy();
  });

  it("warns before passing when another action is available", async () => {
    const user = userEvent.setup();
    renderSimulator(loadMultiTurnDemo);

    const passTurn = await screen.findByTestId("primary-action");
    await user.click(passTurn);

    const dialog = screen.getByRole("dialog", { name: /actions still available/i });
    const keepPlaying = within(dialog).getByRole("button", { name: /keep playing/i });
    const confirmPass = within(dialog).getByRole("button", { name: /^pass turn$/i });
    expect(document.activeElement).toBe(keepPlaying);
    expect(keepPlaying.getAttribute("aria-keyshortcuts")).toBe("Escape");
    expect(confirmPass.getAttribute("aria-keyshortcuts")).toBe("Space");
    expect(within(keepPlaying).getByText("ESC")).toBeTruthy();
    expect(within(confirmPass).getByText("SPACE")).toBeTruthy();

    await user.keyboard("{Escape}");
    expect(dialog.isConnected).toBe(false);
    expect(screen.getByTestId("primary-action")).toBeTruthy();

    fireEvent.keyDown(window, { key: " ", code: "Space" });
    expect(screen.getByRole("dialog", { name: /actions still available/i })).toBeTruthy();

    const logBeforePass = getMatchEventLog().textContent;
    await user.keyboard(" ");

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /actions still available/i })).toBeNull();
      expect(getMatchEventLog().textContent).not.toBe(logBeforePass);
    });
  });
});
