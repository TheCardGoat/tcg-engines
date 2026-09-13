import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { spellbladeStrikeYellow } from "./spellblade-strike.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { bequestTheVastBeyondRed } from "./bequest-the-vast-beyond.ts";

/**
 * Bequest the Vast Beyond (DTD212) — Runeblade Action, cost 0.
 *
 * Printed: "Viserai Specialization. The next Runeblade attack action card you
 * play this turn costs {r} less to play for each Runechant you control.
 * Go again"
 *
 * Specialization is a deckbuilding restriction (OUT_OF_SCOPE in 1v1). The
 * cost latch is the playable clause: Spellblade Strike (ARC104) is a cost-1
 * Runeblade AAC with no self-discount; Brutal Assault is a cost-2 Generic AAC.
 */

const runechant = fabToken("runechant");

describe("Bequest the Vast Beyond (DTD212) AAA", () => {
  it("happy: 1 Runechant makes the next Runeblade attack action free", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [bequestTheVastBeyondRed, spellbladeStrikeYellow],
        arena: [runechant],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(bequestTheVastBeyondRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Viserai).toHaveAP(1).toHaveResourceCount(0);

    Viserai.must.playAttack(spellbladeStrikeYellow);
    game.advanceCombatTo("defend");
    expectFabPlayer(Viserai).toHaveResourceCount(0);
  });

  it("boundary: a Generic attack action is not discounted", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [bequestTheVastBeyondRed, brutalAssaultBlue],
        arena: [runechant, runechant],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(bequestTheVastBeyondRed);
    game.helpers.resolveUntilIdle();

    // Brutal Assault costs 2{r}; two Runechants would cover a Runeblade AAC.
    expect(() => Viserai.must.playAttack(brutalAssaultBlue)).toThrow();
    expectFabPlayer(Viserai).toHaveResourceCount(0);
  });

  it("timing: with no Runechants the next Runeblade attack still costs 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [bequestTheVastBeyondRed, spellbladeStrikeYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(bequestTheVastBeyondRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Viserai).toHaveAP(1);

    expect(() => Viserai.must.playAttack(spellbladeStrikeYellow)).toThrow();
    expectFabPlayer(Viserai).toHaveResourceCount(0);
  });
});
