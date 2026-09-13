import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromai } from "../heroes/dromai.ts";
import { ash } from "../tokens/ash.ts";
import { sandCoverBlue } from "./sand-cover.ts";

describe("Sand Cover family AAA", () => {
  it("happy: the blue printing grants ward 2 to a controlled ash", () => {
    const game = FabTestEngine.start(
      { hero: dromai, hand: [sandCoverBlue], arena: [ash], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.must.playInstant(sandCoverBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Dromai, sandCoverBlue).toBeIn("graveyard");
    expectFabCard(Dromai, ash).toBeIn("arena").toHaveKeyword("ward");
  });

  it("boundary: without an ash the grant has no target", () => {
    const game = FabTestEngine.start(
      { hero: dromai, hand: [sandCoverBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.must.playInstant(sandCoverBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dromai, sandCoverBlue).toBeIn("graveyard");
    expect(Dromai.zone("arena")).not.toContain("token:ash");
  });

  it("timing: granted ward expires at end of turn", () => {
    const game = FabTestEngine.start(
      { hero: dromai, hand: [sandCoverBlue], arena: [ash], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.must.playInstant(sandCoverBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabCard(Dromai, ash).toHaveKeyword("ward");
    Dromai.endTurn();
    game.helpers.untilIdle();
    expectFabCard(Dromai, ash).notToHaveKeyword("ward");
  });
});
