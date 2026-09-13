import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { searingShotRed } from "../actions/searing-shot.ts";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { heartOfFyendalBlue } from "../resources/heart-of-fyendal.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { maskOfMaliciousManifestations } from "./mask-of-malicious-manifestations.ts";

/**
 * Mask of Malicious Manifestations (ARA003) — printed:
 * "Action - {r}, put a card from your hand or arsenal on the bottom of your
 * deck, destroy Mask of Malicious Manifestations: Reveal cards from the top of
 * your deck until you reveal an attack action card. Put it into your hand,
 * then shuffle. Go again. Blade break"
 *
 * Mode B (fab-rules): CR 5.2 all costs ({r}, bottom-deck, destroy-self) are
 * paid at activation; CR 1.13.1 an Action activated ability costs an action
 * point; CR 8.3.5 go again refunds that point when the layer resolves; the
 * reveal skips non-attack-action cards and binds the first attack action.
 */
describe("Mask of Malicious Manifestations (ARA003) AAA", () => {
  it("happy: pay all three costs, dig past a non-attack top card into the attack action, go again", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        head: [maskOfMaliciousManifestations],
        hand: [searingShotRed],
        deck: [brutalAssaultBlue, heartOfFyendalBlue],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(maskOfMaliciousManifestations);
    game.passBoth();

    expectFabCard(Azalea, maskOfMaliciousManifestations).toBeIn("graveyard");
    // The only attack action in the deck is now in hand (the Resource top was skipped).
    expectFabCard(Azalea, brutalAssaultBlue).toBeIn("hand");
    expectFabPlayer(Azalea).toHaveHandCount(1);
    // The pitched-to-bottom cost card stayed in the deck; the {r} was spent.
    expect(Azalea.zone("deck")).toContain(heartOfFyendalBlue.canonicalId);
    expectFabPlayer(Azalea).toHaveResourceCount(0);
    // Action point spent on the Action ability, refunded by go again.
    expectFabPlayer(Azalea).toHaveAP(1);
  });

  it("boundary: activation is rejected with no hand or arsenal card to bottom-deck", () => {
    const noBottomDeckFodder = FabTestEngine.start(
      {
        hero: azalea,
        head: [maskOfMaliciousManifestations],
        hand: [],
        deck: [brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    noBottomDeckFodder.as(azalea).expectActivationRejected(maskOfMaliciousManifestations);

    expectFabCard(noBottomDeckFodder.as(azalea), maskOfMaliciousManifestations).toBeIn("head");
  });

  it("timing: costs are paid at activation but go again only refunds when the layer resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        head: [maskOfMaliciousManifestations],
        hand: [searingShotRed],
        deck: [brutalAssaultBlue, heartOfFyendalBlue],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(maskOfMaliciousManifestations);

    // Costs are already paid while the ability layer is still on the stack.
    expectFabCard(Azalea, maskOfMaliciousManifestations).toBeIn("graveyard");
    expectFabPlayer(Azalea).toHaveResourceCount(0);
    expectFabPlayer(Azalea).toHaveAP(0);
    expect(Azalea.zone("hand")).not.toContain(brutalAssaultBlue.canonicalId);

    game.passBoth();

    // The reveal and the go-again refund happen at resolution.
    expectFabCard(Azalea, brutalAssaultBlue).toBeIn("hand");
    expectFabPlayer(Azalea).toHaveAP(1);
  });
});
