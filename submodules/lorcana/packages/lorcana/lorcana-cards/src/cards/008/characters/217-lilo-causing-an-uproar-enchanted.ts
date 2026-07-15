import type { CharacterCard } from "@tcg/lorcana-types";
import { liloCausingAnUproarEnchantedI18n } from "./217-lilo-causing-an-uproar-enchanted.i18n";

export const liloCausingAnUproarEnchanted: CharacterCard = {
  id: "oo9",
  canonicalId: "ci_U6V",
  slug: "lorcana-ci_U6V",
  printings: [
    {
      id: "set8-217-enchanted",
      artId: "ci_U6V-enchanted",
      setCode: "set8",
      collectorNumber: "217",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set8-137"],
  cardType: "character",
  name: "Lilo",
  version: "Causing an Uproar",
  inkType: ["ruby"],
  franchise: "Lilo and Stitch",
  set: "008",
  cardNumber: 217,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_95167fa28eb2442c8d04fc67d2db7fa7",
    tcgPlayer: "632684",
  },
  text: [
    {
      title: "STOMPIN' TIME!",
      description:
        "During your turn, if you've played 3 or more actions this turn, you may play this character for free.",
    },
    {
      title: "RAAAWR!",
      description:
        "When you play this character, ready chosen character. They can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      id: "1to-1",
      name: "STOMPIN' TIME!",
      sourceZones: ["hand"],
      text: "STOMPIN' TIME! During your turn, if you've played 3 or more actions this turn, you may play this character for free.",
      type: "static",
      condition: {
        type: "turn-metric",
        metric: "played-actions",
        comparison: {
          operator: "gte",
          value: 3,
        },
      },
      effect: {
        amount: "full",
        type: "cost-reduction",
      },
    },
    {
      effect: {
        steps: [
          {
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "ready",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: {
              ref: "previous-target",
            },
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      id: "1to-2",
      name: "RAAAWR!",
      text: "RAAAWR! When you play this character, ready chosen character. They can't quest for the rest of this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: liloCausingAnUproarEnchantedI18n,
};
