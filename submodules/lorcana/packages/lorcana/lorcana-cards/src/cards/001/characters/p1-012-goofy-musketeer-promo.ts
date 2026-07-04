import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyMusketeerP1PromoI18n } from "./p1-012-goofy-musketeer-promo.i18n";

import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const goofyMusketeerP1Promo: CharacterCard = {
  id: "Ja1",
  canonicalId: "ci_BTg",
  slug: "lorcana-ci_BTg",
  printings: [
    {
      id: "set1-p1-012-promo",
      artId: "ci_BTg-promo",
      setCode: "set1",
      collectorNumber: "12",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set1-004"],
  cardType: "character",
  name: "Goofy",
  version: "Musketeer",
  inkType: ["amber"],
  set: "001",
  cardNumber: 12,
  rarity: "special",
  specialRarity: "promo",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9bd583ab207a4366a12f37ab94ed8619",
    tcgPlayer: "501751",
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "AND TWO FOR TEA!",
      description:
        "When you play this character, you may remove up to 2 damage from each of your Musketeer characters.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Musketeer"],
  abilities: [
    bodyguard,
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: { type: "up-to", value: 2 },
          target: {
            cardTypes: ["character"],
            count: "all",
            owner: "you",
            selector: "all",
            zones: ["play"],
            filter: [
              {
                type: "has-classification",
                classification: "Musketeer",
              },
            ],
          },
          type: "remove-damage",
        },
        type: "optional",
      },
      id: "11w-2",
      name: "AND TWO FOR TEA!",
      text: "AND TWO FOR TEA! When you play this character, you may remove up to 2 damage from each of your Musketeer characters.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: goofyMusketeerP1PromoI18n,
};
