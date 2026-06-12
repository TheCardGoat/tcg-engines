import type { CharacterCard } from "@tcg/lorcana-types";
import { morduSavageCursedPrinceI18n } from "./057-mordu-savage-cursed-prince.i18n";

export const morduSavageCursedPrince: CharacterCard = {
  id: "Imn",
  canonicalId: "ci_Imn",
  reprints: ["set12-057"],
  cardType: "character",
  name: "Mor'du",
  version: "Savage Cursed Prince",
  inkType: ["amethyst"],
  franchise: "Brave",
  set: "012",
  cardNumber: 57,
  rarity: "common",
  cost: 5,
  strength: 8,
  willpower: 8,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_05dcb2ebcf1340c4a16fab77145a1fec",
  },
  text: [
    {
      title: "Ferocious Roar",
      description: "When you play this character, exert all your characters not named Mor'du.",
    },
    {
      title: "Rooted by Fear",
      description: "Your characters not named Mor'du can't ready at the start of your turn.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Prince"],
  abilities: [
    {
      id: "Imn-1",
      name: "FEROCIOUS ROAR",
      type: "triggered",
      text: "FEROCIOUS ROAR When you play this character, exert all your characters not named Mor'du.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "exert",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filters: [
            {
              type: "not",
              filter: {
                type: "has-name",
                name: "Mor'du",
              },
            },
          ],
        },
      },
    },
    {
      id: "Imn-2",
      name: "ROOTED BY FEAR",
      type: "static",
      text: "ROOTED BY FEAR Your characters not named Mor'du can't ready at the start of your turn.",
      effect: {
        type: "restriction",
        restriction: "cant-ready-at-start-of-turn",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filters: [
            {
              type: "not",
              filter: {
                type: "has-name",
                name: "Mor'du",
              },
            },
          ],
        },
      },
    },
  ],
  i18n: morduSavageCursedPrinceI18n,
};
