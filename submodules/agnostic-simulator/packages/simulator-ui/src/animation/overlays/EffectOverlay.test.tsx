import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";

import { createSimulatorAnimationScope } from "../provider/createSimulatorAnimationScope";
import { EffectArrow, shouldRenderEffectOverlay, sourceCardEffectTiming } from "./EffectOverlay";

describe("EffectArrow", () => {
  test("renders a directional arrow from a resolving source to its selected target", () => {
    const Scope = createSimulatorAnimationScope<Record<string, never>>();
    const markup = renderToStaticMarkup(
      <Scope.Root
        sessionKey="effect-arrow"
        initialState={{}}
        initialVersion={1}
        projection={{ getEntity: () => null, getZone: () => null }}
        entityRenderer={() => null}
        viewerSeatId={null}
        animationSpeed="off"
      >
        <svg>
          <EffectArrow
            id="command-effect:0"
            source={{ x: 100, y: 120 }}
            destination={{ x: 420, y: 360 }}
            startAtMs={0}
            durationMs={620}
          />
        </svg>
      </Scope.Root>,
    );

    expect(markup).toContain('data-animation-effect-arrow="true"');
    expect(markup).toContain('data-effect-arrow-id="command-effect:0"');
    expect(markup).toContain('data-targeting-arrow-variant="effect"');
    expect(markup).toContain("<polygon");
    expect(markup).toContain("420,360");
  });
});

describe("sourceCardEffectTiming", () => {
  test("places the impact halfway through a smooth 1.24 second resolution", () => {
    expect(sourceCardEffectTiming(1_240)).toEqual({
      impactAtMs: 620,
      arrowStartMs: 310,
      arrowDurationMs: 484,
      targetStartMs: 496,
      targetDurationMs: 471,
    });
  });

  test("keeps every segment non-negative when motion is suppressed", () => {
    expect(sourceCardEffectTiming(0)).toEqual({
      impactAtMs: 0,
      arrowStartMs: 0,
      arrowDurationMs: 0,
      targetStartMs: 0,
      targetDurationMs: 0,
    });
  });
});

describe("shouldRenderEffectOverlay", () => {
  test("keeps the completed overlay mounted through reflow for a seamless handoff", () => {
    expect(shouldRenderEffectOverlay("preparing")).toBe(false);
    expect(shouldRenderEffectOverlay("running")).toBe(true);
    expect(shouldRenderEffectOverlay("reflowing")).toBe(true);
    expect(shouldRenderEffectOverlay(null)).toBe(false);
  });
});

describe("sourceCardEffectTiming", () => {
  test("places the impact halfway through a smooth 1.24 second resolution", () => {
    expect(sourceCardEffectTiming(1_240)).toEqual({
      impactAtMs: 620,
      arrowStartMs: 310,
      arrowDurationMs: 484,
      targetStartMs: 496,
      targetDurationMs: 471,
    });
  });

  test("keeps every segment non-negative when motion is suppressed", () => {
    expect(sourceCardEffectTiming(0)).toEqual({
      impactAtMs: 0,
      arrowStartMs: 0,
      arrowDurationMs: 0,
      targetStartMs: 0,
      targetDurationMs: 0,
    });
  });
});
