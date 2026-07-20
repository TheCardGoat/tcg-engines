import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";

import { BeamMotionOverlay, CardMotionOverlay, PhaseMotionOverlay } from "./MotionOverlays";
import type { BeamOverlayState, CardOverlayState, PhaseOverlayState } from "./motionTypes";

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

describe("CardMotionOverlay die rendering", () => {
  test("renders moving dice as compact tokens instead of generic card detail panels", () => {
    const overlay: CardOverlayState = {
      id: "gain-gig:step-0",
      planId: "gain-gig",
      stepId: "step-0",
      kind: "move",
      entity: {
        id: "gig-d6",
        title: "D6",
        subtitle: "Gig die",
        kind: "die",
        ownerId: "p1",
        face: "public",
        states: ["active"],
        stats: [{ label: "Face", value: "3" }],
        traits: ["d6"],
        dataAttributes: { "data-face": "3" },
      },
      from: { left: 20, top: 30, width: 36, height: 36 },
      to: { left: 100, top: 120, width: 36, height: 36 },
      sourceFace: "public",
      destinationFace: "public",
      delayMs: 0,
      durationMs: 360,
    };

    const markup = renderToStaticMarkup(
      <CardMotionOverlay
        overlay={overlay}
        reduced
        visible
        onComplete={() => {
          // Test render only.
        }}
      />,
    );

    expect(markup).toContain('data-testid="motion-die-face"');
    expect(markup).toContain('data-card-kind="die"');
    expect(markup).toContain('data-face="3"');
    expect(markup).toContain(">3</span>");
    expect(markup).not.toContain('data-testid="card"');
    expect(markup).not.toContain("Gig die | die");
    expect(markup).not.toContain(">DIE</span>");
    expect(markup).not.toContain(">FACE</span>");
  });
});

describe("CardMotionOverlay geometry guards", () => {
  test("does not expose a hidden card identity through the animation DOM", () => {
    const overlay: CardOverlayState = {
      id: "private-draw:step-0",
      planId: "private-draw",
      stepId: "step-0",
      kind: "move",
      entity: {
        id: "player_one_deck_ST01-015_01",
        title: "White Base",
        subtitle: "Base",
        kind: "leader",
        ownerId: "player_one",
        face: "public",
        states: [],
        stats: [{ label: "HP", value: "5" }],
        traits: ["Earth Federation"],
        imageUrl: "https://private.invalid/ST01-015.webp",
      },
      from: { left: 0, top: 0, width: 100, height: 140 },
      to: { left: 100, top: 0, width: 100, height: 140 },
      sourceFace: "hidden",
      destinationFace: "hidden",
      delayMs: 0,
      durationMs: 360,
    };

    const markup = renderToStaticMarkup(
      <CardMotionOverlay overlay={overlay} reduced visible onComplete={() => undefined} />,
    );

    expect(markup).toContain('data-source-face="hidden"');
    expect(markup).toContain('data-destination-face="hidden"');
    expect(markup).not.toContain("White Base");
    expect(markup).not.toContain("ST01-015");
    expect(markup).not.toContain("private.invalid");
    expect(markup).not.toContain("Earth Federation");
  });

  test("clamps oversized card overlay rectangles before rendering", () => {
    const overlay: CardOverlayState = {
      id: "bad-geometry:step-0",
      planId: "bad-geometry",
      stepId: "step-0",
      kind: "move",
      entity: {
        id: "unit-1",
        title: "Unit",
        subtitle: "Unit",
        kind: "unit",
        ownerId: "p1",
        face: "public",
        states: [],
        stats: [],
        traits: [],
        imageUrl: "unit.webp",
        backImageUrl: "back.webp",
      },
      from: { left: 0, top: 0, width: 900, height: 1200 },
      to: { left: 0, top: 0, width: 900, height: 1200 },
      sourceFace: "public",
      destinationFace: "public",
      delayMs: 0,
      durationMs: 360,
    };

    const markup = renderToStaticMarkup(
      <CardMotionOverlay
        overlay={overlay}
        reduced
        visible
        onComplete={() => {
          // Test render only.
        }}
      />,
    );

    expect(markup).toContain('data-testid="motion-card-overlay"');
    expect(markup).toContain("width:240px");
    expect(markup).toContain("height:320px");
    expect(markup).not.toContain("width:900px");
    expect(markup).not.toContain("height:1200px");
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
