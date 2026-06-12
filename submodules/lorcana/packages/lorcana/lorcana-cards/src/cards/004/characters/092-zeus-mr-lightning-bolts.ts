import type { CharacterCard } from "@tcg/lorcana-types";
import { zeusMrLightningBoltsI18n } from "./092-zeus-mr-lightning-bolts.i18n";

export const zeusMrLightningBolts: CharacterCard = {
  id: "0AH",
  canonicalId: "ci_0AH",
  reprints: ["set4-092"],
  cardType: "character",
  name: "Zeus",
  version: "Mr. Lightning Bolts",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  cardNumber: 92,
  rarity: "common",
  cost: 3,
  strength: 0,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_6c8b36633fae4e9c9106e63af43934eb",
    tcgPlayer: 550583,
  },
  text: [
    {
      title: "TARGET PRACTICE",
      description:
        "Whenever this character challenges another character, he gets +{S} equal to the {S} of chosen character this turn.",
    },
  ],
  classifications: ["Storyborn", "King", "Deity"],
  abilities: [
    {
      id: "0AH-1",
      name: "TARGET PRACTICE",
      text: "TARGET PRACTICE Whenever this character challenges another character, he gets +{S} equal to the {S} of chosen character this turn.",
      type: "triggered",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "sequence",
        effects: [
          {
            type: "select-target",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "modify-stat",
            stat: "strength",
            modifier: {
              type: "strength-of",
              target: {
                ref: "previous-target",
              },
            },
            duration: "this-turn",
            target: {
              ref: "self",
            },
          },
        ],
      },
    },
  ],
  i18n: zeusMrLightningBoltsI18n,
};
