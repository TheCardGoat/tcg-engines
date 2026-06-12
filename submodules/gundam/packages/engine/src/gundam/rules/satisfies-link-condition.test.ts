/**
 * `satisfiesLinkCondition` shape coverage.
 *
 * Rule 3-2-6-4: a Unit's link condition can be a bracketed pilot name
 * (`[Char Aznable]`) OR a parenthesised trait reference (`(Newtype)
 * Trait`), with multiple alternatives joined by `/`. The matcher must
 * accept either side and OR the alternatives.
 */

import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  activeResources,
} from "../../index.ts";
import { satisfiesLinkCondition } from "./derived-state.ts";

function pairAndCheck(linkCondition: string, pilot: ReturnType<typeof createMockPilot>) {
  const unit = createMockUnit({ ap: 2, hp: 3, linkCondition });
  const engine = GundamTestEngine.create({
    hand: [pilot],
    play: [unit],
    resourceArea: activeResources(2),
  });
  const p1 = engine.asPlayer(PLAYER_ONE);
  const unitId = p1.getCardsInZone("battleArea")[0]!;
  expectSuccess(p1.assignPilot(pilot, unitId));
  const pilotId = engine.getG().pilotAssignments[unitId]!;
  return satisfiesLinkCondition(pilotId, unitId, engine.getRuntime().getFrameworkReadAPI().cards);
}

describe("satisfiesLinkCondition", () => {
  it("matches `[Pilot Name]` against the pilot's name (case-insensitive substring)", () => {
    const pilot = createMockPilot({ name: "Char Aznable", level: 1, cost: 1 });
    expect(pairAndCheck("[Char Aznable]", pilot)).toBe(true);
  });

  it("matches `[Partial]` as a substring of the full pilot name", () => {
    const pilot = createMockPilot({ name: "Setsuna F. Seiei", level: 1, cost: 1 });
    expect(pairAndCheck("[Setsuna]", pilot)).toBe(true);
  });

  it("rejects a name that doesn't include the bracketed text", () => {
    const pilot = createMockPilot({ name: "Amuro Ray", level: 1, cost: 1 });
    expect(pairAndCheck("[Char Aznable]", pilot)).toBe(false);
  });

  it("matches a Command-as-Pilot against its printed pilot name", () => {
    const unit = createMockUnit({ ap: 2, hp: 3, linkCondition: "[Char Aznable]" });
    const command = createMockCommand({
      name: "A Show of Resolve",
      level: 1,
      cost: 1,
      pilotName: "Char Aznable",
      apBonus: 1,
      hpBonus: 0,
    });
    const engine = GundamTestEngine.create({
      hand: [command],
      play: [unit],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.playCommandAsPilot(command, unit));
    const commandId = engine.getG().pilotAssignments[unitId]!;

    expect(
      satisfiesLinkCondition(commandId, unitId, engine.getRuntime().getFrameworkReadAPI().cards),
    ).toBe(true);
  });

  it("matches `(Trait) Trait` against a pilot carrying that trait", () => {
    const pilot = createMockPilot({
      name: "Some Pilot",
      traits: ["aeug"],
      level: 1,
      cost: 1,
    });
    expect(pairAndCheck("(AEUG) Trait", pilot)).toBe(true);
  });

  it("matches `(Trait1)/(Trait2) Trait` as an OR over both traits", () => {
    const newtype = createMockPilot({
      name: "Some Newtype",
      traits: ["newtype"],
      level: 1,
      cost: 1,
    });
    const cyber = createMockPilot({
      name: "Some Cyber-Newtype",
      traits: ["cyber-newtype"],
      level: 1,
      cost: 1,
    });
    expect(pairAndCheck("(Newtype) / (Cyber-Newtype) Trait", newtype)).toBe(true);
    expect(pairAndCheck("(Newtype) / (Cyber-Newtype) Trait", cyber)).toBe(true);
  });

  it("rejects a trait condition when the pilot has none of the named traits", () => {
    const pilot = createMockPilot({
      name: "Plain Pilot",
      traits: ["civilian"],
      level: 1,
      cost: 1,
    });
    expect(pairAndCheck("(AEUG) Trait", pilot)).toBe(false);
  });

  it("matches mixed `[Name] / (Trait) Trait` via either side", () => {
    const namedPilot = createMockPilot({ name: "Char Aznable", level: 1, cost: 1 });
    const traitPilot = createMockPilot({
      name: "Other Pilot",
      traits: ["newtype"],
      level: 1,
      cost: 1,
    });
    expect(pairAndCheck("[Char Aznable] / (Newtype) Trait", namedPilot)).toBe(true);
    expect(pairAndCheck("[Char Aznable] / (Newtype) Trait", traitPilot)).toBe(true);
  });
});
