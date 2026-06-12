import type { CharacterCard } from "@tcg/lorcana-types";
import { sisuUnitingDragonI18n } from "./054-sisu-uniting-dragon.i18n";

export const sisuUnitingDragon: CharacterCard = {
  id: "gRx",
  canonicalId: "ci_gRx",
  reprints: ["set6-054"],
  cardType: "character",
  name: "Sisu",
  version: "Uniting Dragon",
  inkType: ["amethyst"],
  franchise: "Raya and the Last Dragon",
  set: "006",
  cardNumber: 54,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_d84325bc9e814a69b6789f424c3a1eb8",
    tcgPlayer: 591978,
  },
  text: [
    {
      title: "TRUST BUILDS TRUST",
      description:
        "Whenever this character quests, reveal the top card of your deck. If it's a Dragon character card, put it into your hand and repeat this effect. Otherwise, put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Deity", "Dragon"],
  abilities: [
    {
      effect: {
        type: "scry",
        amount: 1,
        repeatOnHandMatch: true,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            filters: [
              { type: "card-type", cardType: "character" },
              { type: "has-classification", classification: "Dragon" },
            ],
          },
          {
            zone: "deck-top",
            min: 0,
            max: 1,
          },
          {
            zone: "deck-bottom",
            remainder: true,
          },
        ],
      },
      id: "ojg-1",
      name: "TRUST BUILDS TRUST",
      text: "TRUST BUILDS TRUST Whenever this character quests, reveal the top card of your deck. If it’s a Dragon character card, put it into your hand and repeat this effect. Otherwise, put it on either the top or the bottom of your deck.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: sisuUnitingDragonI18n,
};
