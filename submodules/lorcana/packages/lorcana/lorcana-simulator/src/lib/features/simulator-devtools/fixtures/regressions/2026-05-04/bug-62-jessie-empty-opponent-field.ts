import { jessieLivelyCowgirl } from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "../../fixture-factory.js";

export const bug62JessieEmptyOpponentField = createFixture({
  id: "bug-62-jessie-empty-opponent-field",
  name: "Bug 62 - Jessie YODEL-AY-HEE-HOO! hangs with empty opponent field",
  description:
    "Jessie - Lively Cowgirl (cost 3) has YODEL-AY-HEE-HOO!: 'Whenever you pay 2 {I} or less to play a card, chosen opposing character gets -1 {S} until the start of your next turn.' Jessie's own play also satisfies the trigger via PART OF A FAMILY-style chain when applicable, but the relevant case is any cost<=2 play she witnesses. To exercise the empty-target guard, P2 has no characters in play. Setup: P1 has Jessie in hand and 3 ink to play her, plus a fresh cost-2 play test. Play Jessie (or a cost <=2 card after she's in play). Bug: when YODEL-AY-HEE-HOO! triggers and there are no opposing characters, the engine still opens a 'choose opposing character' prompt with zero candidates and hangs. Correct behavior: the trigger auto-declines / no-ops when no legal target exists.",
  playerOne: {
    play: [],
    hand: [jessieLivelyCowgirl],
    inkwell: 3,
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "bug-62-jessie-empty-opponent-field",
  skipPreGame: true,
});
