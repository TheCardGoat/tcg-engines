import type { OpeningFixture } from "@tcg/simulator-presentation/opening";
import { grandArchiveOpeningCards as cards } from "./opening-cards";

const empty = { leaders: "hidden", hand: "deck", localCount: 0, rivalCount: 0 } as const;
const hand = { leaders: "field", hand: "review", localCount: 7, rivalCount: 7 } as const;
/** Starting the Game, Standard Games 4–7 and Turn One 1–2. No generic mulligan. */
export const grandArchiveOpening: OpeningFixture = {
  slug: "grand-archive",
  name: "Grand Archive",
  accent: "#94c9bc",
  handSummary: "Spirit On Enter · No standard mulligan",
  health: 15,
  deckSize: 60,
  handSize: 7,
  orderChoice: false,
  canMulligan: false,
  auxiliaryDeck: { label: "Material", beforeReveal: 12, afterReveal: 11 },
  rulesUrl: "https://rules.gatcg.com/general-rules/general-rules-starting-the-game",
  leaders: [cards[0], cards[1]],
  cards: cards.slice(2),
  initial: [
    {
      ...empty,
      id: "shuffle",
      title: "Prepare your decks",
      detail: "Shuffle and cut both main decks. Material decks stay separate.",
      duration: 800,
      cue: "deck.shuffle",
    },
    {
      ...empty,
      id: "toss",
      title: "Deciding turn order",
      detail: "An agreed random method determines the first player.",
      duration: 1600,
    },
    {
      ...empty,
      id: "order",
      title: "Determine the first player",
      detail: "The agreed random method sets turn order before either starting hand is drawn.",
      action: "order",
    },
  ],
  afterOrder: (localFirst) => [
    {
      ...empty,
      id: "pregame",
      title: localFirst ? "You play first" : "Opponent plays first",
      detail: "Pre-game actions are complete. Reveal both level 0 Spirits together.",
      action: "reveal",
    },
    {
      ...empty,
      leaders: "showcase",
      id: "spirits",
      title: "Spirits awaken",
      detail: "Spirit of Fire and Spirit of Wind · On Enter: Draw seven cards.",
      duration: 1700,
      cue: "card.reveal",
    },
    {
      ...empty,
      leaders: "field",
      id: "dock",
      title: "Spirits awaken",
      detail: "Both Spirits take their place before On Enter abilities resolve.",
      duration: 1050,
    },
    {
      ...hand,
      localCount: localFirst ? 7 : 0,
      rivalCount: localFirst ? 0 : 7,
      id: "draw-first",
      title: localFirst ? "Spirit of Fire · On Enter" : "Spirit of Wind · On Enter",
      detail:
        "The first player draws seven. No player actions until both On Enter abilities resolve.",
      duration: 1800,
    },
    {
      ...hand,
      id: "draw-second",
      title: localFirst ? "Spirit of Wind · On Enter" : "Spirit of Fire · On Enter",
      detail: "The second player draws seven.",
      duration: 1800,
    },
    {
      ...hand,
      id: "hand",
      title: "Your opening hand",
      detail: "Both Spirit abilities have resolved. Grand Archive has no standard mulligan.",
      action: "hand",
    },
  ],
  afterHand: (localFirst) => [
    {
      ...hand,
      hand: "table",
      id: "settle",
      title: localFirst ? "Your turn" : "Opponent’s turn",
      detail: "Turn one · Skip Wake Up, Materialize, Recollection, and Draw.",
      duration: 1000,
      cue: "turn.change",
    },
    {
      ...hand,
      hand: "table",
      id: "play",
      title: "Main phase",
      detail: `${localFirst ? "You have" : "Opponent has"} the opportunity. The first player cannot attack this turn.`,
    },
  ],
};
