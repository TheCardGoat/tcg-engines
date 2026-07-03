import type { CharacterCard } from "@tcg/lorcana-types";
import { rapunzelGiftedArtistP1PromoI18n } from "./p1-031-rapunzel-gifted-artist-promo.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const rapunzelGiftedArtistP1Promo: CharacterCard = {
  id: "aqh",
  canonicalId: "ci_jGU",
  slug: "lorcana-ci_jGU",
  printings: [
    {
      id: "set2-p1-031-promo",
      artId: "ci_jGU-promo",
      setCode: "set2",
      collectorNumber: "31",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set2-019"],
  cardType: "character",
  name: "Rapunzel",
  version: "Gifted Artist",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "002",
  cardNumber: 31,
  rarity: "special",
  specialRarity: "promo",
  cost: 5,
  strength: 0,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a324c0fddfab4d7681efcf47adae3c6d",
    tcgPlayer: "525089",
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "LET YOUR POWER SHINE",
      description:
        "Whenever you remove 1 or more damage from one of your characters, you may draw a card.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
  abilities: [
    shift(3),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "n2g-2",
      name: "LET YOUR POWER SHINE",
      text: "LET YOUR POWER SHINE Whenever you remove 1 or more damage from one of your characters, you may draw a card.",
      trigger: {
        event: "remove-damage",
        on: "YOUR_CHARACTERS",
        restrictions: [{ type: "during-turn", whose: "your" }],
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: rapunzelGiftedArtistP1PromoI18n,
};
