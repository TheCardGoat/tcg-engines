import type { CharacterCard } from "@tcg/lorcana-types";
import { cinderellaTheRightOneI18n } from "./015-cinderella-the-right-one.i18n";

export const cinderellaTheRightOne: CharacterCard = {
  id: "25y",
  canonicalId: "ci_25y",
  reprints: ["set7-015"],
  cardType: "character",
  name: "Cinderella",
  version: "The Right One",
  inkType: ["amber"],
  franchise: "Cinderella",
  set: "007",
  cardNumber: 15,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_7c8e2317de8840ecaa50bffbff20c87d",
    tcgPlayer: 619415,
  },
  text: [
    {
      title: "IF THE SLIPPER FITS",
      description:
        "When you play this character, you may put an item card named The Glass Slipper from your discard on the bottom of your deck to gain 3 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 3,
          type: "gain-lore",
        },
        type: "optional",
      },
      id: "doc-1",
      name: "IF THE SLIPPER FITS",
      text: "IF THE SLIPPER FITS When you play this character, you may put an item card named The Glass Slipper from your discard on the bottom of your deck to gain 3 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: cinderellaTheRightOneI18n,
};
