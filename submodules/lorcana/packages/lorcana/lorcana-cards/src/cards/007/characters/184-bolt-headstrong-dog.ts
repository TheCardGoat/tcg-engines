import type { CharacterCard } from "@tcg/lorcana-types";
import { boltHeadstrongDogI18n } from "./184-bolt-headstrong-dog.i18n";

export const boltHeadstrongDog: CharacterCard = {
  id: "MIh",
  canonicalId: "ci_MIh",
  reprints: ["set7-184"],
  cardType: "character",
  name: "Bolt",
  version: "Headstrong Dog",
  inkType: ["steel"],
  franchise: "Bolt",
  set: "007",
  cardNumber: 184,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b6cecef16e364dc6bbc9b538aaa52226",
    tcgPlayer: 618158,
  },
  text: [
    {
      title: "THERE'S NO TURNING BACK",
      description:
        "Whenever this character quests, if he has no damage, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "131-1",
      name: "THERE'S NO TURNING BACK",
      text: "THERE'S NO TURNING BACK Whenever this character quests, if he has no damage, you may draw a card, then choose and discard a card.",
      condition: {
        type: "no-damage",
      },
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          steps: [
            {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            {
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              type: "discard",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      type: "triggered",
    },
  ],
  i18n: boltHeadstrongDogI18n,
};
