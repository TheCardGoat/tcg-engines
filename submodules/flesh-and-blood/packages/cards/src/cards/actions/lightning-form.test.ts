import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { briar, brutalAssaultBlue } from "../shared/test-recipients.ts";
import { lightningFormRed } from "./lightning-form.ts";

describe("Lightning Form (AUA012) AAA", () => {
  it("happy: when this hits, create an Embodiment of Lightning token under your control", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [lightningFormRed], actionPoints: 1, resourcePoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.attackWith(lightningFormRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(15);
    expect(Briar.zone("arena")).toContain("token:embodiment-of-lightning");
    expect(game.combat()).toBeNull();
  });

  it("boundary: a miss creates no Embodiment of Lightning token", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [lightningFormRed], actionPoints: 1, resourcePoints: 1, deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue, snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.attackWith(lightningFormRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, snatchRed]);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Briar.zone("arena")).not.toContain("token:embodiment-of-lightning");
    expect(Dash.zone("arena")).not.toContain("token:embodiment-of-lightning");
  });

  it("timing: the Embodiment of Lightning token is under the attacker's control", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [lightningFormRed], actionPoints: 1, resourcePoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.attackWith(lightningFormRed);
    game.closeCombat({ ordering: "listed" });

    expect(Briar.zone("arena")).toContain("token:embodiment-of-lightning");
    expect(Dash.zone("arena")).not.toContain("token:embodiment-of-lightning");
  });
});
