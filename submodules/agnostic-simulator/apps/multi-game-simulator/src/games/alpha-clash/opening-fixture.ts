import type { OpeningBeat, OpeningFixture } from "@tcg/simulator-presentation/opening";

const card = (id: string, name: string, product: number) => ({
  id,
  name,
  imageUrl: `https://tcgplayer-cdn.tcgplayer.com/product/${product}_400w.jpg`,
});
const board = { leaders: "field", hand: "review", localCount: 8, rivalCount: 8 } as const;
const opening = { leaders: "field", hand: "deck", localCount: 0, rivalCount: 0 } as const;
// Official printed records: alpha-clash-card-data.json. Rule 103.1–8, CR v5.3.
export const alphaClashOpening: OpeningFixture = {
  slug: "alpha-clash",
  name: "Alpha Clash",
  accent: "#e8a16d",
  handSummary: "8 cards · One selective mulligan",
  health: 30,
  deckSize: 50,
  handSize: 8,
  orderChoice: true,
  canMulligan: true,
  rulesUrl: "https://alphaclashtcg.com/how-to-play",
  leaders: [
    card("ac-st-001", "Magnate, Awakened", 535079),
    card("ac-ac1-096", "Torque, the Diabolical", 535040),
  ],
  cards: [
    card("ac-ac1-027", "Sonoro", 534959),
    card("ac-ac1-028", "Magnate, Cunning Planner", 534960),
    card("ac-ac1-029", "The Avenging Guy", 534961),
    card("ac-ac1-030", "Avenging Guy, Trying to Help", 534962),
    card("ac-ac1-031", "Menacing Magnate", 534963),
    card("ac-ac1-032", "Magnate, Ready to Fight", 534964),
    card("ac-ac1-033", "Sonoro, the Fierce Fighter", 534965),
    card("ac-ac1-034", "Magnate, Unwavering might", 534966),
    card("ac-ac1-035", "Sonoro, the Awakened Breaker", 534967),
    card("ac-ac1-036", "Khagan, the Dragon", 534968),
    card("ac-ac1-037", "Magnate, the Undisputed", 534969),
  ],
  initial: [
    {
      ...opening,
      leaders: "showcase",
      id: "contenders",
      title: "Meet your contenders",
      detail: "Both contenders are revealed before turn order is chosen.",
      duration: 1700,
      cue: "card.reveal",
    },
    {
      ...opening,
      id: "dock",
      title: "Meet your contenders",
      detail: "Both contenders take their place at the table.",
      duration: 1050,
    },
    {
      ...opening,
      id: "toss",
      title: "Deciding turn order",
      detail: "The toss winner chooses who takes the first turn.",
      duration: 1600,
    },
    {
      ...opening,
      id: "order",
      title: "You won the toss",
      detail: "Choose who takes the first turn.",
      action: "order",
    },
  ],
  afterOrder: (localFirst) => [
    {
      ...opening,
      id: "shuffle",
      title: localFirst ? "You play first" : "Opponent plays first",
      detail: "Shuffle and cut both decks. Each contender starts at 30 health.",
      duration: 800,
      cue: "deck.shuffle",
    },
    {
      ...board,
      id: "deal",
      title: "Your opening hand",
      detail: "Draw eight cards each.",
      duration: 1800,
    },
    {
      ...board,
      id: "hand",
      title: "Keep or change your hand",
      detail: `${localFirst ? "You declare first." : "Your choice is next."} Select cards to replace, or keep your hand. Opponent keeps. One mulligan.`,
      action: "hand",
    },
  ],
  afterHand: (localFirst, count) => {
    const beats: OpeningBeat[] = count
      ? [
          {
            ...board,
            hand: "return",
            id: "return",
            title: `Returning ${count} ${count === 1 ? "card" : "cards"}`,
            detail: "Both declarations are complete. Unselected cards stay in your hand.",
            duration: 950,
            cue: "card.move",
          },
          {
            ...board,
            hand: "return",
            id: "reshuffle",
            title: "Shuffling your deck",
            detail: "Returned cards are shuffled into the deck before replacements are drawn.",
            duration: 550,
            cue: "deck.shuffle",
          },
          {
            ...board,
            replacement: true,
            id: "redraw",
            title: "Your final opening hand",
            detail: `Draw ${count} replacement ${count === 1 ? "card" : "cards"}. Your mulligan is complete.`,
            duration: 1800,
          },
        ]
      : [];
    return [
      ...beats,
      {
        ...board,
        replacement: count > 0,
        hand: "table",
        id: "settle",
        title: localFirst ? "Your turn" : "Opponent’s turn",
        detail: "The portal starts closed. No start-of-game abilities in this fixture.",
        duration: 1000,
        cue: "turn.change",
      },
      {
        ...board,
        replacement: count > 0,
        hand: "table",
        id: "play",
        title: "Expansion · Resource step",
        detail: `${localFirst ? "You may" : "Opponent may"} deploy a resource. The first player skips their first draw and cannot clash this turn.`,
      },
    ];
  },
};
