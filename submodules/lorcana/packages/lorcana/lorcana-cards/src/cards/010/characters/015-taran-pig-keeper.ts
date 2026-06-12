import type { CharacterCard } from "@tcg/lorcana-types";
import { support } from "../../../helpers/abilities/support";
import { taranPigKeeperI18n } from "./015-taran-pig-keeper.i18n";

export const taranPigKeeper: CharacterCard = {
  id: "JL3",
  canonicalId: "ci_JL3",
  reprints: ["set10-015"],
  cardType: "character",
  name: "Taran",
  version: "Pig Keeper",
  inkType: ["amber"],
  franchise: "Black Cauldron",
  set: "010",
  cardNumber: 15,
  rarity: "uncommon",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_8f86e553eb5c40dc8833c69b23a732ff",
    tcgPlayer: 658291,
  },
  text: [
    {
      title: "Support",
    },
    {
      title: "FOLLOW THE PIG",
      description:
        "Whenever this character quests, you may return a character card named Hen Wen from your discard to your hand.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    support,
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          filter: {
            cardType: "character",
            name: "Hen Wen",
          },
          target: "CONTROLLER",
          type: "return-from-discard",
        },
        type: "optional",
      },
      id: "5f5-2",
      name: "FOLLOW THE PIG",
      text: "FOLLOW THE PIG Whenever this character quests, you may return a character card named Hen Wen from your discard to your hand.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: taranPigKeeperI18n,
};
