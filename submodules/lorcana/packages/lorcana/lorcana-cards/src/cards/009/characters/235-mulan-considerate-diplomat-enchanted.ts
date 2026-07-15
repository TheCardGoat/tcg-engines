import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanConsiderateDiplomatEnchantedI18n } from "./235-mulan-considerate-diplomat-enchanted.i18n";

export const mulanConsiderateDiplomatEnchanted: CharacterCard = {
  id: "sil",
  canonicalId: "ci_uTh",
  slug: "lorcana-ci_uTh",
  printings: [
    {
      id: "set9-235-enchanted",
      artId: "ci_uTh-enchanted",
      setCode: "set9",
      collectorNumber: "235",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set9-142"],
  cardType: "character",
  name: "Mulan",
  version: "Considerate Diplomat",
  inkType: ["sapphire"],
  franchise: "Mulan",
  set: "009",
  cardNumber: 235,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_08b670dabf3b4ff0a56cb4525b0b57db",
    tcgPlayer: "651111",
  },
  text: [
    {
      title: "IMPERIAL INVITATION",
      description:
        "Whenever this character quests, look at the top 4 cards of your deck. You may reveal a Princess character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        type: "scry",
        amount: 4,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            reveal: true,
            filters: [
              {
                type: "card-type",
                cardType: "character",
              },
              {
                type: "classification",
                classification: "Princess",
              },
            ],
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      id: "1t2-1",
      name: "IMPERIAL INVITATION",
      text: "IMPERIAL INVITATION Whenever this character quests, look at the top 4 cards of your deck. You may reveal a Princess character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: mulanConsiderateDiplomatEnchantedI18n,
};
