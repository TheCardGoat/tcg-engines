import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { flashBoltRed } from "./flash-bolt.ts";
import { cloudCoverRed } from "./cloud-cover.ts";

describe("Cloud Cover (PEN246/AUR023/PEN248) AAA", () => {
  it("happy: the red family member prevents the next 3 damage", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, life: 20, hand: [cloudCoverRed], deck: 6 },
      { hero: blazeFiremind, hand: [flashBoltRed], resourcePoints: 2, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Blaze = game.as(blazeFiremind);

    Oscilio.play(cloudCoverRed);
    game.passBoth();
    Oscilio.pass();
    Blaze.play(flashBoltRed, { target: Oscilio.id });
    game.passBoth();

    expectFabPlayer(Oscilio).toHaveLife(20);
    expectFabCard(Oscilio, cloudCoverRed).toBeIn("graveyard");
  });

  it("boundary: without Cloud Cover, the same damage is dealt", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, life: 20, deck: 6 },
      { hero: blazeFiremind, hand: [flashBoltRed], resourcePoints: 2, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Blaze = game.as(blazeFiremind);

    Oscilio.pass();
    Blaze.play(flashBoltRed, { target: Oscilio.id });
    game.passBoth();

    expectFabPlayer(Oscilio).toHaveLife(17);
  });

  it("timing: only the next damage event is prevented", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, life: 20, hand: [cloudCoverRed], deck: 6 },
      {
        hero: blazeFiremind,
        hand: [flashBoltRed, flashBoltRed],
        resourcePoints: 4,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Blaze = game.as(blazeFiremind);
    const bolts = Blaze.cardsIn("hand", flashBoltRed);

    Oscilio.play(cloudCoverRed);
    game.passBoth();
    Oscilio.pass();
    Blaze.play(bolts[0]!, { target: Oscilio.id });
    game.passBoth();
    expectFabPlayer(Oscilio).toHaveLife(20);

    Oscilio.pass();
    Blaze.play(bolts[1]!, { target: Oscilio.id });
    game.passBoth();
    expectFabPlayer(Oscilio).toHaveLife(17);
  });
});
