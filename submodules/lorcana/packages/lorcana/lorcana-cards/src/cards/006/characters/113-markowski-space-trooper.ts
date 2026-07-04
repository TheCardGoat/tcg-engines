import type { CharacterCard } from "@tcg/lorcana-types";
import { markowskiSpaceTrooperI18n } from "./113-markowski-space-trooper.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const markowskiSpaceTrooper: CharacterCard = {
  id: "hrO",
  canonicalId: "ci_hrO",
  slug: "lorcana-ci_hrO",
  printings: [
    {
      id: "set6-113",
      artId: "set6-113",
      setCode: "set6",
      collectorNumber: "113",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set6-113"],
  cardType: "character",
  name: "Markowski",
  version: "Space Trooper",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "006",
  cardNumber: 113,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_df8f4f463d6e4b7483db0bfccd609059",
    tcgPlayer: "592019",
  },
  text: "Evasive",
  classifications: ["Storyborn", "Ally"],
  abilities: [evasive],
  i18n: markowskiSpaceTrooperI18n,
};
