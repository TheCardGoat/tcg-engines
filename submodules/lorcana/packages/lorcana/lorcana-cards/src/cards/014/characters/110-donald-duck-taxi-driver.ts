import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckTaxiDriverI18n } from "./110-donald-duck-taxi-driver.i18n";

export const donaldDuckTaxiDriver: CharacterCard = {
  id: "1O3",
  canonicalId: "ci_1O3",
  slug: "lorcana-ci_1O3",
  printings: [
    {
      id: "set14-110",
      artId: "set14-110",
      setCode: "set14",
      collectorNumber: "110",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-110"],
  cardType: "character",
  name: "Donald Duck",
  version: "Taxi Driver",
  inkType: ["ruby"],
  set: "014",
  cardNumber: 110,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_071036b6a837424086cfa2a31bd25f53",
  },
  text: [
    {
      title: "RUSH HOUR",
      description:
        "When you play this character, chosen character gains Rush this turn. (They can challenge the turn they're played.)",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      id: "1O3-1",
      name: "RUSH HOUR",
      type: "triggered",
      text: "RUSH HOUR When you play this character, chosen character gains Rush this turn. (They can challenge the turn they're played.)",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        duration: "this-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: donaldDuckTaxiDriverI18n,
};
