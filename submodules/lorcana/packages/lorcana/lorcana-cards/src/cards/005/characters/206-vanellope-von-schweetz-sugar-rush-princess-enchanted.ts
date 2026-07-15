import type { CharacterCard } from "@tcg/lorcana-types";
import { vanellopeVonSchweetzSugarRushPrincessEnchantedI18n } from "./206-vanellope-von-schweetz-sugar-rush-princess-enchanted.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const vanellopeVonSchweetzSugarRushPrincessEnchanted: CharacterCard = {
  id: "OwE",
  canonicalId: "ci_FSG",
  slug: "lorcana-ci_FSG",
  printings: [
    {
      id: "set5-206-enchanted",
      artId: "ci_FSG-enchanted",
      setCode: "set5",
      collectorNumber: "206",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set5-d23-005", "set5-019"],
  cardType: "character",
  name: "Vanellope von Schweetz",
  version: "Sugar Rush Princess",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "005",
  cardNumber: 206,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b2e4820cbbda4610b54f3e9c00fa4576",
    tcgPlayer: "559537",
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
  i18n: vanellopeVonSchweetzSugarRushPrincessEnchantedI18n,
};
