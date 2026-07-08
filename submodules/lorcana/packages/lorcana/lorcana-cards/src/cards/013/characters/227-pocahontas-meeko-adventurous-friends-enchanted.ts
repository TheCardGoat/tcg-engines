import type { CharacterCard } from "@tcg/lorcana-types";
import { pocahontasMeekoAdventurousFriendsEnchantedI18n } from "./227-pocahontas-meeko-adventurous-friends-enchanted.i18n";

import { evasive } from "../../../helpers/abilities/evasive";
import { shift } from "../../../helpers/abilities/shift";

export const pocahontasMeekoAdventurousFriendsEnchanted: CharacterCard = {
  id: "3UG",
  canonicalId: "ci_uQO",
  slug: "lorcana-ci_uQO",
  printings: [
    {
      id: "set13-227-enchanted",
      artId: "ci_uQO-enchanted",
      setCode: "set13",
      collectorNumber: "227",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set13-027"],
  cardType: "character",
  name: "Pocahontas & Meeko",
  version: "Adventurous Friends",
  inkType: ["amber", "amethyst"],
  franchise: "Pocahontas",
  set: "013",
  cardNumber: 227,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_1337332b5317428c95c1129cf645924f",
  },
  text: [
    {
      title: "Shift 2 {I}",
    },
    {
      title: "Evasive",
    },
    {
      title: "WELCOME RETURN",
      description:
        "Whenever this character quests, you may return chosen character of yours with cost 1 to your hand. If you do, you may play a character with cost 1 for free.",
    },
  ],
  classifications: ["Storyborn", "Team", "Hero", "Princess"],
  abilities: [
    shift("Pocahontas or Meeko", 2),
    evasive,
    {
      type: "triggered",
      id: "uQO-3",
      name: "WELCOME RETURN",
      text: "WELCOME RETURN Whenever this character quests, you may return chosen character of yours with cost 1 to your hand. If you do, you may play a character with cost 1 for free.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "return-to-hand",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                filter: [
                  {
                    type: "cost-comparison",
                    comparison: "equal",
                    value: 1,
                  },
                ],
              },
            },
            {
              type: "conditional",
              condition: {
                type: "if-you-do",
              },
              then: {
                type: "optional",
                chooser: "CONTROLLER",
                effect: {
                  type: "play-card",
                  from: "hand",
                  cardType: "character",
                  costRestriction: {
                    comparison: "equal",
                    value: 1,
                  },
                  cost: "free",
                },
              },
            },
          ],
        },
      },
    },
  ],
  i18n: pocahontasMeekoAdventurousFriendsEnchantedI18n,
};
