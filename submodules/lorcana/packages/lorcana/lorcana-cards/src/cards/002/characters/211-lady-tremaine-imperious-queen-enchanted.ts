import type { CharacterCard } from "@tcg/lorcana-types";
import { ladyTremaineImperiousQueenEnchantedI18n } from "./211-lady-tremaine-imperious-queen-enchanted.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const ladyTremaineImperiousQueenEnchanted: CharacterCard = {
  id: "Toy",
  canonicalId: "ci_KcF",
  slug: "lorcana-ci_KcF",
  printings: [
    {
      id: "set2-211-enchanted",
      artId: "ci_KcF-enchanted",
      setCode: "set2",
      collectorNumber: "211",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set2-110"],
  cardType: "character",
  name: "Lady Tremaine",
  version: "Imperious Queen",
  inkType: ["ruby"],
  franchise: "Cinderella",
  set: "002",
  cardNumber: 211,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 6,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_e08d7a85c4e84f1e83a7521ff9c15a89",
    tcgPlayer: "528109",
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "POWER TO RULE AT LAST",
      description:
        "When you play this character, each opponent chooses and banishes one of their characters.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Queen"],
  abilities: [
    shift(4),
    {
      id: "2qj-2",
      name: "POWER TO RULE AT LAST",
      text: "POWER TO RULE AT LAST When you play this character, each opponent chooses and banishes one of their characters.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "for-each-opponent",
        effect: {
          type: "banish",
          chosenBy: "opponent",
          target: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
    },
  ],
  i18n: ladyTremaineImperiousQueenEnchantedI18n,
};
