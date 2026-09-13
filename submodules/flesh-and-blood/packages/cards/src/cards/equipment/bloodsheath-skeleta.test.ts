import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { spellbladeAssaultRed, spellbladeAssaultYellow } from "../actions/spellblade-assault.ts";
import { bloodsheathSkeleta } from "./bloodsheath-skeleta.ts";

/**
 * Bloodsheath Skeleta (1HP264) — Runeblade Chest d2, Temper.
 * Printed: "Instant - Destroy this: The next attack action card and
 * non-attack action card you play this turn get 'This card costs {r} less to
 * play for each Runechant you control.'"
 */

describe("Bloodsheath Skeleta (1HP264) AAA", () => {
  it("happy: the next attack action costs {r} less per Runechant (2 Runechants = free)", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        chest: [bloodsheathSkeleta],
        hand: [spellbladeAssaultRed],
        arena: [fabToken("runechant"), fabToken("runechant")],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.activate(bloodsheathSkeleta);
    game.helpers.resolveUntilIdle();

    Viserai.play(spellbladeAssaultRed);
    // Both latched grants arm together on the attack declaration; public play
    // preserves their listed ordering.
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabCard(Viserai, bloodsheathSkeleta).toBeIn("graveyard");
    expectFabPlayer(Viserai).toHaveResourceCount(2);
    // Spellblade's 4 damage plus the two Runechants pinging on the attack.
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("timing: each latch applies once — the second attack pays full cost again", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        chest: [bloodsheathSkeleta],
        hand: [spellbladeAssaultRed, spellbladeAssaultYellow],
        arena: [fabToken("runechant"), fabToken("runechant")],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.activate(bloodsheathSkeleta);
    game.helpers.resolveUntilIdle();

    Viserai.play(spellbladeAssaultRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Viserai).toHaveResourceCount(2);

    Viserai.play(spellbladeAssaultYellow);
    // The re-armed Runechant pair triggers on this attack too.
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Viserai).toHaveResourceCount(0);
  });

  it("boundary: without the latch the attack pays its printed 2{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        chest: [bloodsheathSkeleta],
        hand: [spellbladeAssaultRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(spellbladeAssaultRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Viserai).toHaveResourceCount(0);
    expectFabCard(Viserai, bloodsheathSkeleta).toBeIn("chest");
  });
});
