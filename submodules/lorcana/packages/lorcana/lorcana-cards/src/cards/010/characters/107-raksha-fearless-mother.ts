import type { CharacterCard } from "@tcg/lorcana-types";
import { rakshaFearlessMotherI18n } from "./107-raksha-fearless-mother.i18n";

export const rakshaFearlessMother: CharacterCard = {
  id: "Gk5",
  canonicalId: "ci_Gk5",
  reprints: ["set10-107"],
  cardType: "character",
  name: "Raksha",
  version: "Fearless Mother",
  inkType: ["ruby"],
  franchise: "Jungle Book",
  set: "010",
  cardNumber: 107,
  rarity: "common",
  cost: 3,
  strength: 5,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_2e40c49df1cd47a8ace3dfcb6bec1741",
    tcgPlayer: 659626,
  },
  text: [
    {
      title: "ON PATROL",
      description:
        "Once during your turn, you may pay 1 {I} less to move this character to a location.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "Gk5-1",
      name: "ON PATROL",
      text: "ON PATROL Once during your turn, you may pay 1 {I} less to move this character to a location.",
      type: "static",
      effect: {
        type: "move-cost-reduction",
        reduction: 1,
        target: "SELF",
      },
    },
  ],
  i18n: rakshaFearlessMotherI18n,
};
