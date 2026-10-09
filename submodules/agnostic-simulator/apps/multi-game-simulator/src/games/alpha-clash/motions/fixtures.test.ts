import { describe, expect, it } from "vitest";
import { slots, typeMotions } from "./fixtures";
const fixture = (id: string) => typeMotions.find((f) => f.id === id)!;
describe("Alpha Clash type motion contracts", () => {
  it("covers all five main types and distinct accessory/action lifecycles", () => {
    expect(typeMotions.map((f) => f.id)).toEqual([
      "contender",
      "clash",
      "clashground",
      "trap",
      "weapon",
      "contender-weapon",
      "relic",
      "basic",
      "quick",
      "clash-buff",
      "empowerment",
      "omen",
      "resource",
      "ambush",
    ]);
  });
  it("keeps Trap setting hidden and separates activation by a later-turn beat", () => {
    const beats = fixture("trap").beats;
    expect(beats[1]!.poses.subject!.face).toBe(false);
    expect(beats[2]!.label).toContain("Later turn");
    expect(beats.at(-1)!.poses.subject).toEqual(slots.oblivion);
    expect(fixture("ambush").beats.at(-1)!.poses.subject).not.toEqual(slots.oblivion);
  });
  it.each(["weapon", "contender-weapon"])("plays %s before the separate attach action", (id) => {
    const beats = fixture(id).beats;
    expect(beats[2]!.poses.subject).toEqual(slots.accessory);
    expect(beats[3]!.label).toContain("Pay attach cost");
  });
  it("removes the old Clashground before placing the new one", () => {
    const beats = fixture("clashground").beats;
    expect(beats[2]!.poses.old).toEqual(slots.oblivion);
    expect(beats[2]!.poses.subject).toEqual(slots.standby);
    expect(beats[3]!.poses.subject).toEqual(slots.ground);
  });
  it("distinguishes persistent Actions from one-shot Actions", () => {
    for (const id of ["basic", "quick", "clash-buff"])
      expect(fixture(id).beats.at(-1)!.poses.subject).toEqual(slots.oblivion);
    expect(fixture("empowerment").beats[2]!.poses.subject).toEqual(slots.attached);
    expect(fixture("omen").beats[2]!.poses.subject).toEqual(slots.omen);
    expect(fixture("omen").beats[3]!.label).toContain("next turn");
  });
  it("places resources face up and inverted", () => {
    expect(fixture("resource").beats[1]!.poses.subject).toMatchObject({
      face: true,
      rotation: Math.PI,
    });
  });
});
