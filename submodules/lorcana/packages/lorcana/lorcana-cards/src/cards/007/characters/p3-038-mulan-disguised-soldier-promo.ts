import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanDisguisedSoldierP3PromoI18n } from "./p3-038-mulan-disguised-soldier-promo.i18n";

export const mulanDisguisedSoldierP3Promo: CharacterCard = {
  id: "mV1",
  canonicalId: "ci_QFm",
  slug: "lorcana-ci_QFm",
  printings: [
    {
      id: "set7-p3-038-promo",
      artId: "ci_QFm-promo",
      setCode: "set7",
      collectorNumber: "38",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set7-193"],
  cardType: "character",
  name: "Mulan",
  version: "Disguised Soldier",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "007",
  cardNumber: 38,
  rarity: "special",
  specialRarity: "promo",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_51c56768845241c9b79c30510bf3af72",
  },
  text: [
    {
      title: "WHERE DO",
      description:
        "I SIGN IN? When you play this character, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          steps: [
            {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            {
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              type: "discard",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      id: "1p3-1",
      name: "WHERE DO I SIGN IN?",
      text: "WHERE DO I SIGN IN? When you play this character, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: mulanDisguisedSoldierP3PromoI18n,
};
