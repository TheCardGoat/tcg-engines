/**
 * @jest-environment node
 */

import { expect, it } from "@jest/globals";
import {
  heiheiBoatSnack,
  mickeyMouseArtfulRogue,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

it("Sing a song paying costs", () => {});

it("Glimmer sings a song", () => {
  const testStore = new TestStore({
    inkwell: hakunaMatata.cost,
    hand: [hakunaMatata],
    play: [mickeyMouseArtfulRogue],
  });

  const song = testStore.getByZoneAndId("hand", hakunaMatata.id);
  const singer = testStore.getByZoneAndId("play", mickeyMouseArtfulRogue.id);

  singer.sing(song);

  expect(
    testStore.store.tableStore
      .getTable("player_one")
      .zones.inkwell.cards.filter((card) => !card.ready),
  ).toHaveLength(0);

  expect(song.zone).toEqual("discard");
});

it("Invalid glimmer sings a song", () => {
  const testStore = new TestStore({
    hand: [hakunaMatata],
    play: [heiheiBoatSnack],
  });

  const song = testStore.getByZoneAndId("hand", hakunaMatata.id);
  const singer = testStore.getByZoneAndId("play", heiheiBoatSnack.id);

  singer.sing(song);

  expect(singer.ready).toBeTruthy();
  expect(song.zone).toEqual("hand");
});

it("Glimmer, with singer ability, sings a song", () => {});
