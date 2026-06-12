import type { CharacterCard } from "@tcg/lorcana-types";
import { annaTrueheartedI18n } from "./138-anna-true-hearted.i18n";

export const annaTruehearted: CharacterCard = {
  id: "0EO",
  canonicalId: "ci_0rK",
  reprints: ["set4-138", "set9-137"],
  cardType: "character",
  name: "Anna",
  version: "True-Hearted",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "004",
  cardNumber: 138,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a0dbcc4e038e43ee90773445e70c170c",
    tcgPlayer: 650072,
  },
  text: [
    {
      title: "LET ME HELP YOU",
      description:
        "Whenever this character quests, your other Hero characters get +1 {L} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Queen", "Knight"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: {
          count: "all",
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Hero",
            },
          ],
          excludeSelf: true,
        },
        type: "modify-stat",
      },
      id: "1qm-1",
      name: "LET ME HELP YOU",
      text: "LET ME HELP YOU Whenever this character quests, your other Hero characters get +1 {L} this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: annaTrueheartedI18n,
};
