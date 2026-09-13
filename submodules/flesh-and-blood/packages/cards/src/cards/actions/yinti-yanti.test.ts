import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { confidence } from "../tokens/confidence.ts";
import { yintiYantiRed } from "./yinti-yanti.ts";

describe("Yinti Yanti (MON290) AAA", () => {
  it("happy: attacking while you control an aura grants +1{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [yintiYantiRed], arena: [confidence], actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    game.as(dash).playAttack(yintiYantiRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: no aura leaves printed 3{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [yintiYantiRed], actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    game.as(dash).playAttack(yintiYantiRed);
    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: the +1{p} is only while this is attacking", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [yintiYantiRed], arena: [confidence], actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(yintiYantiRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabCard(Dash, yintiYantiRed).toBeIn("graveyard");
  });
});
