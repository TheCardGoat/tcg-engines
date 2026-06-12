import type { CharacterCard } from "@tcg/lorcana-types";
import { jasmineHeirOfAgrabahI18n } from "./151-jasmine-heir-of-agrabah.i18n";

export const jasmineHeirOfAgrabah: CharacterCard = {
  id: "kVO",
  canonicalId: "ci_OtD",
  reprints: ["set2-151", "set9-155"],
  cardType: "character",
  name: "Jasmine",
  version: "Heir of Agrabah",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "002",
  cardNumber: 151,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_76abbf408f4940dea3dc5daf5afdd314",
    tcgPlayer: 650090,
  },
  text: [
    {
      title: "I'M A FAST LEARNER",
      description:
        "When you play this character, remove up to 1 damage from chosen character of yours.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        amount: { type: "up-to", value: 1 },
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "you",
          selector: "chosen",
          zones: ["play"],
        },
        type: "remove-damage",
      },
      id: "1sv-1",
      name: "I'M A FAST LEARNER",
      text: "I'M A FAST LEARNER When you play this character, remove up to 1 damage from chosen character of yours.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: jasmineHeirOfAgrabahI18n,
};
