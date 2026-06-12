import type { CharacterCard } from "@tcg/lorcana-types";
import { angelaNightWarriorI18n } from "./187-angela-night-warrior.i18n";

export const angelaNightWarrior: CharacterCard = {
  id: "BIL",
  canonicalId: "ci_BIL",
  reprints: ["set11-187"],
  cardType: "character",
  name: "Angela",
  version: "Night Warrior",
  inkType: ["steel"],
  franchise: "Gargoyles",
  set: "011",
  cardNumber: 187,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_d0248ffc9fe545b68653691286a005c6",
    tcgPlayer: 676241,
  },
  text: [
    {
      title: "SHADOW POWER",
      description:
        "When you play this character, you may give chosen character Challenger +2 and Resist +2 until the start of your next turn. (They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)",
    },
    {
      title: "ETERNAL NIGHT",
      description: "Your Gargoyle characters lose the Stone by Day ability.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Gargoyle"],
  abilities: [
    {
      id: "BIL-1",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "gain-keywords",
          keywords: [
            {
              keyword: "Challenger",
              value: 2,
            },
            {
              keyword: "Resist",
              value: 2,
            },
          ],
          target: {
            selector: "chosen",
            cardTypes: ["character"],
            owner: "any",
            zones: ["play"],
            count: 1,
          },
          duration: "until-start-of-next-turn",
        },
        type: "optional",
      },
      name: "SHADOW POWER",
      type: "triggered",
      text: "SHADOW POWER When you play this character, you may give chosen character Challenger +2 and Resist +2 until the start of your next turn.",
    },
    {
      id: "BIL-2",
      name: "ETERNAL NIGHT",
      text: "ETERNAL NIGHT Your Gargoyle characters lose the Stone by Day ability.",
      type: "static",
      effect: {
        type: "suppress-ability",
        abilityName: "STONE BY DAY",
        target: {
          count: "all",
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Gargoyle",
            },
          ],
        },
      },
    },
  ],
  i18n: angelaNightWarriorI18n,
};
