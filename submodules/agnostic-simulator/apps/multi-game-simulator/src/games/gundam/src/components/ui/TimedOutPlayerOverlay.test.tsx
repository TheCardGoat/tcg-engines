import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";
import { composeDropEligibility, unsupportedTimeoutChannel } from "@tcg/protocol";

import { TimedOutPlayerOverlay } from "./TimedOutPlayerOverlay.tsx";

const NOW = 1_700_000_000_000;

describe("TimedOutPlayerOverlay", () => {
  it("does not treat a disconnect countdown as opponent time expired", () => {
    const eligibility = composeDropEligibility({
      nowMs: NOW,
      timeout: unsupportedTimeoutChannel(),
      disconnect: { connected: false, disconnectedAtMs: NOW - 20_000 },
    });
    const markup = renderToStaticMarkup(
      <TimedOutPlayerOverlay
        canSkip={false}
        canDrop={false}
        onSkip={() => undefined}
        onDrop={() => undefined}
        eligibility={eligibility}
        serverNowMs={NOW}
      />,
    );
    expect(markup).toBe("");
  });

  it("renders the timeout overlay once grace is pending", () => {
    const eligibility = composeDropEligibility({
      nowMs: NOW,
      timeout: {
        allowed: false,
        reason: "timeout_grace_pending",
        remainingMs: 9_000,
        eligibleAtMs: NOW + 9_000,
        facts: { source: "adapter", graceMs: 15_000, isActive: true },
      },
      disconnect: { connected: true },
    });
    const markup = renderToStaticMarkup(
      <TimedOutPlayerOverlay
        canSkip={false}
        canDrop={false}
        onSkip={() => undefined}
        onDrop={() => undefined}
        eligibility={eligibility}
        serverNowMs={NOW}
      />,
    );
    expect(markup).toContain("OPPONENT TIME EXPIRED");
    expect(markup).toContain("drop-opponent");
  });

  it("keeps practice skip/drop when no server eligibility exists", () => {
    const markup = renderToStaticMarkup(
      <TimedOutPlayerOverlay
        canSkip={true}
        canDrop={true}
        onSkip={() => undefined}
        onDrop={() => undefined}
      />,
    );
    expect(markup).toContain("skip-opponent-turn");
    expect(markup).toContain("drop-opponent");
  });
});
