import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanResourcefulRecruitI18n } from "./069-mulan-resourceful-recruit.i18n";

export const mulanResourcefulRecruit: CharacterCard = {
  id: "uLx",
  canonicalId: "ci_qCB",
  reprints: ["set11-069"],
  cardType: "character",
  name: "Mulan",
  version: "Resourceful Recruit",
  inkType: ["emerald"],
  franchise: "Mulan",
  set: "011",
  cardNumber: 69,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_5eb205c36e0b4038a8a46aa47dd50b0f",
    tcgPlayer: 677162,
  },
  text: [
    {
      title: "RIGOROUS TRAINING",
      description:
        "Whenever this character quests, gain lore equal to her {S}, to a maximum of 6 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      id: "1rc-1",
      name: "RIGOROUS TRAINING",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: {
          type: "clamp",
          value: {
            type: "strength-of",
            target: {
              ref: "self",
            },
          },
          max: 6,
          min: 0,
        },
      },
      text: "RIGOROUS TRAINING Whenever this character quests, gain lore equal to her {S}, to a maximum of 6 lore.",
    },
  ],
  i18n: mulanResourcefulRecruitI18n,
};
