import type { LocationCard } from "@tcg/lorcana-types";
import { theUnderworldRiverStyxI18n } from "./034-the-underworld-river-styx.i18n";

export const theUnderworldRiverStyx: LocationCard = {
  id: "hKJ",
  canonicalId: "ci_hKJ",
  slug: "lorcana-ci_hKJ",
  printings: [
    {
      id: "set4-034",
      artId: "set4-034",
      setCode: "set4",
      collectorNumber: "34",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set4-034"],
  cardType: "location",
  name: "The Underworld",
  version: "River Styx",
  inkType: ["amber"],
  franchise: "Hercules",
  set: "004",
  cardNumber: 34,
  rarity: "rare",
  cost: 2,
  willpower: 6,
  moveCost: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0c75f068ac98487f9544d1bce3858b39",
    tcgPlayer: "550564",
  },
  text: [
    {
      title: "SAVE",
      description:
        "A SOUL Whenever a character quests while here, you may pay 3 {I} to return a character card from your discard to your hand.",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 3,
          },
          effect: {
            cardType: "character",
            target: "CONTROLLER",
            type: "return-from-discard",
          },
        },
        type: "optional",
      },
      id: "6fe-1",
      name: "SAVE A SOUL",
      text: "SAVE A SOUL Whenever a character quests while here, you may pay 3 {I} to return a character card from your discard to your hand.",
      trigger: {
        event: "quest",
        on: "CHARACTERS_HERE",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: theUnderworldRiverStyxI18n,
};
