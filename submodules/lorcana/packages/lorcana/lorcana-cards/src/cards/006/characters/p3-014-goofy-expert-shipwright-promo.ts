import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyExpertShipwrightP3PromoI18n } from "./p3-014-goofy-expert-shipwright-promo.i18n";

import { ward } from "../../../helpers/abilities/ward";

export const goofyExpertShipwrightP3Promo: CharacterCard = {
  id: "usY",
  canonicalId: "ci_usY",
  slug: "lorcana-ci_usY",
  printings: [
    {
      id: "set6-p3-014-promo",
      artId: "ci_usY-promo",
      setCode: "set6",
      collectorNumber: "14",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set6-089"],
  cardType: "character",
  name: "Goofy",
  version: "Expert Shipwright",
  inkType: ["emerald"],
  set: "006",
  cardNumber: 14,
  rarity: "special",
  specialRarity: "promo",
  cost: 5,
  strength: 1,
  willpower: 4,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_45321c3501974bd39455f3cc7346f535",
    tcgPlayer: "650209",
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "CLEVER DESIGN",
      description:
        "Whenever this character quests, chosen character gains Ward until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Inventor"],
  abilities: [
    ward,
    {
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Ward",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "gjx-2",
      name: "CLEVER DESIGN",
      text: "CLEVER DESIGN Whenever this character quests, chosen character gains Ward until the start of your next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: goofyExpertShipwrightP3PromoI18n,
};
