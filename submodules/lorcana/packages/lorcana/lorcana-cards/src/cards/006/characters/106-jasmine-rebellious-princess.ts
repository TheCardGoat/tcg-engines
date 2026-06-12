import type { CharacterCard } from "@tcg/lorcana-types";
import { jasmineRebelliousPrincessI18n } from "./106-jasmine-rebellious-princess.i18n";

export const jasmineRebelliousPrincess: CharacterCard = {
  id: "5EC",
  canonicalId: "ci_5EC",
  reprints: ["set6-106"],
  cardType: "character",
  name: "Jasmine",
  version: "Rebellious Princess",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "006",
  cardNumber: 106,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_e093d909d79f4dd5baaccae93139c95b",
    tcgPlayer: 588101,
  },
  text: [
    {
      title: "YOU'LL NEVER MISS IT",
      description: "Whenever this character quests, each opponent loses 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        amount: 1,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      id: "zj2-1",
      name: "YOU'LL NEVER MISS IT",
      text: "YOU'LL NEVER MISS IT Whenever this character quests, each opponent loses 1 lore.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: jasmineRebelliousPrincessI18n,
};
