import type { CharacterCard } from "@tcg/lorcana-types";
import { fairyGodmotherMysticArmorerI18n } from "./041-fairy-godmother-mystic-armorer.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const fairyGodmotherMysticArmorer: CharacterCard = {
  id: "1WY",
  canonicalId: "ci_1WY",
  reprints: ["set2-041"],
  cardType: "character",
  name: "Fairy Godmother",
  version: "Mystic Armorer",
  inkType: ["amethyst"],
  franchise: "Cinderella",
  set: "002",
  cardNumber: 41,
  rarity: "legendary",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ea4fdeec62324b1eac04465ca25a1fbc",
    tcgPlayer: 527734,
  },
  text: [
    {
      title: "Shift 2",
    },
    {
      title: "FORGET THE COACH, HERE'S A SWORD",
      description:
        'Whenever this character quests, your characters gain Challenger +3 and "When this character is banished in a challenge, return this card to your hand" this turn. (They get +3 {S} while challenging.)',
    },
  ],
  classifications: ["Floodborn", "Mentor", "Fairy"],
  abilities: [
    shift(2),
    {
      effect: {
        steps: [
          {
            keyword: "Challenger",
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "gain-keyword",
            value: 3,
            duration: "this-turn",
          },
          {
            ability: "return-to-hand-when-banished",
            duration: "this-turn",
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "grant-ability",
          },
        ],
        type: "sequence",
      },
      id: "fq8-2",
      name: "FORGET THE COACH, HERE'S A SWORD",
      text: 'FORGET THE COACH, HERE\'S A SWORD Whenever this character quests, your characters gain Challenger +3 and "When this character is banished in a challenge, return this card to your hand" this turn.',
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: fairyGodmotherMysticArmorerI18n,
};
