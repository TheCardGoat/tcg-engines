import type { CharacterCard } from "@tcg/lorcana-types";
import { boPeepCaringShepherdI18n } from "./013-bo-peep-caring-shepherd.i18n";

export const boPeepCaringShepherd: CharacterCard = {
  id: "Jcm",
  canonicalId: "ci_Jcm",
  reprints: ["set12-013"],
  cardType: "character",
  name: "Bo Peep",
  version: "Caring Shepherd",
  inkType: ["amber"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 13,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_e63fe9e08c924f4b973fa0f6d4f9a00b",
  },
  text: [
    {
      title: "SOMEBODY DO SOMETHING!",
      description:
        "Your characters named Woody gain Bodyguard. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
    },
  ],
  classifications: ["Storyborn", "Ally", "Toy"],
  abilities: [
    {
      id: "Jcm-1",
      name: "SOMEBODY DO SOMETHING!",
      text: "SOMEBODY DO SOMETHING! Your characters named Woody gain Bodyguard.",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Bodyguard",
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "you",
          selector: "all",
          zones: ["play"],
          filter: [
            {
              type: "attribute",
              attribute: "name",
              comparison: "equals",
              value: "Woody",
            },
          ],
        },
      },
    },
  ],
  i18n: boPeepCaringShepherdI18n,
};
