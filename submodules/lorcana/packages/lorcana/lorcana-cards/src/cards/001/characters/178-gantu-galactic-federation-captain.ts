import type { CharacterCard } from "@tcg/lorcana-types";
import { gantuGalacticFederationCaptainI18n } from "./178-gantu-galactic-federation-captain.i18n";

export const gantuGalacticFederationCaptain: CharacterCard = {
  id: "A1d",
  canonicalId: "ci_A1d",
  reprints: ["set1-178"],
  cardType: "character",
  name: "Gantu",
  version: "Galactic Federation Captain",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "001",
  cardNumber: 178,
  rarity: "legendary",
  cost: 8,
  strength: 6,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c165a1025f82402fa3834ed4c9da14ba",
    tcgPlayer: 488097,
  },
  text: [
    {
      title: "UNDER ARREST",
      description: "Characters with cost 2 or less can't challenge your characters.",
    },
  ],
  classifications: ["Storyborn", "Alien", "Captain"],
  abilities: [
    {
      id: "c3k-1",
      name: "UNDER ARREST",
      text: "UNDER ARREST Characters with cost 2 or less can't challenge your characters.",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "YOUR_CHARACTERS",
        challengerFilter: {
          type: "cost-comparison",
          operator: "lte",
          value: 2,
        },
      },
    },
  ],
  i18n: gantuGalacticFederationCaptainI18n,
};
