import type { CharacterCard } from "@tcg/lorcana-types";
import { brunoMadrigalSingingSeerI18n } from "./020-bruno-madrigal-singing-seer.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const brunoMadrigalSingingSeer: CharacterCard = {
  id: "7WL",
  canonicalId: "ci_7WL",
  reprints: ["set8-020"],
  cardType: "character",
  name: "Bruno Madrigal",
  version: "Singing Seer",
  inkType: ["amber", "amethyst"],
  franchise: "Encanto",
  set: "008",
  cardNumber: 20,
  rarity: "common",
  cost: 7,
  strength: 3,
  willpower: 7,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_5620f9d7486543ea90d2b6a4499c7ae4",
    tcgPlayer: 631364,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "BRIGHT FUTURE",
      description:
        "Whenever this character sings a song, you may draw a card for each character you have in play.",
    },
  ],
  classifications: ["Floodborn", "Ally", "Madrigal"],
  abilities: [
    shift(5),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: {
            controller: "you",
            type: "characters-in-play",
          },
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "1cp-2",
      name: "BRIGHT FUTURE",
      text: "BRIGHT FUTURE Whenever this character sings a song, you may draw a card for each character you have in play.",
      trigger: {
        event: "sing",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: brunoMadrigalSingingSeerI18n,
};
