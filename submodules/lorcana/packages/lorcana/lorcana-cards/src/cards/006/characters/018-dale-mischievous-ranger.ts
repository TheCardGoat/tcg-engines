import type { CharacterCard } from "@tcg/lorcana-types";
import { daleMischievousRangerI18n } from "./018-dale-mischievous-ranger.i18n";

export const daleMischievousRanger: CharacterCard = {
  id: "gNk",
  canonicalId: "ci_gNk",
  reprints: ["set6-018"],
  cardType: "character",
  name: "Dale",
  version: "Mischievous Ranger",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "006",
  cardNumber: 18,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a0d0572121974dd1afc318bb0fd0907e",
    tcgPlayer: 578170,
  },
  text: [
    {
      title: "NUTS ABOUT PRANKS",
      description:
        "When you play this character, you may put the top 3 cards of your deck into your discard to give chosen character -3 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "gNk-1",
      name: "NUTS ABOUT PRANKS",
      text: "NUTS ABOUT PRANKS When you play this character, you may put the top 3 cards of your deck into your discard to give chosen character -3 {S} until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      effect: {
        chooser: "CONTROLLER",
        type: "optional",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "mill",
              amount: 3,
              target: "CONTROLLER",
            },
            {
              type: "modify-stat",
              stat: "strength",
              modifier: -3,
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
              duration: "until-start-of-next-turn",
            },
          ],
        },
      },
    },
  ],
  i18n: daleMischievousRangerI18n,
};
