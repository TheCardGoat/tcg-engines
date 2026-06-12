import type { CharacterCard } from "@tcg/lorcana-types";
import { tananaWiseWomanI18n } from "./156-tanana-wise-woman.i18n";

export const tananaWiseWoman: CharacterCard = {
  id: "PPy",
  canonicalId: "ci_PPy",
  reprints: ["set5-156"],
  cardType: "character",
  name: "Tanana",
  version: "Wise Woman",
  inkType: ["sapphire"],
  franchise: "Brother Bear",
  set: "005",
  cardNumber: 156,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6746b8da59f742ad83ff79efdcbe35a7",
    tcgPlayer: 560493,
  },
  text: [
    {
      title: "YOUR BROTHERS NEED GUIDANCE",
      description:
        "When you play this character, you may remove up to 1 damage from chosen character or location.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: { type: "up-to", value: 1 },
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "remove-damage",
        },
        type: "optional",
      },
      id: "1b7-1",
      name: "YOUR BROTHERS NEED GUIDANCE",
      text: "YOUR BROTHERS NEED GUIDANCE When you play this character, you may remove up to 1 damage from chosen character or location.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: tananaWiseWomanI18n,
};
