/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { andThenAlongCameZeus } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import {
  magicaDeSpellAmbitiousWitch,
  theFirebirdForceOfDestruction,
  ursulaDeceiver,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ursula - Deceiver", () => {
  it("**YOU'LL NEVER EVEN MISS IT** When you play this character, chosen opponent reveals their hand and discards a song card of your choice.", () => {
    const testStore = new TestStore(
      {
        inkwell: ursulaDeceiver.cost,
        hand: [ursulaDeceiver],
      },
      {
        hand: [
          magicaDeSpellAmbitiousWitch,
          theFirebirdForceOfDestruction,
          andThenAlongCameZeus,
        ],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", ursulaDeceiver.id);
    const target = testStore.getByZoneAndId(
      "hand",
      andThenAlongCameZeus.id,
      "player_two",
    );
    const targets = [
      testStore.getByZoneAndId(
        "hand",
        magicaDeSpellAmbitiousWitch.id,
        "player_two",
      ),
      testStore.getByZoneAndId(
        "hand",
        theFirebirdForceOfDestruction.id,
        "player_two",
      ),
    ];
    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toEqual("discard");
    targets.forEach((card) => {
      expect(card.meta.revealed).toEqual(true);
    });
  });
});
