import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CardSurface,
  DomCardMotion,
  cardDragPose,
  pointInsideCardSpace,
} from "@tcg/simulator-presentation/dom";
import { resolveCardTransferPose } from "@tcg/simulator-presentation/motion";
import {
  resolutionTiming,
  sampleCardReaction,
} from "@tcg/simulator-presentation/resolution-motion";
import { releasedPlayPhase, nextPlayPhase, playSlots, playTargetPose } from "./play-fixtures";
const frame = vi.hoisted(() => ({ run: () => {} }));
vi.mock("@react-three/fiber", () => ({
  useThree: () => ({ invalidate: () => {} }),
  useFrame: (callback: () => void) => {
    frame.run = callback;
  },
}));
afterEach(cleanup);

describe("play motion handoff and audio", () => {
  it("keeps a stationary invalid release idle but returns a displaced card", () => {
    expect(releasedPlayPhase(playSlots.hand, false)).toBe("idle");
    expect(releasedPlayPhase({ ...playSlots.hand, left: playSlots.hand.left + 20 }, false)).toBe(
      "return",
    );
    expect(releasedPlayPhase(playSlots.hand, true)).toBe("flight");
  });
  it("shows replacement artwork after an earlier image failed", () => {
    const view = render(<CardSurface imageUrl="failed.png" />);
    const failed = view.container.querySelector("img")!;
    fireEvent.error(failed);
    expect(failed.style.visibility).toBe("hidden");
    view.rerender(<CardSurface imageUrl="replacement.png" />);
    const replacement = view.container.querySelector("img")!;
    fireEvent.load(replacement);
    expect(replacement.style.visibility).not.toBe("hidden");
    expect(replacement.src).toContain("replacement.png");
  });

  it("keeps target reactions bounded and restores the target after impact", () => {
    const rest = { x: 0, y: 0, scale: 1, opacity: 1 };
    for (const kind of ["damage", "remove"] as const) {
      expect(sampleCardReaction(kind, resolutionTiming.impact - 1)).toEqual(rest);
      expect(sampleCardReaction(kind, 2000)).toEqual(rest);
      for (let t = 0; t < 2000; t += 16) {
        const reaction = sampleCardReaction(kind, t);
        expect(Math.abs(reaction.x)).toBeLessThanOrEqual(8);
        expect(reaction.opacity).toBeGreaterThanOrEqual(0.28);
        expect(reaction.opacity).toBeLessThanOrEqual(1);
        expect(sampleCardReaction(kind, t, true)).toEqual(rest);
      }
    }
    expect(sampleCardReaction("remove", resolutionTiming.impact + 360)).toEqual(rest);
    expect(sampleCardReaction("damage", resolutionTiming.impact + 32).x).not.toBe(0);
  });

  it("applies a visual impact without changing the logical pose or replaying landing audio", () => {
    const node = document.createElement("div");
    const reaction = { current: sampleCardReaction("damage", 472) };
    const land = vi.fn();
    render(
      <DomCardMotion
        id="card"
        nodes={{ current: new Map([["card", node]]) }}
        pose={playSlots.enemyA}
        clock={{ current: 0 }}
        motionKey="rest"
        timed
        dealing={false}
        reduced={false}
        reaction={reaction}
        onLand={land}
      />,
    );
    act(() => frame.run());
    expect(node.style.transform).not.toContain(`translate3d(${playSlots.enemyA.left}px,`);
    reaction.current = sampleCardReaction("damage", 2000);
    act(() => frame.run());
    expect(node.style.transform).toContain(`translate3d(${playSlots.enemyA.left}px,`);
    expect(node.style.opacity).toBe("1");
    expect(land).not.toHaveBeenCalled();
  });
  it("starts at the actual release pose and emits launch and landing once", () => {
    const node = document.createElement("div"),
      nodes = { current: new Map([["card", node]]) },
      clock = { current: 0 };
    const launch = vi.fn(),
      land = vi.fn();
    const common = {
      id: "card",
      nodes,
      clock,
      timed: true,
      dealing: false,
      reduced: false,
      onLaunch: launch,
      onLand: land,
    };
    const view = render(<DomCardMotion {...common} pose={playSlots.hand} motionKey="idle" />);
    act(() => frame.run());
    expect(launch).not.toHaveBeenCalled();
    expect(land).not.toHaveBeenCalled();
    const release = { ...playSlots.hand, left: 30, top: 40 };
    view.rerender(
      <DomCardMotion
        {...common}
        pose={playSlots.standby}
        motionKey="play"
        handoff={{ key: 1, pose: release }}
      />,
    );
    act(() => frame.run());
    // Transform uses the target raster size, compensated by centered scale.
    const translation = node.style.transform.match(/translate3d\(([^p]+)px,([^p]+)px,0\)/);
    expect(Number(translation?.[1])).toBeCloseTo(7.5);
    expect(Number(translation?.[2])).toBeCloseTo(8.5);
    expect(launch).toHaveBeenCalledTimes(1);
    expect(land).not.toHaveBeenCalled();
    clock.current = 719;
    act(() => frame.run());
    expect(land).not.toHaveBeenCalled();
    clock.current = 720;
    act(() => frame.run());
    act(() => frame.run());
    expect(launch).toHaveBeenCalledTimes(1);
    expect(land).toHaveBeenCalledTimes(1);
    expect(node.style.transform).toContain("scale(1)");
  });
  it("snaps reduced motion before confirming its arrival", () => {
    const node = document.createElement("div"),
      clock = { current: 0 },
      land = vi.fn();
    const view = render(
      <DomCardMotion
        id="card"
        nodes={{ current: new Map([["card", node]]) }}
        pose={playSlots.hand}
        clock={clock}
        motionKey="idle"
        timed
        dealing={false}
        reduced
        onLand={land}
      />,
    );
    view.rerender(
      <DomCardMotion
        id="card"
        nodes={{ current: new Map([["card", node]]) }}
        pose={playSlots.standby}
        clock={clock}
        motionKey="play"
        timed
        dealing={false}
        reduced
        onLand={land}
      />,
    );
    clock.current = 1;
    act(() => frame.run());
    act(() => frame.run());
    expect(land).toHaveBeenCalledTimes(1);
  });
  it.each([0.35, 0.7, 1, 1.5])("preserves grab offset and endpoints at board scale %s", (scale) => {
    const start = playSlots.hand,
      grab = { x: 17, y: 43 };
    const space = { left: 71, top: -35, width: 1280 * scale, height: 650 * scale };
    for (const x of [-100, 0, 640, 1280, 1400])
      for (const y of [-100, 0, 325, 650, 800]) {
        const result = cardDragPose(
          start,
          grab,
          { x: space.left + x * scale, y: space.top + y * scale },
          space,
          { width: 1280, height: 650 },
        );
        expect(result.left).toBeCloseTo(x - grab.x);
        expect(result.top).toBeCloseTo(y - grab.y);
        for (const elapsedMs of [0, 100, 360, 719, 720]) {
          const p = resolveCardTransferPose({
            source: result,
            destination: playSlots.standby,
            elapsedMs,
            startAtMs: 0,
            durationMs: 720,
            faceChanges: false,
            sourceVisible: true,
            destinationVisible: true,
            choreography: { liftPx: 34, revealStart: 0.18, revealDuration: 0.5 },
          });
          expect(Number.isFinite(p.centerX + p.centerY + p.width)).toBe(true);
          if (elapsedMs === 0) expect(p.centerX).toBeCloseTo(result.left + result.width / 2);
          if (elapsedMs === 720)
            expect(p.centerX).toBeCloseTo(playSlots.standby.left + playSlots.standby.width / 2);
        }
      }
    expect(pointInsideCardSpace({ x: space.left - 1, y: 0 }, space)).toBe(false);
  });
  it("keeps one-shot Actions visible through target resolution, then discards", () => {
    for (const kind of ["basic", "quick"] as const) {
      expect(nextPlayPhase(kind, "flight")).toBe("standby");
      expect(nextPlayPhase(kind, "standby")).toBe("disclose");
      expect(nextPlayPhase(kind, "resolve")).toBe("outcome");
      expect(nextPlayPhase(kind, "outcome")).toBe("targets");
    }
    expect(nextPlayPhase("clash", "standby")).toBe("enter");
    const resolvingTarget = playTargetPose("basic", "resolve", true);
    expect(resolvingTarget.left + resolvingTarget.width / 2).toBe(
      playSlots.enemyA.left + playSlots.enemyA.width / 2,
    );
    expect(resolvingTarget.width).toBeGreaterThan(playSlots.enemyA.width);
    expect(playTargetPose("basic", "targets", true)).toEqual(playSlots.enemyDiscard);
    expect(playTargetPose("basic", "outcome", true)).toEqual(resolvingTarget);
    expect(nextPlayPhase("basic", "targets")).toBe("discard");
    expect(playTargetPose("basic", "outcome", false)).toEqual(playSlots.enemyA);
    expect(playTargetPose("quick", "targets", true).left).toBe(playSlots.enemyA.left);
  });
});
