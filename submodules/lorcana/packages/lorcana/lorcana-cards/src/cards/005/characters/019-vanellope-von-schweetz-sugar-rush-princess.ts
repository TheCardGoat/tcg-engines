import type { CharacterCard } from "@tcg/lorcana-types";
import { vanellopeVonSchweetzSugarRushPrincessI18n } from "./019-vanellope-von-schweetz-sugar-rush-princess.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const vanellopeVonSchweetzSugarRushPrincess: CharacterCard = {
  id: "5Sq",
  canonicalId: "ci_MsB",
  reprints: ["set5-019"],
  cardType: "character",
  name: "Vanellope von Schweetz",
  version: "Sugar Rush Princess",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "005",
  cardNumber: 19,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_6d0b490fddd34aab828b26cb90a827d6",
    tcgPlayer: 561992,
  },
  text: [
    {
      title: "Shift 2",
    },
    {
      title: "I HEREBY DECREE",
      description:
        "Whenever you play another Princess character, all opposing characters get -1 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess", "Racer"],
  abilities: [
    shift(2),
    {
      effect: {
        duration: "until-start-of-next-turn",
        modifier: -1,
        stat: "strength",
        target: "ALL_OPPOSING_CHARACTERS",
        type: "modify-stat",
      },
      id: "s65-2",
      name: "I HEREBY DECREE",
      text: "I HEREBY DECREE Whenever you play another Princess character, all opposing characters get -1 {S} until the start of your next turn.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Princess",
          excludeSelf: true,
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: vanellopeVonSchweetzSugarRushPrincessI18n,
};
