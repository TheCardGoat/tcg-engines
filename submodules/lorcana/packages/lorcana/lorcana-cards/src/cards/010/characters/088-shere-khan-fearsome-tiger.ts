import type { CharacterCard } from "@tcg/lorcana-types";
import { evasive } from "../../../helpers/abilities/evasive";
import { shereKhanFearsomeTigerI18n } from "./088-shere-khan-fearsome-tiger.i18n";

export const shereKhanFearsomeTiger: CharacterCard = {
  id: "oaJ",
  canonicalId: "ci_oaJ",
  reprints: ["set10-088"],
  cardType: "character",
  name: "Shere Khan",
  version: "Fearsome Tiger",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "010",
  cardNumber: 88,
  rarity: "legendary",
  cost: 6,
  strength: 5,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_3a25fa761fb34e3d96aacc65d82eb2af",
    tcgPlayer: 659623,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "ON THE HUNT",
      description:
        "Whenever this character quests, banish chosen opposing damaged character. Then, you may put 1 damage counter on another chosen character.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    evasive,
    {
      effect: {
        steps: [
          {
            target: "CHOSEN_OPPOSING_DAMAGED_CHARACTER",
            type: "banish",
          },
          {
            chooser: "CONTROLLER",
            effect: {
              amount: 1,
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
              type: "put-damage",
            },
            type: "optional",
          },
        ],
        type: "sequence",
      },
      id: "1gj-2",
      name: "ON THE HUNT",
      text: "ON THE HUNT Whenever this character quests, banish chosen opposing damaged character. Then, you may put 1 damage counter on another chosen character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: shereKhanFearsomeTigerI18n,
};
