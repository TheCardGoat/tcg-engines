import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMousePirateCaptainI18n } from "./103-mickey-mouse-pirate-captain.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const mickeyMousePirateCaptain: CharacterCard = {
  id: "xEw",
  canonicalId: "ci_xEw",
  reprints: ["set6-103"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Pirate Captain",
  inkType: ["ruby"],
  set: "006",
  cardNumber: 103,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_2baa971c1cbf4f349f4d343cd97010d5",
    tcgPlayer: 593027,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "MARINER'S MIGHT",
      description:
        'Whenever this character quests, chosen Pirate character gets +2 {S} and gains "This character takes no damage from challenges" this turn.',
    },
  ],
  classifications: ["Floodborn", "Hero", "Pirate", "Captain"],
  abilities: [
    shift(3),
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 2,
            duration: "this-turn",
            target: {
              cardTypes: ["character"],
              count: 1,
              filter: [{ type: "has-classification", classification: "Pirate" }],
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
          },
          {
            type: "grant-ability",
            ability: "takes-no-damage-from-challenges",
            duration: "this-turn",
            target: { ref: "previous-target" },
          },
        ],
      },
      id: "adf-2",
      name: "MARINER'S MIGHT",
      text: 'MARINER\'S MIGHT Whenever this character quests, chosen Pirate character gets +2 {S} and gains "This character takes no damage from challenges" this turn.',
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: mickeyMousePirateCaptainI18n,
};
