// @vitest-environment jsdom
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { asPlayerId } from "@tcg/gundam-engine";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { loadSt10ShieldAssaultLab } from "../game/fixtures/st10-shield-assault-lab.ts";
import { renderSimulator } from "../test/renderSimulator.tsx";

const motionTestGlobal = globalThis as typeof globalThis & {
  __TCG_TEST_DISABLE_SIMULATOR_MOTION__?: boolean;
};
const defaultMotionSetting = motionTestGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__;

afterEach(() => {
  motionTestGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = defaultMotionSetting;
  window.localStorage.removeItem("tcg:animationDebug");
  vi.restoreAllMocks();
});

async function chooseZetaAction(
  user: ReturnType<typeof userEvent.setup>,
  action: "Attack player" | "Attack a Unit",
) {
  await user.click(
    screen.getByRole("button", {
      name: /Zeta Gundam \(EX\) actions; drag to attack/i,
    }),
  );
  // Multi-choice (Attack player vs Unit) still opens the menu. After the shield
  // attack only Unit attack remains legal, so one-click auto-activates without
  // a menu (autoActivateSingleEnabledAction).
  const menu = await waitFor(
    () => {
      const surface = screen.queryByTestId("card-context-menu");
      if (surface) return surface;
      if (action === "Attack a Unit" && screen.queryByRole("button", { name: "Attack Gouf" })) {
        return null;
      }
      throw new Error(`Expected context menu for "${action}" or unit targeting`);
    },
    { timeout: 3_000 },
  );
  if (menu) {
    fireEvent.click(within(menu).getByText(action, { exact: true }).closest("button")!);
  }
}

async function resolveShieldThenUnitCombat(user: ReturnType<typeof userEvent.setup>) {
  await chooseZetaAction(user, "Attack player");
  await waitFor(
    () => {
      expect(document.querySelector('[aria-label="Opponent shields, 0 of 6"]')).not.toBeNull();
    },
    { timeout: 8_000 },
  );
  await waitFor(
    () => {
      expect(document.querySelector('[aria-busy="true"]')).toBeNull();
    },
    { timeout: 4_000 },
  );

  // Only Unit attack is legal now — click auto-starts unit targeting.
  await chooseZetaAction(user, "Attack a Unit");
  expect(screen.queryByTestId("card-context-menu")).toBeNull();
  await user.click(await screen.findByRole("button", { name: "Attack Gouf" }));
  await waitFor(
    () => {
      expect(screen.getByText("Gouf was defeated.", { exact: true })).toBeTruthy();
    },
    { timeout: 8_000 },
  );
  await waitFor(
    () => {
      expect(document.querySelector('[aria-busy="true"]')).toBeNull();
    },
    { timeout: 4_000 },
  );
}

describe("Gundam animation sequencing", () => {
  it("preserves the Shield destruction in authoritative engine state", async () => {
    const user = userEvent.setup();
    const { dev } = renderSimulator(loadSt10ShieldAssaultLab);

    await resolveShieldThenUnitCombat(user);

    const view = dev.runtime.getFilteredView({
      role: "player",
      playerId: asPlayerId(String(dev.p1Id)),
    });
    expect(view.zones.zones["shieldArea:player_two"]?.cards).toHaveLength(0);
    expect(view.zones.zones["trash:player_two"]?.cards).toHaveLength(2);
  }, 15_000);

  it("does not restore the destroyed Shield after the Unit-combat animation settles", async () => {
    motionTestGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = false;
    const user = userEvent.setup();
    renderSimulator(loadSt10ShieldAssaultLab);

    await resolveShieldThenUnitCombat(user);
    expect(
      screen.getByRole("group", {
        name: "Opponent shields, 0 of 6",
      }),
    ).toBeTruthy();
  }, 20_000);

  it("does not replay the preceding combat plan when the turn passes", async () => {
    window.localStorage.setItem("tcg:animationDebug", "1");
    const debug = vi.spyOn(console, "debug").mockImplementation(() => {});
    const user = userEvent.setup();
    renderSimulator(loadSt10ShieldAssaultLab);
    await resolveShieldThenUnitCombat(user);

    debug.mockClear();
    await user.click(screen.getByTestId("primary-action"));
    await waitFor(() => expect(debug).toHaveBeenCalled());

    const acceptedEnqueues = debug.mock.calls
      .filter(([label]) => String(label).includes("gundam.bridge"))
      .map(([, payload]) => JSON.parse(String(payload)))
      .filter(
        (entry): entry is { accepted: true; stepIds: string[] } =>
          entry.accepted === true && Array.isArray(entry.stepIds),
      );
    expect(acceptedEnqueues[0]?.stepIds).toEqual([
      "phase:0:turnCycle:end-phase:action-step:phase:step",
      "phase:0:turnCycle:end-phase:action-step:phase:step:reading-pause",
    ]);
    expect(
      acceptedEnqueues
        .flatMap((entry) => entry.stepIds)
        .some((stepId) =>
          [":attack:", ":defeated:", ":damage:"].some((marker) => stepId.includes(marker)),
        ),
    ).toBe(false);
  }, 15_000);
});
