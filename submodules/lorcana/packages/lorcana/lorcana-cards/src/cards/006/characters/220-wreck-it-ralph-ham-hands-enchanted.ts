import type { CharacterCard } from "@tcg/lorcana-types";
import { wreckitRalphHamHandsEnchantedI18n } from "./220-wreck-it-ralph-ham-hands-enchanted.i18n";

export const wreckitRalphHamHandsEnchanted: CharacterCard = {
  id: "Fpd",
  canonicalId: "ci_IDQ",
  slug: "lorcana-ci_IDQ",
  printings: [
    {
      id: "set6-220-enchanted",
      artId: "ci_IDQ-enchanted",
      setCode: "set6",
      collectorNumber: "220",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set6-190"],
  cardType: "character",
  name: "Wreck-It Ralph",
  version: "Ham Hands",
  inkType: ["steel"],
  franchise: "Wreck It Ralph",
  set: "006",
  cardNumber: 220,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_98e2f67c2ee14092be9f89b31f20db4e",
    tcgPlayer: "590822",
  },
  text: [
    {
      title: "I WRECK THINGS",
      description:
        "Whenever this character quests, you may banish chosen item or location to gain 2 lore.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          effects: [
            {
              type: "banish",
              target: "CHOSEN_ITEM_OR_LOCATION",
            },
            {
              amount: 2,
              type: "gain-lore",
            },
          ],
        },
        type: "optional",
      },
      id: "1h8-1",
      name: "I WRECK THINGS",
      text: "I WRECK THINGS Whenever this character quests, you may banish chosen item or location to gain 2 lore.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: wreckitRalphHamHandsEnchantedI18n,
};
