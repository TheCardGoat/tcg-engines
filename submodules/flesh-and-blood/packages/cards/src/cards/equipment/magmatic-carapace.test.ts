import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { sigilOfProtectionRed } from "../actions/sigil-of-protection.ts";
import { magmaticCarapace } from "./magmatic-carapace.ts";

describe("Magmatic Carapace (PEN017) AAA", () => {
  it("happy: playing an aura taps the carapace to create a Seismic Surge", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [sigilOfProtectionRed],
        resourcePoints: 2,
        actionPoints: 1,
        chest: [magmaticCarapace],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    const sigilId = Bravo.findCardInZone("hand", sigilOfProtectionRed);
    game.playInstance(Bravo.id, sigilId, {}, "explicit");
    game.untilIdle({ optionals: "accept" });

    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 1);
    expectFabCard(Bravo, magmaticCarapace).toBeTapped();
    expectFabCard(Bravo, sigilOfProtectionRed).toBeIn("arena");
  });

  it("boundary: declining the pay keeps the carapace ready and seats no Surge", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [sigilOfProtectionRed],
        resourcePoints: 2,
        actionPoints: 1,
        chest: [magmaticCarapace],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    const sigilId = Bravo.findCardInZone("hand", sigilOfProtectionRed);
    game.playInstance(Bravo.id, sigilId, {}, "explicit");
    game.untilIdle({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 0);
    expectFabCard(Bravo, magmaticCarapace).toBeReady();
  });

  it("keyword: Guardwell leaves -1{d} counters equal to its printed defense", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], chest: [magmaticCarapace], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(magmaticCarapace);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Bravo, magmaticCarapace).toBeIn("chest");
    expectFabCard(Bravo, magmaticCarapace).toHaveDefenseCounters(-2);
    expectFabPlayer(Bravo).toHaveLife(18);
  });
});
