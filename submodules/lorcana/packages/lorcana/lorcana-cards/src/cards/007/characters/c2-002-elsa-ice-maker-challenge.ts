import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaIceMakerC2ChallengeI18n } from "./c2-002-elsa-ice-maker-challenge.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const elsaIceMakerC2Challenge: CharacterCard = {
  id: "OW7",
  canonicalId: "ci_EtJ",
  slug: "lorcana-ci_EtJ",
  printings: [
    {
      id: "set7-c2-002-challenge",
      artId: "ci_EtJ-challenge",
      setCode: "set7",
      collectorNumber: "2",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set7-069"],
  cardType: "character",
  name: "Elsa",
  version: "Ice Maker",
  inkType: ["amethyst", "sapphire"],
  franchise: "Frozen",
  set: "007",
  cardNumber: 2,
  rarity: "special",
  specialRarity: "challenge",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_be9f1031cbc84de7a5a4a388a036857a",
    tcgPlayer: "655962",
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "WINTER WALL",
      description:
        "Whenever this character quests, you may exert chosen character. If you do and you have a character named Anna in play, the chosen character can't ready at the start of their next turn.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Queen", "Sorcerer"],
  abilities: [
    shift(4),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          effects: [
            {
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
              type: "exert",
            },
            {
              type: "conditional",
              condition: {
                type: "and",
                conditions: [
                  { type: "if-you-do" },
                  { type: "has-named-character", name: "Anna", controller: "you" },
                ],
              },
              ifTrue: {
                type: "restriction",
                restriction: "cant-ready",
                duration: "their-next-turn",
                target: {
                  selector: "chosen",
                  count: 1,
                  owner: "any",
                  zones: ["play"],
                  cardTypes: ["character"],
                },
              },
            },
          ],
        },
        type: "optional",
      },
      id: "1v2-2",
      name: "WINTER WALL",
      text: "WINTER WALL Whenever this character quests, you may exert chosen character. If you do and you have a character named Anna in play, the chosen character can’t ready at the start of their next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: elsaIceMakerC2ChallengeI18n,
};
