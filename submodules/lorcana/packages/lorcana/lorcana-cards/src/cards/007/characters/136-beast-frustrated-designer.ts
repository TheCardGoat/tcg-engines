import type { CharacterCard } from "@tcg/lorcana-types";
import { beastFrustratedDesignerI18n } from "./136-beast-frustrated-designer.i18n";

export const beastFrustratedDesigner: CharacterCard = {
  id: "RJq",
  canonicalId: "ci_RJq",
  reprints: ["set7-136"],
  cardType: "character",
  name: "Beast",
  version: "Frustrated Designer",
  inkType: ["ruby", "sapphire"],
  franchise: "Beauty and the Beast",
  set: "007",
  cardNumber: 136,
  rarity: "rare",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_ddee28debf2d4fc7ade06acadd09d058",
    tcgPlayer: 618145,
  },
  text: [
    {
      title: "I'VE HAD IT!",
      description: "{E}, 2 {I}, Banish 2 of your items — Deal 5 damage to chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince", "Inventor"],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 2,
        banishItem: 2,
      },
      effect: {
        amount: 5,
        target: "CHOSEN_CHARACTER",
        type: "deal-damage",
      },
      id: "1u2-1",
      name: "I'VE HAD IT!",
      text: "I'VE HAD IT! {E}, 2 {I}, Banish 2 of your items — Deal 5 damage to chosen character.",
      type: "activated",
    },
  ],
  i18n: beastFrustratedDesignerI18n,
};
