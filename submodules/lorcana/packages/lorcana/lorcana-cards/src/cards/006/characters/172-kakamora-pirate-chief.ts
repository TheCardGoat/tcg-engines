import type { CharacterCard } from "@tcg/lorcana-types";
import { kakamoraPirateChiefI18n } from "./172-kakamora-pirate-chief.i18n";

export const kakamoraPirateChief: CharacterCard = {
  id: "2pj",
  canonicalId: "ci_2pj",
  reprints: ["set6-172"],
  cardType: "character",
  name: "Kakamora",
  version: "Pirate Chief",
  inkType: ["steel"],
  franchise: "Moana",
  set: "006",
  cardNumber: 172,
  rarity: "rare",
  cost: 7,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_af36de00a5544c83989f3295612c0bbf",
    tcgPlayer: 593018,
  },
  text: [
    {
      title: "COCONUT LEADER",
      description:
        "Whenever this character quests, you may draw a card. Then, choose and discard a card to deal 1 damage to chosen character or location. If a Pirate character card was discarded, deal 3 damage to that character or location instead.",
    },
  ],
  classifications: ["Storyborn", "Pirate", "Captain"],
  abilities: [
    {
      id: "2pj-1",
      name: "COCONUT LEADER",
      text: "COCONUT LEADER Whenever this character quests, you may draw a card. Then, choose and discard a card to deal 1 damage to chosen character or location. If a Pirate character card was discarded, deal 3 damage to that character or location instead.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "draw",
              amount: 1,
              target: "CONTROLLER",
            },
            {
              type: "discard",
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
            },
            {
              type: "conditional",
              condition: {
                type: "discarded-card-has-classification",
                classification: "Pirate",
                cardType: "character",
              },
              then: {
                type: "deal-damage",
                amount: 3,
                target: "CHOSEN_CHARACTER_OR_LOCATION",
              },
              else: {
                type: "deal-damage",
                amount: 1,
                target: "CHOSEN_CHARACTER_OR_LOCATION",
              },
            },
          ],
        },
      },
    },
  ],
  i18n: kakamoraPirateChiefI18n,
};
