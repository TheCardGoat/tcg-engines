import type { CharacterCard } from "@tcg/lorcana-types";
import { ladyKluckProtectiveConfidantI18n } from "./172-lady-kluck-protective-confidant.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";
import { ward } from "../../../helpers/abilities/ward";

export const ladyKluckProtectiveConfidant: CharacterCard = {
  id: "wEk",
  canonicalId: "ci_wEk",
  reprints: ["set7-172"],
  cardType: "character",
  name: "Lady Kluck",
  version: "Protective Confidant",
  inkType: ["sapphire", "steel"],
  franchise: "Robin Hood",
  set: "007",
  cardNumber: 172,
  rarity: "uncommon",
  cost: 5,
  strength: 2,
  willpower: 7,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e8dd905ba7294b62a44a49ab52a3860a",
    tcgPlayer: 618146,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "Ward",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [bodyguard, ward],
  i18n: ladyKluckProtectiveConfidantI18n,
};
