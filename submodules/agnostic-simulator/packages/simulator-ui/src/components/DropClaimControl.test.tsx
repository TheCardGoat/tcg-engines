import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";
import {
  composeDropEligibility,
  DISCONNECT_DROP_THRESHOLD_MS,
  unsupportedTimeoutChannel,
} from "@tcg/protocol";
import {
  DropClaimControl,
  anchoredServerNowMs,
  isTimeoutDropOverlayVisible,
  shouldTickDropControl,
} from "./DropClaimControl";

const NOW = 1_700_000_000_000;

describe("DropClaimControl", () => {
  it("stays disabled during disconnect countdown and shows remaining time", () => {
    const eligibility = composeDropEligibility({
      nowMs: NOW,
      timeout: unsupportedTimeoutChannel(),
      disconnect: { connected: false, disconnectedAtMs: NOW - 20_000 },
    });
    const markup = renderToStaticMarkup(
      <DropClaimControl eligibility={eligibility} serverNowMs={NOW} onClaim={() => undefined} />,
    );
    expect(markup).toContain("drop-claim-control");
    expect(markup).toContain('disabled=""');
    expect(markup).toContain("10 seconds");
  });

  it("enables Drop once the server-anchored countdown elapses", () => {
    const eligibility = composeDropEligibility({
      nowMs: NOW,
      timeout: unsupportedTimeoutChannel(),
      disconnect: {
        connected: false,
        disconnectedAtMs: NOW - DISCONNECT_DROP_THRESHOLD_MS,
      },
    });
    const markup = renderToStaticMarkup(
      <DropClaimControl eligibility={eligibility} serverNowMs={NOW} onClaim={() => undefined} />,
    );
    expect(markup).not.toContain('disabled=""');
    expect(markup).toContain("You can drop them");
  });

  it("exposes a single menuitem action for menu hosts", () => {
    const eligibility = composeDropEligibility({
      nowMs: NOW,
      timeout: unsupportedTimeoutChannel(),
      disconnect: {
        connected: false,
        disconnectedAtMs: NOW - DISCONNECT_DROP_THRESHOLD_MS,
      },
    });
    const markup = renderToStaticMarkup(
      <DropClaimControl
        eligibility={eligibility}
        serverNowMs={NOW}
        onClaim={() => undefined}
        actionRole="menuitem"
      />,
    );
    expect(markup).toContain('role="menuitem"');
    expect(markup).not.toContain('role="status"');
  });

  it("advances the server clock from a monotonic local baseline, not from tick count", () => {
    expect(anchoredServerNowMs(NOW, 1_000, 1_250)).toBe(NOW + 250);
    expect(anchoredServerNowMs(NOW, 1_000, 31_000)).toBe(NOW + 30_000);
  });

  it("ticks only countdown gates and keeps the timeout overlay off disconnect eligibility", () => {
    const disconnect = composeDropEligibility({
      nowMs: NOW,
      timeout: unsupportedTimeoutChannel(),
      disconnect: { connected: false, disconnectedAtMs: NOW - 20_000 },
    });
    const withinLimit = composeDropEligibility({
      nowMs: NOW,
      timeout: {
        allowed: false,
        reason: "timeout_within_limit",
        remainingMs: 75_000,
        eligibleAtMs: NOW + 75_000,
        facts: { source: "adapter", graceMs: 15_000, isActive: true },
      },
      disconnect: { connected: true },
    });
    expect(shouldTickDropControl(disconnect)).toBe(true);
    expect(shouldTickDropControl(withinLimit)).toBe(true);
    expect(
      isTimeoutDropOverlayVisible({
        canSkip: false,
        canDrop: false,
        eligibility: disconnect,
        serverNowMs: NOW,
      }),
    ).toBe(false);
    expect(
      isTimeoutDropOverlayVisible({
        canSkip: false,
        canDrop: false,
        eligibility: withinLimit,
        serverNowMs: NOW + 60_000,
      }),
    ).toBe(true);
  });
});
