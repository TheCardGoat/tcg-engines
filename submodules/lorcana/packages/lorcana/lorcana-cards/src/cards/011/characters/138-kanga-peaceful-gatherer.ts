import type { CharacterCard } from "@tcg/lorcana-types";
import { kangaPeacefulGathererI18n } from "./138-kanga-peaceful-gatherer.i18n";
import { boost } from "../../../helpers/abilities/boost";

export const kangaPeacefulGatherer: CharacterCard = {
  id: "Nld",
  canonicalId: "ci_Nld",
  reprints: ["set11-138"],
  cardType: "character",
  name: "Kanga",
  version: "Peaceful Gatherer",
  inkType: ["sapphire"],
  franchise: "Winnie the Pooh",
  set: "011",
  cardNumber: 138,
  rarity: "common",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_9f1b0784cd5e4536bad1c85dabbd1943",
    tcgPlayer: 676218,
  },
  text: [
    {
      title: "Boost 2 {I}",
    },
    {
      title: "EXTRA HELP",
      description: "While there's a card under this character, she gets +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Whisper"],
  abilities: [
    boost(2),
    {
      id: "i6v-2",
      name: "EXTRA HELP",
      type: "static",
      condition: {
        type: "has-card-under",
      },
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      text: "EXTRA HELP While there’s a card under this character, she gets +1 {L}.",
    },
  ],
  i18n: kangaPeacefulGathererI18n,
};
