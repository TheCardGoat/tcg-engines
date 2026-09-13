/**
 * AAA test for trigger:chain-link-resolve.
 * Representative card: Virulent Touch Red (ARA014) — Assassin/Ranger Attack.
 * Can't be played from hand (arsenal only). When the chain link resolves, if
 * defended by a card from hand, create a Bloodrot Pox under the defending hero.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue } from "../../../fixtures.ts";
import { virulentTouchRed } from "../../../../../../cards/src/cards/actions/virulent-touch.ts";

describe("trigger: chain-link-resolve", () => {
  it("AAA: Virulent Touch creates Bloodrot Pox when defended from hand (ARA014)", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arsenal: [virulentTouchRed],
        deck: 6,
      },
      { hero: bravo, life: 20, hand: [nimblismBlue], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    const attackId = Dash.findCardInZone("arsenal", virulentTouchRed);

    Dash.exec({
      move: "begin-play",
      payload: { instanceId: attackId, target: Bravo.id, from: "arsenal" },
    });
    // Drain stack to open combat / defend step.
    for (let i = 0; i < 8; i += 1) {
      if (game.combat()?.step === "defend" || game.combat()?.step === "reaction") break;
      if (game.getState().rulesStack.length === 0 && !game.getState().decision) break;
      try {
        game.passBoth();
      } catch {
        break;
      }
    }
    if (game.combat()?.step === "attack") {
      try {
        game.passBoth();
      } catch {
        /* continue */
      }
    }
    expect(["defend", "reaction", "damage", "resolution"]).toContain(game.combat()?.step);
    if (game.combat()?.step === "defend") {
      Bravo.defendWith(nimblismBlue);
    }
    game.helpers.resolveRestOfCombat();

    expect(Bravo.zone("arena").some((id) => /token:bloodrot|bloodrot-pox/i.test(id))).toBe(true);
  });

  it("AAA boundary: undefended Virulent Touch creates no Bloodrot Pox", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arsenal: [virulentTouchRed],
        deck: 6,
      },
      { hero: bravo, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    const attackId = Dash.findCardInZone("arsenal", virulentTouchRed);
    const arenaBefore = Bravo.zone("arena").length;

    Dash.exec({
      move: "begin-play",
      payload: { instanceId: attackId, target: Bravo.id, from: "arsenal" },
    });
    game.helpers.resolveRestOfCombat();

    expect(Bravo.zone("arena").length).toBe(arenaBefore);
    expect(Bravo.zone("arena").some((id) => /token:bloodrot|bloodrot-pox/i.test(id))).toBe(false);
  });
});
