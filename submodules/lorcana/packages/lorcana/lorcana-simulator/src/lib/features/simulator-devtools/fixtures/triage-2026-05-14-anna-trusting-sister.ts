import { elsaQueenRegent } from "@tcg/lorcana-cards/cards/001";
import { annaTrustingSister } from "@tcg/lorcana-cards/cards/008";
import { createFixture } from "./fixture-factory";

export const triage20260514AnnaTrustingSisterFixture = createFixture({
  id: "triage-2026-05-14-anna-trusting-sister",
  name: "Triage 2026-05-14 - Anna Trusting Sister WE CAN DO THIS TOGETHER",
  description:
    "Visual repro for Anna - Trusting Sister WE CAN DO THIS TOGETHER bug. P1 has Elsa in play. Play Anna — the ability should trigger and let P1 put the top card of their deck into their inkwell facedown and exerted.",
  skipPreGame: true,
  playerOne: {
    inkwell: 4,
    hand: [annaTrustingSister],
    play: [{ card: elsaQueenRegent, isDrying: false }],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-14-anna-trusting-sister",
});
