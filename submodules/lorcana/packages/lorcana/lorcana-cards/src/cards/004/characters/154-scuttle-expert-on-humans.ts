import type { CharacterCard } from "@tcg/lorcana-types";
import { scuttleExpertOnHumansI18n } from "./154-scuttle-expert-on-humans.i18n";

export const scuttleExpertOnHumans: CharacterCard = {
  id: "IaS",
  canonicalId: "ci_IaS",
  reprints: ["set4-154"],
  cardType: "character",
  name: "Scuttle",
  version: "Expert on Humans",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 154,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3dcdfd3bf35341d7835d5b51893bd0cb",
    tcgPlayer: 549431,
  },
  text: [
    {
      title: "LET ME SEE",
      description:
        "When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        type: "scry",
        amount: 4,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            reveal: true,
            filter: {
              type: "card-type",
              cardType: "item",
            },
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      id: "dpt-1",
      name: "LET ME SEE",
      text: "LET ME SEE When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: scuttleExpertOnHumansI18n,
};
