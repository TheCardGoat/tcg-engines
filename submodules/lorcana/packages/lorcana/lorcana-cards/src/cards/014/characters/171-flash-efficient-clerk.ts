import type { CharacterCard } from "@tcg/lorcana-types";
import { resist } from "../../../helpers/abilities/resist";
import { flashEfficientClerkI18n } from "./171-flash-efficient-clerk.i18n";

export const flashEfficientClerk: CharacterCard = {
  id: "Kk7",
  canonicalId: "ci_Kk7",
  slug: "lorcana-ci_Kk7",
  printings: [
    {
      id: "set14-171",
      artId: "set14-171",
      setCode: "set14",
      collectorNumber: "171",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-171"],
  cardType: "character",
  name: "Flash",
  version: "Efficient Clerk",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "014",
  cardNumber: 171,
  rarity: "rare",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 2,
  inkable: false,
  text: [
    {
      title: "Resist +1",
    },
    {
      title: "Take... Your... Time",
      description: "All characters lose Rush and can't gain Rush.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    resist(1),
    {
      id: "Kk7-2",
      name: "Take... Your... Time",
      type: "static",
      text: "Take... Your... Time All characters lose Rush and can't gain Rush.",
      effect: {
        type: "lose-keyword",
        keyword: "Rush",
        cannotGain: true,
        target: "ALL_CHARACTERS",
      },
    },
  ],
  i18n: flashEfficientClerkI18n,
};
