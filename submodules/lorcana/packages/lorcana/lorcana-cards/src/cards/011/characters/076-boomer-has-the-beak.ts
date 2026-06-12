import type { CharacterCard } from "@tcg/lorcana-types";
import { boomerHasTheBeakI18n } from "./076-boomer-has-the-beak.i18n";

export const boomerHasTheBeak: CharacterCard = {
  id: "8Pv",
  canonicalId: "ci_8Pv",
  reprints: ["set11-076"],
  cardType: "character",
  name: "Boomer",
  version: "Has the Beak",
  inkType: ["emerald"],
  franchise: "Fox and the Hound",
  set: "011",
  cardNumber: 76,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_db6ccc6d3dde4e4890ff8a1fd391e905",
    tcgPlayer: 676197,
  },
  text: [
    {
      title: "SPOTTED HIM!",
      description: "When you play this character, you may exert chosen damaged character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "et7-1",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
            filter: [
              {
                type: "damaged",
              },
            ],
          },
          type: "exert",
        },
        type: "optional",
      },
      name: "SPOTTED HIM!",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "SPOTTED HIM! When you play this character, you may exert chosen damaged character.",
    },
  ],
  i18n: boomerHasTheBeakI18n,
};
