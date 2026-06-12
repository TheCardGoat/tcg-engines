import type { CharacterCard } from "@tcg/lorcana-types";
import { gadgetHackwrenchFinderOfLostPartsI18n } from "./147-gadget-hackwrench-finder-of-lost-parts.i18n";

export const gadgetHackwrenchFinderOfLostParts: CharacterCard = {
  id: "XOw",
  canonicalId: "ci_XOw",
  reprints: ["set12-147"],
  cardType: "character",
  name: "Gadget Hackwrench",
  version: "Finder of Lost Parts",
  inkType: ["sapphire"],
  franchise: "Rescue Rangers",
  set: "012",
  cardNumber: 147,
  rarity: "common",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_bf923e0701574d3b954ea18e6ea2baf5",
  },
  text: [
    {
      title: "USEFUL BITS",
      description:
        "When this character leaves play, you may return an item card from your discard to your hand.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Inventor"],
  abilities: [
    {
      id: "XOw-1",
      name: "USEFUL BITS",
      text: "USEFUL BITS When this character leaves play, you may return an item card from your discard to your hand.",
      type: "triggered",
      trigger: {
        event: "leave-play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "return-from-discard",
          cardType: "item",
          target: "CONTROLLER",
          count: 1,
        },
      },
    },
  ],
  i18n: gadgetHackwrenchFinderOfLostPartsI18n,
};
