import { describe, expect, it } from "bun:test";
import { render } from "svelte/server";

import SimulatorSupportActions from "@/features/simulator/support/SimulatorSupportActions.svelte";

describe("SimulatorSupportActions", () => {
  it("renders both bug report and feedback actions", () => {
    const { body } = render(SimulatorSupportActions);

    expect(body).toContain("Report a bug");
    expect(body).toContain("Share feedback");
  });

  it("still renders when shell-owned callbacks are provided", () => {
    const { body } = render(SimulatorSupportActions, {
      props: {
        onOpenBugReport: () => {},
        onOpenFeedback: () => {},
      },
    });

    expect(body).toContain("Report a bug");
    expect(body).toContain("Share feedback");
  });
});
