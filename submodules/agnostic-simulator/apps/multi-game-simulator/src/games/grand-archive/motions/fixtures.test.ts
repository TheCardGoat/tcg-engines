import { describe, expect, it } from "vite-plus/test";
import { grandArchiveMotions, galleryConfig, slots } from "./fixtures";
import { nextPhase } from "./PlayMotionPage";
describe("Grand Archive motion fixtures", () => {
  it("covers nine distinct card types and binds every animated pose to a card", () => {
    expect(new Set(grandArchiveMotions.map((f) => f.id)).size).toBe(9);
    for (const fixture of grandArchiveMotions) {
      const ids = galleryConfig.cards(fixture).map((c) => c.id);
      expect(ids).toContain("subject");
      for (const step of fixture.beats) {
        expect(step.duration).toBeGreaterThan(720);
        for (const [id, pose] of Object.entries(step.poses)) {
          expect(ids).toContain(id);
          expect(pose.width / pose.height).toBeCloseTo(1 / 1.4);
        }
      }
    }
  });
  it("keeps Boons in Pantheon and sends attacks through Intent before graveyard", () => {
    const boon = grandArchiveMotions.find((f) => f.id === "boon")!;
    for (const step of boon.beats) {
      expect(step.poses.subject.left).toBe(slots.pantheon.left);
      expect(step.poses.subject.top).toBe(slots.pantheon.top);
    }
    const attack = grandArchiveMotions.find((f) => f.id === "attack")!;
    expect(attack.beats[2]!.poses.subject).toEqual(slots.intent);
    expect(attack.beats[3]!.poses.subject).toEqual(slots.graveyard);
    expect(attack.beats[1]!.poses.hero.rotation).toBe(-Math.PI / 2);
  });
  it("resolves targeted damage before discarding the Action", () => {
    expect(nextPhase("action", "flight")).toBe("stack");
    expect(nextPhase("action", "stack")).toBe("disclose");
    expect(nextPhase("action", "resolve")).toBe("outcome");
    expect(nextPhase("action", "outcome")).toBe("targets");
    expect(nextPhase("action", "targets")).toBe("land");
    expect(nextPhase("action", "disclose")).toBe("resolve");
    expect(nextPhase("action", "land")).toBe("done");
    expect(nextPhase("ally", "stack")).toBe("land");
    expect(nextPhase("weapon", "stack")).toBe("land");
  });
});
