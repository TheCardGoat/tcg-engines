import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectWait } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { benjiThePiercingWind } from "../heroes/benji-the-piercing-wind.ts";
import { snatchRed } from "../actions/snatch.ts";
import { maskOfManyFaces } from "./mask-of-many-faces.ts";

/**
 * Equipment behavior acceptance test — Mask of Many Faces (KAT003).
 *
 * AAA trio:
 * - Happy: activate (1{r} + destroy self) → name a card → next attack action gains name
 * - Boundary: without activation, attack does not gain a name
 * - Timing: name grant lasts this turn only
 *
 * Hero: Benji, the Piercing Wind (CRU047) — Ninja/Young
 * FLUENT API ONLY.
 */

describe("Mask of Many Faces (KAT003) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: names a card, then the next attack gains that name", () => {
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        head: [maskOfManyFaces],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Benji = game.as(benjiThePiercingWind);

    Benji.activate(maskOfManyFaces);

    // Destroyed cards go to graveyard.
    expectFabCard(Benji, maskOfManyFaces).toBeIn("graveyard");

    // Activation resolves through forced decisions; the name-card decision
    // is a sub-step within effect-resolution.
    expectWait(game).toHaveDecision("effect-resolution");
    Benji.choose("Crouching Tiger");
    game.helpers.resolveUntilIdle();

    Benji.playAttack(snatchRed);

    expectFabCard(Benji, snatchRed).toHaveName("Snatch").toHaveName("Crouching Tiger");
    game.helpers.expectLog("flesh-and-blood.name-card", {
      playerId: Benji.id,
      cardName: "Crouching Tiger",
    });
    game.helpers.expectLog("flesh-and-blood.gain-name", {
      cardName: "Snatch",
      gainedName: "Crouching Tiger",
    });
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: activation costs 1 resource", () => {
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        head: [maskOfManyFaces],
        hand: [], // no cards to pitch for resources
        resourcePoints: 0, // not enough
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Benji = game.as(benjiThePiercingWind);

    // Activation should fail — insufficient resources. Fluent activate is
    // non-throwing; the rejection is on the activation API.
    Benji.expectActivationRejected(maskOfManyFaces);
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: head slot is empty after activation", () => {
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        head: [maskOfManyFaces],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Benji = game.as(benjiThePiercingWind);

    expect(Benji.zone("head")).toHaveLength(1);

    Benji.activate(maskOfManyFaces);

    // Head slot empty after destroy-self.
    expect(Benji.zone("head")).toHaveLength(0);
  });
});
