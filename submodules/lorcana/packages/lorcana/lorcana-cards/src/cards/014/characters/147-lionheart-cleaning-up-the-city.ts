import type { CharacterCard } from "@tcg/lorcana-types";
import { alert } from "../../../helpers/abilities";
import { lionheartCleaningUpTheCityI18n } from "./147-lionheart-cleaning-up-the-city.i18n";

export const lionheartCleaningUpTheCity: CharacterCard = {
  id: "FYs",
  canonicalId: "ci_FYs",
  slug: "lorcana-ci_FYs",
  printings: [
    {
      id: "set14-147",
      artId: "set14-147",
      setCode: "set14",
      collectorNumber: "147",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-147"],
  cardType: "character",
  name: "Lionheart",
  version: "Cleaning Up the City",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "014",
  cardNumber: 147,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b49d7dc0f4f14a7e80b08c83071296ef",
  },
  text: [
    {
      title: "Alert",
      description: "(This character can challenge as if they had Evasive.)",
    },
    {
      title: "CIVIC DUTY 6",
      description: "{I} — Remove all damage from chosen character or location.",
    },
  ],
  abilities: [
    alert,
    {
      id: "lionheart-1",
      name: "CIVIC DUTY",
      type: "activated",
      cost: {
        ink: 6,
      },
      text: "CIVIC DUTY 6 {I} — Remove all damage from chosen character or location.",
      effect: {
        type: "remove-damage",
        amount: "all",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character", "location"],
        },
      },
    },
  ],
  classifications: ["Storyborn"],
  i18n: lionheartCleaningUpTheCityI18n,
};
