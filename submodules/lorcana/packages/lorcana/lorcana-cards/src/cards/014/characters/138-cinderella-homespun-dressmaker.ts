import type { CharacterCard } from "@tcg/lorcana-types";
import { cinderellaHomespunDressmakerI18n } from "./138-cinderella-homespun-dressmaker.i18n";

export const cinderellaHomespunDressmaker: CharacterCard = {
  id: "WDr",
  canonicalId: "ci_WDr",
  slug: "lorcana-ci_WDr",
  printings: [
    {
      id: "set14-138",
      artId: "set14-138",
      setCode: "set14",
      collectorNumber: "138",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-138"],
  cardType: "character",
  name: "Cinderella",
  version: "Homespun Dressmaker",
  inkType: ["sapphire"],
  franchise: "Cinderella",
  set: "014",
  cardNumber: 138,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b5d8bf87d08940b9b253ac3b0d1ba9be",
  },
  text: [
    {
      title: "DISCERNING EYE",
      description:
        "When you play this character, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    {
      id: "WDr-1",
      name: "DISCERNING EYE",
      type: "triggered",
      text: "DISCERNING EYE When you play this character, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "scry",
        amount: 1,
        destinations: [
          {
            zone: "deck-top",
            max: 1,
          },
          {
            zone: "deck-bottom",
            remainder: true,
          },
        ],
      },
    },
  ],
  i18n: cinderellaHomespunDressmakerI18n,
};
