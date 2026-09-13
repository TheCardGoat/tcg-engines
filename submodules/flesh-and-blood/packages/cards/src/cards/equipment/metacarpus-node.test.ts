import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { flashBoltYellow } from "../instants/flash-bolt.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { metacarpusNode } from "./metacarpus-node.ts";

/**
 * Metacarpus Node — Wizard Arms d0, Arcane Barrier 1.
 *
 * Printed: "Whenever you play a card with an effect that deals arcane damage,
 * you may pay {r}. If you do, instead it deals that much arcane damage plus 1,
 * and destroy Metacarpus Node at the beginning of the end phase.
 * Arcane Barrier 1"
 */

describe("Metacarpus Node AAA", () => {
  it("happy: paying {r} turns the played card's arcane up by 1 and dooms the node", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        arms: [metacarpusNode],
        hand: [flashBoltYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: blazeFiremind, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.play(flashBoltYellow, { target: game.as(blazeFiremind).id });
    game.passBoth();
    Kano.accept(); // may pay {r} — accepted
    game.helpers.resolveUntilIdle();

    // Flash Bolt deals 2 arcane; the node turns it into 3.
    expectFabPlayer(game.as(blazeFiremind)).toHaveLife(17);
    expectFabPlayer(Kano).toHaveResourceCount(1);
    expectFabCard(Kano, metacarpusNode).toBeIn("arms");

    // The doom: destroyed at the beginning of the end phase.
    Kano.endTurn();
    game.helpers.resolveUntilIdle();
    expectFabCard(Kano, metacarpusNode).toBeIn("graveyard");
  });

  it("boundary: declining keeps the damage printed and the node alive", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        arms: [metacarpusNode],
        hand: [flashBoltYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: blazeFiremind, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.play(flashBoltYellow, { target: game.as(blazeFiremind).id });
    game.passBoth();
    Kano.decline();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(blazeFiremind)).toHaveLife(18);
    expectFabCard(Kano, metacarpusNode).toBeIn("arms");
  });

  it("keyword: Arcane Barrier 1 pays {r} to prevent 1 of the next arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: kano,
        arms: [metacarpusNode],
        hand: [],
        life: 20,
        resourcePoints: 1,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: blazeFiremind },
    );
    const Kano = game.as(kano);

    game.as(blazeFiremind).play(volticBoltRed, { target: Kano.id });
    game.passBoth();
    const choice = Kano.expectDecision("option");
    const barrier = choice.options.find((option) => option.id.includes("arcane-barrier"));
    Kano.chooseOptions(barrier?.id ?? choice.options[0]!.id);

    expectFabPlayer(Kano).toHaveLife(16); // 5 arcane - 1 prevented
    expectFabCard(Kano, metacarpusNode).toBeIn("arms");
  });
});
