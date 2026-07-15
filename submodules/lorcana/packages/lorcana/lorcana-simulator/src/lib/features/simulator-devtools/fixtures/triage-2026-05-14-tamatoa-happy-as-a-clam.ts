import { beastsMirror, mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import { tamatoaHappyAsAClam } from "@tcg/lorcana-cards/cards/007";
import { createFixture } from "./fixture-factory";

export const triage20260514TamatoaHappyAsAClamFixture = createFixture({
  id: "triage-2026-05-14-tamatoa-happy-as-a-clam",
  name: "Triage 2026-05-14 - Tamatoa Happy as a Clam COOLEST COLLECTION",
  description:
    "Visual repro for Tamatoa - Happy as a Clam COOLEST COLLECTION bug. P1 has 2 item cards in discard. Play Tamatoa — the ability should trigger and let P1 return up to 2 items from discard to hand.",
  skipPreGame: true,
  playerOne: {
    inkwell: 6,
    hand: [tamatoaHappyAsAClam],
    play: [],
    discard: [beastsMirror, beastsMirror],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [{ card: mickeyMouseTrueFriend, isDrying: false }],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-14-tamatoa-happy-as-a-clam",
});
