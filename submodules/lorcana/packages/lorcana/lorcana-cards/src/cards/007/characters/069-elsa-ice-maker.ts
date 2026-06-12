import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaIceMakerI18n } from "./069-elsa-ice-maker.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const elsaIceMaker: CharacterCard = {
  id: "EtJ",
  canonicalId: "ci_6Se",
  reprints: ["set7-069"],
  cardType: "character",
  name: "Elsa",
  version: "Ice Maker",
  inkType: ["amethyst", "sapphire"],
  franchise: "Frozen",
  set: "007",
  cardNumber: 69,
  rarity: "common",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_01c4835a62df4960bb973aeff81f2bb2",
    tcgPlayer: 618356,
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
  i18n: elsaIceMakerI18n,
};
