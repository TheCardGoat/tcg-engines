import type { CharacterCard } from "@tcg/lorcana-types";
import { diabloDevotedHeraldI18n } from "./070-diablo-devoted-herald.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const diabloDevotedHerald: CharacterCard = {
  id: "Mnw",
  canonicalId: "ci_Ljv",
  reprints: ["set4-070"],
  cardType: "character",
  name: "Diablo",
  version: "Devoted Herald",
  inkType: ["emerald"],
  franchise: "Sleeping Beauty",
  set: "004",
  cardNumber: 70,
  rarity: "legendary",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_93ab5d88940f4610a375a928963a570f",
    tcgPlayer: 550535,
  },
  text: [
    {
      title: "Shift: Discard an action card ",
      description:
        "(You may discard an action card to play this on top of one of your characters named Diablo.)",
    },
    {
      title: "Evasive",
    },
    {
      title: "CIRCLE FAR AND WIDE",
      description:
        "During each opponent's turn, whenever they draw a card while this character is exerted, you may draw a card.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
  abilities: [
    {
      id: "mnw-1",
      keyword: "Shift",
      type: "keyword",
      shiftTarget: "Diablo",
      cost: {
        discardCards: 1,
        discardChosen: true,
        discardCardType: "action",
      },
      text: "Shift: Discard an action card",
    },
    evasive,
    {
      id: "mnw-2",
      name: "CIRCLE FAR AND WIDE",
      type: "triggered",
      condition: {
        target: "SELF",
        type: "exerted",
      },
      trigger: {
        event: "draw",
        on: "OPPONENT",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "opponent",
          },
        ],
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      text: "CIRCLE FAR AND WIDE During each opponent's turn, whenever they draw a card while this character is exerted, you may draw a card.",
    },
  ],
  i18n: diabloDevotedHeraldI18n,
};
