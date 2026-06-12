import type { CharacterCard } from "@tcg/lorcana-types";
import { lexingtonSmallInStatureI18n } from "./183-lexington-small-in-stature.i18n";
import { alert } from "../../../helpers/abilities/alert";
import { stoneByDay } from "../../../helpers/abilities/stoneByDay";

export const lexingtonSmallInStature: CharacterCard = {
  id: "1Mx",
  canonicalId: "ci_1Mx",
  reprints: ["set10-183"],
  cardType: "character",
  name: "Lexington",
  version: "Small in Stature",
  inkType: ["steel"],
  franchise: "Gargoyles",
  set: "010",
  cardNumber: 183,
  rarity: "uncommon",
  cost: 3,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_59040c22431844d18165c4f7e1c5ac2a",
    tcgPlayer: 658745,
  },
  text: [
    {
      title: "Alert",
      description: "(This character can challenge as if they had Evasive.)",
    },
    {
      title: "STONE BY DAY",
      description: "If you have 3 or more cards in your hand, this character can't ready.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Gargoyle"],
  abilities: [alert, stoneByDay],
  i18n: lexingtonSmallInStatureI18n,
};
