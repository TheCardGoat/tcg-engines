import type { CharacterCard } from "@tcg/lorcana-types";
import { gadgetHackwrenchBrilliantBosunEnchantedI18n } from "./217-gadget-hackwrench-brilliant-bosun-enchanted.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const gadgetHackwrenchBrilliantBosunEnchanted: CharacterCard = {
  id: "VYQ",
  canonicalId: "ci_tKe",
  slug: "lorcana-ci_tKe",
  printings: [
    {
      id: "set6-217-enchanted",
      artId: "ci_tKe-enchanted",
      setCode: "set6",
      collectorNumber: "217",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set6-140"],
  cardType: "character",
  name: "Gadget Hackwrench",
  version: "Brilliant Bosun",
  inkType: ["sapphire"],
  franchise: "Rescue Rangers",
  set: "006",
  cardNumber: 217,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_ae7e15af9559439ba734caac9aa567e5",
    tcgPlayer: "592038",
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "MECHANICALLY SAVVY",
      description:
        "While you have 3 or more items in play, you pay 1 {I} less to play Inventor characters.",
    },
  ],
  classifications: ["Floodborn", "Ally", "Inventor"],
  abilities: [
    shift(4),
    {
      condition: {
        comparison: "greater-or-equal",
        controller: "you",
        count: 3,
        type: "has-item-count",
      },
      effect: {
        amount: 1,
        cardType: "character",
        classification: "Inventor",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      id: "35v-2",
      name: "MECHANICALLY SAVVY",
      text: "MECHANICALLY SAVVY While you have 3 or more items in play, you pay 1 {I} less to play Inventor characters.",
      type: "static",
    },
  ],
  i18n: gadgetHackwrenchBrilliantBosunEnchantedI18n,
};
