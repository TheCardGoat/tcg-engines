import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchAlienTroublemakerI18n } from "./200-stitch-alien-troublemaker.i18n";

export const stitchAlienTroublemaker: CharacterCard = {
  id: "gd1",
  canonicalId: "ci_gd1",
  reprints: ["set8-200"],
  cardType: "character",
  name: "Stitch",
  version: "Alien Troublemaker",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "008",
  cardNumber: 200,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e402670f5e814601b3995fd962e79a7e",
    tcgPlayer: 631332,
  },
  text: [
    {
      title: "I WIN!",
      description:
        "During your turn, whenever this character banishes another character in a challenge, you may draw a card and gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Alien"],
  abilities: [
    {
      id: "aiz-1",
      name: "I WIN!",
      text: "I WIN! During your turn, whenever this character banishes another character in a challenge, you may draw a card and gain 1 lore.",
      type: "triggered",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
        restrictions: [{ type: "during-turn", whose: "your" }],
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "draw",
              amount: 1,
              target: "CONTROLLER",
            },
            {
              type: "gain-lore",
              amount: 1,
              target: "CONTROLLER",
            },
          ],
        },
      },
    },
  ],
  i18n: stitchAlienTroublemakerI18n,
};
