import type { CharacterCard } from "@tcg/lorcana-types";
import { launchpadHideoutDefenderI18n } from "./172-launchpad-hideout-defender.i18n";

export const launchpadHideoutDefender: CharacterCard = {
  id: "wIl",
  canonicalId: "ci_wIl",
  reprints: ["set11-172"],
  cardType: "character",
  name: "Launchpad",
  version: "Hideout Defender",
  inkType: ["steel"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 172,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_31c0320e66744254b1a8a70f108427aa",
    tcgPlayer: 677139,
  },
  text: [
    {
      title: "STAND GUARD",
      description: "Your locations gain Resist +1.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      id: "158-1",
      name: "STAND GUARD",
      text: "STAND GUARD Your locations gain Resist +1.",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["location"],
        },
      },
    },
  ],
  i18n: launchpadHideoutDefenderI18n,
};
