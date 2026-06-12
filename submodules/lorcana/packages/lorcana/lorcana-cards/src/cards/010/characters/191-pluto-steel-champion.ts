import type { CharacterCard } from "@tcg/lorcana-types";
import { plutoSteelChampionI18n } from "./191-pluto-steel-champion.i18n";

export const plutoSteelChampion: CharacterCard = {
  id: "hQC",
  canonicalId: "ci_hQC",
  reprints: ["set10-191"],
  cardType: "character",
  name: "Pluto",
  version: "Steel Champion",
  inkType: ["steel"],
  set: "010",
  cardNumber: 191,
  rarity: "rare",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_bd58d594eb5940b98b648d9eeffe6272",
    tcgPlayer: 659631,
  },
  text: [
    {
      title: "WINNER TAKE ALL",
      description:
        "During your turn, whenever one of your other Steel characters banishes another character in a challenge, gain 2 lore.",
    },
    {
      title: "MAKE ROOM",
      description: "Whenever you play another Steel character, you may banish chosen item.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "1g1-1",
      name: "WINNER TAKE ALL",
      text: "WINNER TAKE ALL During your turn, whenever one of your other Steel characters banishes another character in a challenge, gain 2 lore.",
      trigger: {
        event: "banish-in-challenge",
        on: {
          controller: "you",
          cardType: "character",
          excludeSelf: true,
          filters: [{ type: "ink-type", inkType: "steel" }],
        },
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      type: "triggered",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "1g1-2",
      name: "MAKE ROOM",
      text: "MAKE ROOM Whenever you play another Steel character, you may banish chosen item.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "character",
          excludeSelf: true,
          filters: [{ type: "ink-type", inkType: "steel" }],
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: plutoSteelChampionI18n,
};
