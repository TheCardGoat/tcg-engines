import type { CharacterCard } from "@tcg/lorcana-types";
import { cogsworthTalkingClockI18n } from "./143-cogsworth-talking-clock.i18n";

export const cogsworthTalkingClock: CharacterCard = {
  id: "xGr",
  canonicalId: "ci_xGr",
  reprints: ["set2-143"],
  cardType: "character",
  name: "Cogsworth",
  version: "Talking Clock",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "002",
  cardNumber: 143,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6ae3b063360244f19a8aa03334b16078",
    tcgPlayer: 517592,
  },
  text: [
    {
      title: "WAIT A MINUTE",
      description: 'Your characters with Reckless gain "{E} — Gain 1 lore."',
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        ability: {
          cost: {
            exert: true,
          },
          effect: {
            amount: 1,
            target: "CONTROLLER",
            type: "gain-lore",
          },
          name: "WAIT A MINUTE",
          text: "{E} - Gain 1 lore.",
          type: "activated",
        },
        target: {
          count: "all",
          cardTypes: ["character"],
          filter: [
            {
              keyword: "Reckless",
              type: "has-keyword",
            },
          ],
          owner: "you",
          selector: "all",
          zones: ["play"],
        },
        type: "grant-ability",
      },
      id: "y7r-1",
      name: "WAIT A MINUTE",
      text: 'WAIT A MINUTE Your characters with Reckless gain "{E} - Gain 1 lore."',
      type: "static",
    },
  ],
  i18n: cogsworthTalkingClockI18n,
};
