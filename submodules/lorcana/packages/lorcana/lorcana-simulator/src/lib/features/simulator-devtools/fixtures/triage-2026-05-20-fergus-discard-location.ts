import { fergusOutpostBuilder, remoteInklandsDesertRuins } from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "./fixture-factory";

export const triage20260520FergusDiscardLocationFixture = createFixture({
  id: "triage-2026-05-20-fergus-discard-location",
  name: "Triage 2026-05-20 - Fergus discard location",
  description:
    "Visual validation for Fergus - Outpost Builder JUST THE SPOT with no locations in hand. Quest with Fergus, accept JUST THE SPOT, then select Remote Inklands - Desert Ruins from discard. The location should be playable for free from discard.",
  skipPreGame: true,
  playerOne: {
    inkwell: 0,
    hand: [],
    play: [{ card: fergusOutpostBuilder, isDrying: false }],
    discard: [remoteInklandsDesertRuins],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-20-fergus-discard-location",
});
