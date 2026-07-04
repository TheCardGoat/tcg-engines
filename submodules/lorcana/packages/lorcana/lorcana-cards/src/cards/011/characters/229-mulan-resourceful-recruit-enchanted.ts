import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanResourcefulRecruitEnchantedI18n } from "./229-mulan-resourceful-recruit-enchanted.i18n";

export const mulanResourcefulRecruitEnchanted: CharacterCard = {
  id: "Qzh",
  canonicalId: "ci_qCB",
  slug: "lorcana-ci_qCB",
  printings: [
    {
      id: "set11-229-enchanted",
      artId: "ci_qCB-enchanted",
      setCode: "set11",
      collectorNumber: "229",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set11-069"],
  cardType: "character",
  name: "Mulan",
  version: "Resourceful Recruit",
  inkType: ["emerald"],
  franchise: "Mulan",
  set: "011",
  cardNumber: 229,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_5eb205c36e0b4038a8a46aa47dd50b0f",
    tcgPlayer: "677162",
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
  i18n: mulanResourcefulRecruitEnchantedI18n,
};
