import type { CharacterCard } from "@tcg/lorcana-types";
import { annaTrueheartedEnchantedI18n } from "./217-anna-true-hearted-enchanted.i18n";

export const annaTrueheartedEnchanted: CharacterCard = {
  id: "i7j",
  canonicalId: "ci_0rK",
  slug: "lorcana-ci_0rK",
  printings: [
    {
      id: "set4-217-enchanted",
      artId: "ci_0rK-enchanted",
      setCode: "set4",
      collectorNumber: "217",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set4-138", "set9-137"],
  cardType: "character",
  name: "Anna",
  version: "True-Hearted",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "004",
  cardNumber: 217,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a0dbcc4e038e43ee90773445e70c170c",
    tcgPlayer: "650072",
  },
  text: [
    {
      title: "LET ME HELP YOU",
      description:
        "Whenever this character quests, your other Hero characters get +1 {L} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Queen", "Knight"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: {
          count: "all",
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Hero",
            },
          ],
          excludeSelf: true,
        },
        type: "modify-stat",
      },
      id: "1qm-1",
      name: "LET ME HELP YOU",
      text: "LET ME HELP YOU Whenever this character quests, your other Hero characters get +1 {L} this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: annaTrueheartedEnchantedI18n,
};
