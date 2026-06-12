import type { ActionCard } from "@tcg/lorcana-types";
import { restoringAtlantisI18n } from "./201-restoring-atlantis.i18n";

export const restoringAtlantis: ActionCard = {
  id: "ADz",
  canonicalId: "ci_ndm",
  reprints: ["set7-201"],
  cardType: "action",
  name: "Restoring Atlantis",
  inkType: ["steel"],
  franchise: "Atlantis",
  set: "007",
  cardNumber: 201,
  rarity: "rare",
  cost: 5,
  inkable: false,
  externalIds: {
    lorcast: "crd_ad5f241dfb68479189af1ac3802327d7",
    tcgPlayer: 619750,
  },
  text: "Your characters can't be challenged until the start of your next turn.",
  abilities: [
    {
      effect: {
        duration: "until-start-of-next-turn",
        restriction: "cant-be-challenged",
        target: "CONTROLLER",
        type: "restriction",
      },
      id: "g4p-1",
      text: "Your characters can't be challenged until the start of your next turn.",
      type: "action",
    },
  ],
  i18n: restoringAtlantisI18n,
};
