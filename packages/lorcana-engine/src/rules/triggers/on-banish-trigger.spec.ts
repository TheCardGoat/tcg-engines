import { describe, expect, it } from "@jest/globals";
/**
 * @jest-environment node
 */
import { cheshireCatNotAllThereTestCase } from "@lorcanito/lorcana-engine/cards/001/characters/green/071-cheshire-cat-not-all-there.spec";
import { teKaHeartlessTestCase } from "@lorcanito/lorcana-engine/cards/001/characters/silver/192-te-ka-heartless.spec";
import { princePhillipTestCase } from "@lorcanito/lorcana-engine/cards/001/characters/yellow/016-prince-phillip-dragon-slayer.spec";

describe("On Banish in a challenge", () => {
  it("Whenever this character banishes another character in a challenge", () => {
    teKaHeartlessTestCase();
  });

  it("Whenever one of your characters with (...) is banished", () => {});

  it.skip("When this character challenges and is banished", () => {
    princePhillipTestCase();
  });

  it("When this character is challenged and banished", () => {
    cheshireCatNotAllThereTestCase();
  });

  describe("Whenever one of your other characters is banished in a challenge", () => {});
});
