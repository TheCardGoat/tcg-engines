import type { CharacterCard } from "@tcg/lorcana-types";
import { lyleTiberiusRourkeAdventurerForHireI18n } from "./087-lyle-tiberius-rourke-adventurer-for-hire.i18n";

export const lyleTiberiusRourkeAdventurerForHire: CharacterCard = {
  id: "UV1",
  canonicalId: "ci_UV1",
  reprints: ["set12-087"],
  cardType: "character",
  name: "Lyle Tiberius Rourke",
  version: "Adventurer for Hire",
  inkType: ["emerald"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 87,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9008a5fe3cdb46d9861b2b4477b81280",
  },
  text: [
    {
      title: "EYE FOR VALUE",
      description:
        "When you play this character, you may draw a card, then choose and discard a card.",
    },
    {
      title: "DIRTY TRICKS",
      description:
        "At the end of your turn, if 2 or more cards were put into your discard this turn, each opponent loses 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      id: "UV1-1",
      name: "EYE FOR VALUE",
      type: "triggered",
      text: "EYE FOR VALUE When you play this character, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            {
              amount: 1,
              chosen: true,
              target: "CONTROLLER",
              type: "discard",
            },
          ],
        },
      },
    },
    {
      id: "UV1-2",
      name: "DIRTY TRICKS",
      type: "triggered",
      text: "DIRTY TRICKS At the end of your turn, if 2 or more cards were put into your discard this turn, each opponent loses 1 lore.",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "turn-metric",
        metric: "discard-cards-entered",
        ownerScope: "you",
        comparison: {
          operator: "gte",
          value: 2,
        },
      },
      effect: {
        amount: 1,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
    },
  ],
  i18n: lyleTiberiusRourkeAdventurerForHireI18n,
};
