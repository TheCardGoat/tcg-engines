import type { CharacterCard } from "@tcg/lorcana-types";
import { cinderellaBallroomSensationEnchantedI18n } from "./205-cinderella-ballroom-sensation-enchanted.i18n";

import { singer } from "../../../helpers/abilities/singer";

export const cinderellaBallroomSensationEnchanted: CharacterCard = {
  id: "6kY",
  canonicalId: "ci_Djx",
  slug: "lorcana-ci_Djx",
  printings: [
    {
      id: "set2-205-enchanted",
      artId: "ci_Djx-enchanted",
      setCode: "set2",
      collectorNumber: "205",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set2-003"],
  cardType: "character",
  name: "Cinderella",
  version: "Ballroom Sensation",
  inkType: ["amber"],
  franchise: "Cinderella",
  set: "002",
  cardNumber: 205,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4cf391db31ba468f948bad5a20b0bc16",
    tcgPlayer: "527802",
  },
  text: "Singer 3",
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [singer(3)],
  i18n: cinderellaBallroomSensationEnchantedI18n,
};
