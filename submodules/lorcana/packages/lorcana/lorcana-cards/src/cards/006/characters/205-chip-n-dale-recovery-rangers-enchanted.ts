import type { CharacterCard } from "@tcg/lorcana-types";
import { chipNDaleRecoveryRangersEnchantedI18n } from "./205-chip-n-dale-recovery-rangers-enchanted.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const chipNDaleRecoveryRangersEnchanted: CharacterCard = {
  id: "b59",
  canonicalId: "ci_0J8",
  slug: "lorcana-ci_0J8",
  printings: [
    {
      id: "set6-205-enchanted",
      artId: "ci_0J8-enchanted",
      setCode: "set6",
      collectorNumber: "205",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set6-014"],
  cardType: "character",
  name: "Chip 'n' Dale",
  version: "Recovery Rangers",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "006",
  cardNumber: 205,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 8,
  strength: 6,
  willpower: 6,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_c1cd26316f4948a382770ffb29440699",
    tcgPlayer: "592030",
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "(This character counts as being named both Chip and Dale.)",
    },
    {
      title: "SEARCH AND RESCUE",
      description:
        "During your turn, whenever a card is put into your inkwell, you may return a character card from your discard to your hand.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    shift("Chip or Dale", 5),
    {
      id: "1sm-2",
      name: "SEARCH AND RESCUE",
      text: "SEARCH AND RESCUE During your turn, whenever a card is put into your inkwell, you may return a character card from your discard to your hand.",
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "whenever",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cardType: "character",
          target: "CONTROLLER",
          type: "return-from-discard",
        },
        type: "optional",
      },
      type: "triggered",
    },
  ],
  i18n: chipNDaleRecoveryRangersEnchantedI18n,
};
