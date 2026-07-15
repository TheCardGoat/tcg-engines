import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";

import { BeamMotionOverlay, PhaseMotionOverlay } from "./MotionOverlays";
import type { BeamOverlayState, PhaseOverlayState } from "./motionTypes";

const baseOverlay: BeamOverlayState = {
  id: "combat-plan:combat-step",
  planId: "combat-plan",
  stepId: "combat-step",
  kind: "combat",
  source: { left: 100, top: 120, width: 80, height: 112 },
  sourceRef: { kind: "entity", id: "attacker" },
  sourceLabel: "Attacker Unit",
  targets: [
    {
      ref: { kind: "entity", id: "defender" },
      rect: { left: 320, top: 160, width: 80, height: 112 },
      label: "Defender Unit",
    },
  ],
  reason: "resolved",
  attackKind: "fight",
  delayMs: 0,
  durationMs: 600,
};

describe("BeamMotionOverlay combat badges", () => {
  test("renders fight direction badges at source and target", () => {
    const markup = renderToStaticMarkup(
      <BeamMotionOverlay
        overlay={baseOverlay}
        reduced
        onComplete={() => {
          // Test render only.
        }}
      />,
    );

    expect(markup).toContain('data-testid="motion-source-badge"');
    expect(markup).toContain("Deals");
    expect(markup).toContain("Attacker Unit");
    expect(markup).toContain('data-testid="motion-combat-target-badge"');
    expect(markup).toContain("Receives");
    expect(markup).toContain("Defender Unit");
  });

  test("renders direct combat detail labels near the beam", () => {
    const markup = renderToStaticMarkup(
      <BeamMotionOverlay
        overlay={{
          ...baseOverlay,
          targets: [
            {
              ref: { kind: "anchor", id: "opp-street-cred" },
              rect: { left: 360, top: 40, width: 96, height: 44 },
            },
          ],
          attackKind: "direct",
          label: "IMPACT",
          detailLabel: "STEALS 2 GIGS",
        }}
        reduced
        onComplete={() => {
          // Test render only.
        }}
      />,
    );

    expect(markup).toContain('data-testid="motion-combat-detail-badge"');
    expect(markup).toContain('data-detail-label="STEALS 2 GIGS"');
    expect(markup).toContain("STEALS 2 GIGS");
    expect(markup).toContain('data-result-label="IMPACT"');
  });
});

describe("PhaseMotionOverlay", () => {
  test("renders viewer-relative turn copy", () => {
    const overlay: PhaseOverlayState = {
      id: "turn-plan:turn-step",
      planId: "turn-plan",
      stepId: "turn-step",
      from: "main",
      to: "start",
      variant: "turn",
      playerId: "player-1",
      viewerSeatId: "player-1",
      turnNumber: 2,
      center: { x: 290, y: 170 },
      delayMs: 0,
      durationMs: 1500,
    };

    const markup = renderToStaticMarkup(
      <PhaseMotionOverlay
        overlay={overlay}
        reduced
        onComplete={() => {
          // Test render only.
        }}
      />,
    );

    expect(markup).toContain('data-motion-phase-variant="turn"');
    expect(markup).toContain('data-turn-number="2"');
    expect(markup).toContain("Your Turn");
    expect(markup).toContain("Turn 2");
  });
});
