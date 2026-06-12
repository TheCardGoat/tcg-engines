import type { CharacterCard } from "@tcg/lorcana-types";
import { liloJuniorCakeDecoratorI18n } from "./008-lilo-junior-cake-decorator.i18n";
import { support } from "../../../helpers/abilities/support";

export const liloJuniorCakeDecorator: CharacterCard = {
  id: "s1Y",
  canonicalId: "ci_s1Y",
  reprints: ["set5-008"],
  cardType: "character",
  name: "Lilo",
  version: "Junior Cake Decorator",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "005",
  cardNumber: 8,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_907793ab7fb44dd38c58f0dc1172a7d6",
    tcgPlayer: 561596,
  },
  text: "Support",
  classifications: ["Storyborn", "Hero"],
  abilities: [support],
  i18n: liloJuniorCakeDecoratorI18n,
};
