import { describe, expect, it } from "bun:test";
import { agustinMadrigalClumsyDad, hiddenCoveTranquilHaven } from "@tcg/lorcana-cards/cards/004";
import { moanaDeterminedExplorer } from "@tcg/lorcana-cards/cards/005";
import { getLorcanaFixture } from "@/features/simulator-devtools/fixtures/index.js";
import {
  decodeInlineFixtureParam,
  deserializeInlineFixture,
  encodeInlineFixtureParam,
  serializeInlineFixture,
} from "./browser-fixture.js";

describe("browser-fixture", () => {
  it("round-trips challenge-style inline fixtures through a browser-safe payload", () => {
    const encodedFixture = encodeInlineFixtureParam(
      serializeInlineFixture({
        playerOne: {
          play: [moanaDeterminedExplorer],
        },
        playerTwo: {
          play: [
            hiddenCoveTranquilHaven,
            {
              atLocation: hiddenCoveTranquilHaven,
              card: agustinMadrigalClumsyDad,
              exerted: true,
            },
          ],
        },
        seed: "challenge-inline-fixture",
        skipPreGame: true,
      }),
    );

    const fixture = decodeInlineFixtureParam(encodedFixture);
    expect(fixture).toBeDefined();

    const hydratedFixture = deserializeInlineFixture(fixture!);
    expect(hydratedFixture.playerOne.play).toEqual([moanaDeterminedExplorer]);
    expect(hydratedFixture.playerTwo.play).toEqual([
      hiddenCoveTranquilHaven,
      {
        atLocation: hiddenCoveTranquilHaven,
        card: agustinMadrigalClumsyDad,
        exerted: true,
      },
    ]);
    expect(hydratedFixture.seed).toBe("challenge-inline-fixture");
    expect(hydratedFixture.skipPreGame).toBe(true);
  });

  it("preserves registered simulator fixture metadata when serialized", () => {
    const preGameFixture = getLorcanaFixture("pre-game");
    const hydratedFixture = deserializeInlineFixture(serializeInlineFixture(preGameFixture));

    expect(hydratedFixture.id).toBe(preGameFixture.id);
    expect(hydratedFixture.name).toBe(preGameFixture.name);
    expect(hydratedFixture.description).toBe(preGameFixture.description);
    expect(hydratedFixture.seed).toBe(preGameFixture.seed);
    expect(hydratedFixture.skipPreGame).toBe(preGameFixture.skipPreGame);
    expect(hydratedFixture.playerOne.deck).toEqual(preGameFixture.playerOne.deck);
    expect(hydratedFixture.playerTwo.deck).toEqual(preGameFixture.playerTwo.deck);
  });
});
