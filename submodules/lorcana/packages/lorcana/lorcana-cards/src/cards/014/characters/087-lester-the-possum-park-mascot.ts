import type { CharacterCard } from "@tcg/lorcana-types";
import { lesterThePossumParkMascotI18n } from "./087-lester-the-possum-park-mascot.i18n";

export const lesterThePossumParkMascot: CharacterCard = {
  id: "B2t",
  canonicalId: "ci_B2t",
  slug: "lorcana-ci_B2t",
  printings: [
    {
      id: "set14-087",
      artId: "set14-087",
      setCode: "set14",
      collectorNumber: "87",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-087"],
  cardType: "character",
  name: "Lester the Possum",
  version: "Park Mascot",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "014",
  cardNumber: 87,
  rarity: "uncommon",
  cost: 2,
  strength: 0,
  willpower: 3,
  lore: 2,
  inkable: false,
  text: [
    {
      title: "Beat It, Doofus!",
      description: "When this character is challenged and banished, each opponent loses 2 lore.",
    },
    {
      title: "Maximum Cringe",
      description:
        "6 {I} — Chosen opposing character gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      id: "B2t-1",
      name: "Beat It, Doofus!",
      type: "triggered",
      text: "Beat It, Doofus! When this character is challenged and banished, each opponent loses 2 lore.",
      trigger: {
        event: "challenged-and-banished",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "lose-lore",
        amount: 2,
        target: "EACH_OPPONENT",
      },
    },
    {
      id: "B2t-2",
      name: "Maximum Cringe",
      type: "activated",
      text: "Maximum Cringe 6 {I} — Chosen opposing character gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)",
      cost: {
        ink: 6,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        duration: "until-start-of-next-turn",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    },
  ],
  i18n: lesterThePossumParkMascotI18n,
};
