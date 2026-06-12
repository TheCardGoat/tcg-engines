import type { CharacterCard } from "@tcg/lorcana-types";
import { ursulaEricsBrideI18n } from "./024-ursula-erics-bride.i18n";

export const ursulaEricsBride: CharacterCard = {
  id: "cjn",
  canonicalId: "ci_cjn",
  reprints: ["set4-024"],
  cardType: "character",
  name: "Ursula",
  version: "Eric's Bride",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 24,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_982da8b7486a480fac3fd751a353a4eb",
    tcgPlayer: 547763,
  },
  text: [
    {
      title: "Shift: Discard a song card ",
      description:
        "(You may discard a song card to play this on top of one of your characters named Ursula.)",
    },
    {
      title: "VANESSA'S DESIGN",
      description:
        "Whenever this character quests, chosen opponent reveals their hand and discards a non-character card of your choice.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Princess", "Sorcerer"],
  abilities: [
    {
      id: "cjn-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        discardCards: 1,
        discardCardType: "song",
      },
      shiftTarget: "Ursula",
      text: "Shift: Discard a song card (You may discard a song card to play this on top of one of your characters named Ursula.)",
    },
    {
      id: "cjn-2",
      type: "triggered",
      name: "VANESSA'S DESIGN",
      text: "VANESSA'S DESIGN Whenever this character quests, chosen opponent reveals their hand and discards a non-character card of your choice.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal-hand",
            target: "OPPONENT",
          },
          {
            type: "discard",
            amount: 1,
            target: "OPPONENT",
            from: "hand",
            chosen: true,
            chosenBy: "you",
            filter: {
              notCardType: "character",
            },
          },
        ],
      },
    },
  ],
  i18n: ursulaEricsBrideI18n,
};
