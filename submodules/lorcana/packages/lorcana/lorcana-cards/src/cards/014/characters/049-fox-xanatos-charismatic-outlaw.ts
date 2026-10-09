import type { CharacterCard } from "@tcg/lorcana-types";
import { foxXanatosCharismaticOutlawI18n } from "./049-fox-xanatos-charismatic-outlaw.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const foxXanatosCharismaticOutlaw: CharacterCard = {
  id: "j86",
  canonicalId: "ci_j86",
  slug: "lorcana-ci_j86",
  printings: [
    {
      id: "set14-049",
      artId: "set14-049",
      setCode: "set14",
      collectorNumber: "49",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-049"],
  cardType: "character",
  name: "Fox Xanatos",
  version: "Charismatic Outlaw",
  inkType: ["amethyst"],
  franchise: "Gargoyles",
  set: "014",
  cardNumber: 49,
  rarity: "uncommon",
  cost: 5,
  strength: 5,
  willpower: 6,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_7e74e3180a7b4ac7bc6254348cdc14ab",
  },
  text: "Rush",
  classifications: ["Storyborn", "Ally"],
  abilities: [rush],
  i18n: foxXanatosCharismaticOutlawI18n,
};
