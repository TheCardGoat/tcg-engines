import type { CharacterCard } from "@tcg/lorcana-types";
import { liloBestExplorerEverI18n } from "./174-lilo-best-explorer-ever.i18n";

export const liloBestExplorerEver: CharacterCard = {
  id: "T3q",
  canonicalId: "ci_sRi",
  reprints: ["set9-174"],
  cardType: "character",
  name: "Lilo",
  version: "Best Explorer Ever",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "009",
  cardNumber: 174,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_fbccd8fc95fa45009665824b0731c3d3",
    tcgPlayer: 649236,
  },
  text: [
    {
      title: "COME ON, PEOPLE, LET'S MOVE",
      description:
        "When you play this character, your other characters gain Challenger +2 this turn (They get +2 {S} while challenging.)",
    },
    {
      title: "GO GET 'EM",
      description:
        'Whenever this character quests, chosen Alien character gains Challenger +2 and "This character can challenge ready characters" this turn.',
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: "YOUR_OTHER_CHARACTERS",
        type: "gain-keyword",
        value: 2,
      },
      id: "127-1",
      name: "COME ON, PEOPLE, LET'S MOVE",
      text: "COME ON, PEOPLE, LET'S MOVE When you play this character, your other characters gain Challenger +2 this turn",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        steps: [
          {
            duration: "this-turn",
            keyword: "Challenger",
            target: {
              cardTypes: ["character"],
              count: 1,
              filter: [
                {
                  type: "has-classification",
                  classification: "Alien",
                },
              ],
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
            type: "gain-keyword",
            value: 2,
          },
          {
            ability: "can-challenge-ready",
            duration: "this-turn",
            target: {
              ref: "previous-target",
            },
            type: "grant-ability",
          },
        ],
        type: "sequence",
      },
      id: "127-2",
      name: "GO GET 'EM",
      text: 'GO GET \'EM Whenever this character quests, chosen Alien character gains Challenger +2 and "This character can challenge ready characters" this turn.',
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: liloBestExplorerEverI18n,
};
