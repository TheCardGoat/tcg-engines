import type { CharacterCard } from "@tcg/lorcana-types";
import { lyleTiberiusRourkeCunningMercenaryI18n } from "./078-lyle-tiberius-rourke-cunning-mercenary.i18n";

export const lyleTiberiusRourkeCunningMercenary: CharacterCard = {
  id: "1Ni",
  canonicalId: "ci_1Ni",
  reprints: ["set3-078"],
  cardType: "character",
  name: "Lyle Tiberius Rourke",
  version: "Cunning Mercenary",
  inkType: ["emerald"],
  franchise: "Atlantis",
  set: "003",
  cardNumber: 78,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_04851c839e844359bfe6a0fa70158d38",
    tcgPlayer: 536279,
  },
  text: [
    {
      title: "WELL, NOW YOU KNOW",
      description:
        "When you play this character, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
    },
    {
      title: "THANKS FOR VOLUNTEERING",
      description: "Whenever one of your other characters is banished, each opponent loses 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        keyword: "Reckless",
        duration: "their-next-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "gain-keyword",
      },
      id: "1s7-1",
      name: "WELL, NOW YOU KNOW",
      text: "WELL, NOW YOU KNOW When you play this character, chosen opposing character gains Reckless during their next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        amount: 1,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      id: "1s7-2",
      name: "THANKS FOR VOLUNTEERING",
      text: "THANKS FOR VOLUNTEERING Whenever one of your other characters is banished, each opponent loses 1 lore.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: lyleTiberiusRourkeCunningMercenaryI18n,
};
