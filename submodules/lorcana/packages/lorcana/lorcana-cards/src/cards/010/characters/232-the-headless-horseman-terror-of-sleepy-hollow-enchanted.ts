import type { CharacterCard } from "@tcg/lorcana-types";
import { theHeadlessHorsemanTerrorOfSleepyHollowEnchantedI18n } from "./232-the-headless-horseman-terror-of-sleepy-hollow-enchanted.i18n";

export const theHeadlessHorsemanTerrorOfSleepyHollowEnchanted: CharacterCard = {
  id: "WFC",
  canonicalId: "ci_3XX",
  slug: "lorcana-ci_3XX",
  printings: [
    {
      id: "set10-232-enchanted",
      artId: "ci_3XX-enchanted",
      setCode: "set10",
      collectorNumber: "232",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set10-125"],
  cardType: "character",
  name: "The Headless Horseman",
  version: "Terror of Sleepy Hollow",
  inkType: ["ruby"],
  franchise: "Sleepy Hollow",
  set: "010",
  cardNumber: 232,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  strength: 4,
  willpower: 2,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_c2a0cc56159841db921d13a52589d13a",
    tcgPlayer: "660012",
  },
  text: [
    {
      title: "LEAVES NO TRACE",
      description:
        "When you play this character, banish chosen opposing character with 2 {S} or less.",
    },
    {
      title: "GATHERING STRENGTH",
      description:
        "During your turn, whenever an opposing character is banished, each of your characters gets +1 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      id: "1xw-1",
      name: "LEAVES NO TRACE",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "strength-comparison",
              comparison: "less-or-equal",
              value: 2,
            },
          ],
        },
      },
      text: "LEAVES NO TRACE When you play this character, banish chosen opposing character with 2 {S} or less.",
    },
    {
      id: "1xw-2",
      name: "GATHERING STRENGTH",
      type: "triggered",
      trigger: {
        event: "banish",
        events: ["banish-in-challenge"],
        on: {
          controller: "opponent",
          cardType: "character",
        },
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        duration: "this-turn",
        target: "YOUR_CHARACTERS",
      },
      text: "GATHERING STRENGTH During your turn, whenever an opposing character is banished, each of your characters gets +1 {S} this turn.",
    },
  ],
  i18n: theHeadlessHorsemanTerrorOfSleepyHollowEnchantedI18n,
};
