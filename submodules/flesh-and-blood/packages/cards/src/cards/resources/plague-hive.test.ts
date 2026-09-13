import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { plagueHiveYellow } from "./plague-hive.ts";

function opponentAuraCount(Dash: { zone: (name: "arena") => string[] }): number {
  return Dash.zone("arena").filter(
    (id) =>
      id.startsWith("token:inertia") ||
      id.startsWith("token:frailty") ||
      id.startsWith("token:bloodrot-pox"),
  ).length;
}

describe("Plague Hive (OUT000) AAA", () => {
  it("happy: pitching this creates Inertia, Frailty, or Bloodrot Pox under the opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [brutalAssaultBlue, plagueHiveYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.must.pitch(plagueHiveYellow).playAttack(brutalAssaultBlue);
    game.closeCombat();

    expectFabCard(Arakni, plagueHiveYellow).toBeIn("pitch");
    expect(opponentAuraCount(Dash)).toBe(1);
  });

  it("boundary: pitching a different card does not create those tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [brutalAssaultBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(arakni).must.pitch(nimblismBlue).playAttack(brutalAssaultBlue);
    game.closeCombat();

    expect(opponentAuraCount(Dash)).toBe(0);
    expectFabPlayer(Dash).toHaveTokenCount("inertia", 0);
    expectFabPlayer(Dash).toHaveTokenCount("frailty", 0);
    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 0);
  });

  it("timing: this stays in the pitch zone after paying for the attack", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [brutalAssaultBlue, plagueHiveYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.must.pitch(plagueHiveYellow).playAttack(brutalAssaultBlue);
    game.closeCombat();

    expectFabCard(Arakni, plagueHiveYellow).toBeIn("pitch");
    expectFabCard(Arakni, brutalAssaultBlue).toBeIn("graveyard");
  });
});
