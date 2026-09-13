import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { prism } from "../heroes/prism.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { blessingOfSpiritsBlue } from "../actions/blessing-of-spirits.ts";
import { celestialKimono } from "./celestial-kimono.ts";

/**
 * Celestial Kimono (DYN213) — Illusionist Chest, Ward 1 (no printed defence).
 * Printed: "Once per turn, when Celestial Kimono or a non-token permanent you
 * control with ward is destroyed, gain {r}. Ward 1"
 * Snatch (4{p}) forces the ward destruction that is the destroy event.
 */

function runWardCombat(prismSeat: Record<string, unknown>, dashHand: (typeof snatchRed)[]) {
  return FabTestEngine.start(
    { hero: dash, hand: dashHand, actionPoints: 1, deck: 6 },
    { hero: prism, hand: [], life: 20, resourcePoints: 0, deck: 6, ...prismSeat },
    FAB_MANUAL_HARNESS,
  );
}

function resolveWardCombat(game: ReturnType<typeof FabTestEngine.start>) {
  const Dash = game.as(dash);
  const Prism = game.as(prism);
  Dash.playAttack(snatchRed);
  Prism.defendWith();
  Dash.pass();
  Prism.pass();
  Dash.pass();
  Prism.pass();
  // Answer the surfaced resolution decisions: the ward ordering prompt and the
  // simultaneous-trigger ordering prompt. Both keep the presented/listed order.
  for (let i = 0; i < 4; i += 1) {
    const wait = game.waitState();
    if (wait.kind !== "decision") break;
    const actor = wait.decision.actorId === Dash.id ? Dash : Prism;
    if (wait.decision.kind === "ordering") actor.chooseListedOrder();
    else if (wait.decision.kind === "option") actor.choose("player-2");
    else break;
  }
  game.untilIdle();
}

describe("Celestial Kimono (DYN213) AAA", () => {
  it("happy: ward destroys the kimono to prevent 1 and its destroy grants 1{r}", () => {
    const game = runWardCombat({ chest: [celestialKimono] }, [snatchRed]);
    const Prism = game.as(prism);

    resolveWardCombat(game);

    expectFabPlayer(Prism).toHaveLife(17); // 4{p} minus the prevented 1
    expectFabCard(Prism, celestialKimono).toBeIn("graveyard");
    expectFabPlayer(Prism).toHaveResourceCount(1);
  });

  it("boundary: a destroyed non-token ward aura grants the resource with the kimono seated", () => {
    const game = runWardCombat({ chest: [celestialKimono], arena: [blessingOfSpiritsBlue] }, [
      snatchRed,
    ]);
    const Prism = game.as(prism);

    resolveWardCombat(game);

    // Both Ward 1s fire: 2 of the 4 damage is prevented.
    expectFabPlayer(Prism).toHaveLife(18);
    expectFabCard(Prism, blessingOfSpiritsBlue).toBeIn("graveyard");
    expectFabCard(Prism, celestialKimono).toBeIn("graveyard");
    // The gain is once per turn even though two ward permanents were destroyed.
    expectFabPlayer(Prism).toHaveResourceCount(1);
  });
});
