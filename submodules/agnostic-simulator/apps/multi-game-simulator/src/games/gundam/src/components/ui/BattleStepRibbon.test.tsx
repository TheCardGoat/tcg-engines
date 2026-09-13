// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";

import { BATTLE_STEPS, BattleStepRibbon } from "./BattleStepRibbon.tsx";

afterEach(cleanup);

describe("BattleStepRibbon", () => {
  it.each(BATTLE_STEPS.map((step, index) => [step.id, step.label, index + 1] as const))(
    "marks %s as the current battle step",
    (currentStep, label, ordinal) => {
      render(
        <BattleStepRibbon
          currentStep={currentStep}
          controlState={{ kind: "interactive", turnOwner: "opponent", priorityHolder: "self" }}
        />,
      );

      const progress = screen.getByRole("region", { name: "Battle progress" });
      const current = within(progress).getByRole("listitem", {
        name: `${label} Step, current`,
      });
      expect(current.getAttribute("aria-current")).toBe("step");
      expect(current.getAttribute("data-state")).toBe("current");
      expect(progress.textContent).toContain(
        `Battle progress: ${label} Step, ${ordinal} of 5. Your priority.`,
      );
    },
  );

  it("keeps the official five-step order visible and expresses state without color alone", () => {
    render(
      <BattleStepRibbon
        currentStep="action-step"
        controlState={{ kind: "interactive", turnOwner: "self", priorityHolder: "opponent" }}
      />,
    );

    const steps = screen.getAllByRole("listitem");
    expect(steps).toHaveLength(5);
    expect(steps.map((step) => step.getAttribute("data-battle-step"))).toEqual([
      "attack-step",
      "block-step",
      "action-step",
      "damage-step",
      "battle-end-step",
    ]);
    expect(steps.map((step) => step.getAttribute("data-state"))).toEqual([
      "complete",
      "complete",
      "current",
      "upcoming",
      "upcoming",
    ]);
    expect(screen.getByLabelText("Opponent priority", { exact: true })).toBeTruthy();
  });

  it("degrades to a labeled battle state when the engine exposes an unknown step", () => {
    render(
      <BattleStepRibbon
        currentStep="future-step"
        controlState={{ kind: "resolving", turnOwner: "opponent" }}
      />,
    );

    expect(screen.queryByRole("listitem", { current: "step" })).toBeNull();
    expect(screen.getByText("Battle in progress. Resolving.")).toBeTruthy();
  });

  it("uses player labels for spectator priority without changing direction", () => {
    render(
      <BattleStepRibbon
        currentStep="block-step"
        controlState={{ kind: "interactive", turnOwner: "opponent", priorityHolder: "self" }}
        spectator
      />,
    );

    const beacon = screen.getByLabelText("Player 1 priority");
    expect(beacon.getAttribute("data-direction")).toBe("self");
    expect(beacon.getAttribute("data-priority-beacon")).toBe("interactive");
  });

  it("shows only one responsive priority label at each breakpoint", () => {
    render(
      <BattleStepRibbon
        currentStep="block-step"
        controlState={{ kind: "interactive", turnOwner: "opponent", priorityHolder: "self" }}
      />,
    );

    const beacon = screen.getByLabelText("Your priority");
    expect(beacon.getAttribute("data-responsive")).toBe("true");
    expect(screen.getByText("Your priority", { exact: true }).className).toContain("hidden");
    expect(screen.getByText("Your priority", { exact: true }).className).toContain("sm:inline");
  });
});
