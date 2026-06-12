import type { CharacterCard } from "@tcg/lorcana-types";
import { tinkerBellQueenOfTheAzuriteFairiesI18n } from "./048-tinker-bell-queen-of-the-azurite-fairies.i18n";
import { shift } from "../../../helpers/abilities/shift";
import { evasive } from "../../../helpers/abilities/evasive";

export const tinkerBellQueenOfTheAzuriteFairies: CharacterCard = {
  id: "yE4",
  canonicalId: "ci_yE4",
  reprints: ["set6-048"],
  cardType: "character",
  name: "Tinker Bell",
  version: "Queen of the Azurite Fairies",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "006",
  cardNumber: 48,
  rarity: "uncommon",
  cost: 7,
  strength: 5,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_99ced91e0cc94c6cb0be7bf655372dfd",
    tcgPlayer: 584614,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "Evasive",
    },
    {
      title: "SHINING EXAMPLE",
      description:
        "Whenever this character quests, your other Fairy characters get +1 {L} this turn.",
    },
  ],
  classifications: ["Floodborn", "Ally", "Queen", "Fairy", "Captain"],
  abilities: [
    shift(5),
    evasive,
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
          filter: [
            {
              type: "has-classification",
              classification: "Fairy",
            },
          ],
        },
        type: "modify-stat",
      },
      id: "18r-3",
      name: "SHINING EXAMPLE",
      text: "SHINING EXAMPLE Whenever this character quests, your other Fairy characters get +1 {L} this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: tinkerBellQueenOfTheAzuriteFairiesI18n,
};
