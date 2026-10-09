import type { CharacterCard } from "@tcg/lorcana-types";
import { trampQuickOnHisFeetI18n } from "./122-tramp-quick-on-his-feet.i18n";

export const trampQuickOnHisFeet: CharacterCard = {
  id: "wf5",
  canonicalId: "ci_wf5",
  slug: "lorcana-ci_wf5",
  printings: [
    {
      id: "set14-122",
      artId: "set14-122",
      setCode: "set14",
      collectorNumber: "122",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-122"],
  cardType: "character",
  name: "Tramp",
  version: "Quick on His Feet",
  inkType: ["ruby"],
  franchise: "Lady and the Tramp",
  set: "014",
  cardNumber: 122,
  rarity: "rare",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a4d86695538e420fbf1d735d13e87044",
  },
  text: [
    {
      title: "GIVE CHASE",
      description: "When you play this character, choose one:",
    },
    {
      title: "• Exert chosen character with 1 {S} or less.",
    },
    {
      title: "• This character gains Rush this turn. (They can challenge the turn they're played.)",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "wf5-1",
      name: "GIVE CHASE",
      type: "triggered",
      text: "GIVE CHASE When you play this character, choose one: Exert chosen character with 1 {S} or less; or this character gains Rush this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "or",
        optionLabels: [
          "Exert chosen character with 1 {S} or less.",
          "This character gains Rush this turn.",
        ],
        options: [
          {
            type: "exert",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "strength-comparison",
                  comparison: "less-or-equal",
                  value: 1,
                },
              ],
            },
          },
          {
            type: "gain-keyword",
            keyword: "Rush",
            duration: "this-turn",
            target: "SELF",
          },
        ],
      },
    },
  ],
  i18n: trampQuickOnHisFeetI18n,
};
