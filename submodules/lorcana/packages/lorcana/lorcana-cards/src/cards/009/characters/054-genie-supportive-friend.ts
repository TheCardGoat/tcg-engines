import type { CharacterCard } from "@tcg/lorcana-types";
import { genieSupportiveFriendI18n } from "./054-genie-supportive-friend.i18n";

export const genieSupportiveFriend: CharacterCard = {
  id: "HaG",
  canonicalId: "ci_pLA",
  slug: "lorcana-ci_pLA",
  printings: [
    {
      id: "set9-054",
      artId: "set9-054",
      setCode: "set9",
      collectorNumber: "54",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set3-038", "set9-054"],
  cardType: "character",
  name: "Genie",
  version: "Supportive Friend",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "009",
  cardNumber: 54,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 5,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_777ef1df73214a63a89bce29396afefa",
    tcgPlayer: "649998",
  },
  text: [
    {
      title: "THREE WISHES",
      description:
        "Whenever this character quests, you may shuffle this card into your deck to draw 3 cards.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              intoDeck: "owner",
              target: "SELF",
              type: "shuffle-into-deck",
            },
            {
              type: "draw",
              amount: 3,
              target: "CONTROLLER",
            },
          ],
        },
        type: "optional",
      },
      id: "146-1",
      name: "THREE WISHES",
      text: "THREE WISHES Whenever this character quests, you may shuffle this card into your deck to draw 3 cards.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: genieSupportiveFriendI18n,
};
