import type { CharacterCard } from "@tcg/lorcana-types";
import { jafarLampThiefI18n } from "./041-jafar-lamp-thief.i18n";

export const jafarLampThief: CharacterCard = {
  id: "ley",
  canonicalId: "ci_oLk",
  reprints: ["set3-041", "set9-059"],
  cardType: "character",
  name: "Jafar",
  version: "Lamp Thief",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "003",
  cardNumber: 41,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_fb78447abbd740c3a3509fa91e338b4f",
    tcgPlayer: 650003,
  },
  text: [
    {
      title: "I AM YOUR MASTER NOW",
      description:
        "When you play this character, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 2,
            destinations: [
              {
                zone: "deck-bottom",
                remainder: true,
                ordering: "player-choice",
              },
            ],
            target: "CONTROLLER",
            type: "scry",
          },
          {
            target: "CHOSEN_CHARACTER",
            type: "put-on-bottom",
          },
        ],
        type: "sequence",
      },
      id: "eye-1",
      name: "I AM YOUR MASTER NOW",
      text: "I AM YOUR MASTER NOW When you play this character, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: jafarLampThiefI18n,
};
