import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { vynnset } from "../heroes/vynnset.ts";
import { dash } from "../heroes/dash.ts";
import { runechant } from "../tokens/runechant.ts";
import { deadwoodDirgeRed } from "./deadwood-dirge.ts";

describe("deadwoodDirge family AAA", () => {
  it("happy: destroying an aura you control creates 3 Runechant tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [deadwoodDirgeRed],
        arena: [runechant],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(deadwoodDirgeRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });
    if (game.isStackWaiting()) game.passBoth();

    expect(Vynnset.zone("arena").filter((id) => id === "token:runechant")).toHaveLength(3);
    expectFabPlayer(Vynnset).toHaveAP(1);
  });

  it("boundary: without an aura to destroy, no Runechants are created", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [deadwoodDirgeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(deadwoodDirgeRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Vynnset.zone("arena").filter((id) => id === "token:runechant")).toHaveLength(0);
    expectFabCard(Vynnset, deadwoodDirgeRed).toBeIn("graveyard");
  });

  it("timing: go again refunds the action point spent to play this", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [deadwoodDirgeRed],
        arena: [runechant],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    expectFabPlayer(Vynnset).toHaveAP(1);
    Vynnset.play(deadwoodDirgeRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });
    expectFabPlayer(Vynnset).toHaveAP(1);
  });
});
