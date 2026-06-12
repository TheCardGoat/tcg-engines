import type { CharacterCard } from "@tcg/lorcana-types";
import { wreckitRalphHamHandsI18n } from "./190-wreck-it-ralph-ham-hands.i18n";

export const wreckitRalphHamHands: CharacterCard = {
  id: "39T",
  canonicalId: "ci_IDQ",
  reprints: ["set6-190"],
  cardType: "character",
  name: "Wreck-It Ralph",
  version: "Ham Hands",
  inkType: ["steel"],
  franchise: "Wreck It Ralph",
  set: "006",
  cardNumber: 190,
  rarity: "legendary",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_98e2f67c2ee14092be9f89b31f20db4e",
    tcgPlayer: 590822,
  },
  text: [
    {
      title: "I WRECK THINGS",
      description:
        "Whenever this character quests, you may banish chosen item or location to gain 2 lore.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          effects: [
            {
              type: "banish",
              target: "CHOSEN_ITEM_OR_LOCATION",
            },
            {
              amount: 2,
              type: "gain-lore",
            },
          ],
        },
        type: "optional",
      },
      id: "1h8-1",
      name: "I WRECK THINGS",
      text: "I WRECK THINGS Whenever this character quests, you may banish chosen item or location to gain 2 lore.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: wreckitRalphHamHandsI18n,
};
