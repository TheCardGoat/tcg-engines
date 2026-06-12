import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaIceSurferI18n } from "./109-elsa-ice-surfer.i18n";

export const elsaIceSurfer: CharacterCard = {
  id: "zCK",
  canonicalId: "ci_zCK",
  reprints: ["set1-109"],
  cardType: "character",
  name: "Elsa",
  version: "Ice Surfer",
  inkType: ["ruby"],
  franchise: "Frozen",
  set: "001",
  cardNumber: 109,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4dff89f588a5466097978e9889eef559",
    tcgPlayer: 507482,
  },
  text: [
    {
      title: "THAT'S NO BLIZZARD",
      description:
        "Whenever you play a character named Anna, ready this character. This character can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Queen", "Sorcerer"],
  abilities: [
    {
      id: "zCK-1",
      name: "THAT'S NO BLIZZARD",
      text: "THAT'S NO BLIZZARD Whenever you play a character named Anna, ready this character. This character can't quest for the rest of this turn.",
      type: "triggered",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
        },
        timing: "whenever",
      },
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          reference: "trigger-subject",
          cardType: "character",
          filters: [
            {
              type: "name",
              equals: "Anna",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: "SELF",
          },
          {
            type: "restriction",
            duration: "this-turn",
            restriction: "cant-quest",
            target: "SELF",
          },
        ],
      },
    },
  ],
  i18n: elsaIceSurferI18n,
};
