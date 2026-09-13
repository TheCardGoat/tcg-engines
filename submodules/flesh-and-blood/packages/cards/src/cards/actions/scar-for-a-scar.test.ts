import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { scarForAScarRed } from "./scar-for-a-scar.ts";

describe("Scar for a Scar (IRA009) AAA", () => {
  it("happy: when behind on life the attack gains go again and refunds the AP", () => {
    const game = FabTestEngine.start(
      { hero: briar, life: 10, hand: [scarForAScarRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(scarForAScarRed);
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("boundary: at equal life it does not gain go again", () => {
    const game = FabTestEngine.start(
      { hero: briar, life: 20, hand: [scarForAScarRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(scarForAScarRed);
    expectCombat(game).notToHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Briar).toHaveAP(0);
  });
});
