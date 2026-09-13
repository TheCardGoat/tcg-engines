import { runeFlashBlue } from "./rune-flash.ts";
import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { runeFlashRed } from "./rune-flash.ts";

/**
 * Rune Flash (ARC100) — Runeblade Action - Attack (red).
 *
 * Printed: Rune Flash costs {r} less to play for each Runechant you control.
 *          Go again
 *
 * CR 5.4.2/6.2: the self-cost static generates a continuous effect while
 * functional (applies from hand at play time). CR 8.6.3: Runechants are
 * named "Runechant" (exact name match) and are destroyed when their
 * controller plays an attack action card — the module's filter once read
 * "Runechant Token", never matched, and left the discount at 0 (W1-FIX,
 * plan §5). CR 8.3.5 go again: gain an action point at chain-link
 * resolution.
 */

const runechant = fabToken("runechant");

describe("Rune Flash (ARC100) AAA", () => {
  it("happy: 2 Runechants reduce the 3{r} cost to 1", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [runeFlashRed],
        arena: [runechant, runechant],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(runeFlashRed);

    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).toHaveKeyword("go-again");
    expectFabPlayer(Briar).toHaveResourceCount(0);
  });

  it("boundary: with no Runechants the full 3{r} cost is unpayable at 2{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [runeFlashRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    expect(() => Briar.attackWith(runeFlashRed)).toThrow();
    expectFabPlayer(Briar).toHaveResourceCount(2);
  });

  it("timing: the first play consumes the Runechants; go again funds the second attempt", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [runeFlashRed, runeFlashRed],
        arena: [runechant, runechant],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    const copies = Briar.cardsIn("hand", runeFlashRed);

    // First copy: 3{r} - 2 Runechants = 1{r} paid, 1{r} banked.
    Briar.attackWith(copies[0]!);
    expectCombat(game).toHaveAttackPower(4);
    expectFabPlayer(Briar).toHaveResourceCount(1);
    game.helpers.resolveRestOfCombat();
    // Go again refunded the action point, so a second attack is still legal.
    expectFabPlayer(Briar).toHaveAP(2);

    // But the Runechants were destroyed by the first play, and the second
    // copy faces the full 3{r} cost with only 1{r} banked.
    expect(Briar.zone("arena").filter((id) => id === "token:runechant")).toHaveLength(0);
    expect(() => Briar.attackWith(copies[1]!)).toThrow();
  });

  it("happy: 2 Runechants reduce the 3{r} cost to 1", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [runeFlashBlue],
        arena: [runechant, runechant],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(runeFlashBlue);

    expectCombat(game).toHaveAttackPower(2);
    expectCombat(game).toHaveKeyword("go-again");
    expectFabPlayer(Briar).toHaveResourceCount(0);
  });
});
