import type { CharacterCard } from "@tcg/lorcana-types";
import { chernabogEvildoerI18n } from "./003-chernabog-evildoer.i18n";

export const chernabogEvildoer: CharacterCard = {
  id: "xP0",
  canonicalId: "ci_dKG",
  reprints: ["set3-003"],
  cardType: "character",
  name: "Chernabog",
  version: "Evildoer",
  inkType: ["amber"],
  franchise: "Fantasia",
  set: "003",
  cardNumber: 3,
  rarity: "common",
  cost: 10,
  strength: 9,
  willpower: 9,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_7a288d030d1a471fbb818ccfdddc6052",
    tcgPlayer: 539156,
  },
  text: [
    {
      title: "THE POWER OF EVIL",
      description:
        "For each character card in your discard, you pay 1 {I} less to play this character.",
    },
    {
      title: "SUMMON THE SPIRITS",
      description:
        "When you play this character, shuffle all character cards from your discard into your deck.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        amount: {
          type: "filtered-count",
          owner: "you",
          zones: ["discard"],
          cardType: "character",
          filters: [],
        },
        cardType: "character",
        type: "cost-reduction",
      },
      id: "r3g-1",
      name: "THE POWER OF EVIL",
      sourceZones: ["hand"],
      text: "THE POWER OF EVIL For each character card in your discard, you pay 1 {I} less to play this character.",
      type: "static",
    },
    {
      effect: {
        intoDeck: "owner",
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "you",
          selector: "all",
          zones: ["discard"],
        },
        type: "shuffle-into-deck",
      },
      id: "r3g-2",
      name: "SUMMON THE SPIRITS",
      text: "SUMMON THE SPIRITS When you play this character, shuffle all character cards from your discard into your deck.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: chernabogEvildoerI18n,
};
