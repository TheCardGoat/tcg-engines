import type { CharacterCard } from "@tcg/lorcana-types";
import { mirabelMadrigalCuriousChildI18n } from "./010-mirabel-madrigal-curious-child.i18n";

export const mirabelMadrigalCuriousChild: CharacterCard = {
  id: "hyF",
  canonicalId: "ci_hyF",
  reprints: ["set8-010"],
  cardType: "character",
  name: "Mirabel Madrigal",
  version: "Curious Child",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "008",
  cardNumber: 10,
  rarity: "common",
  cost: 1,
  strength: 0,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c58b2d33655f4541baec11fcf639b1c5",
    tcgPlayer: 631354,
  },
  text: [
    {
      title: "YOU ARE A WONDER",
      description:
        "When you play this character, you may reveal a song card in your hand to gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Madrigal"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "select-target",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["hand"],
                cardTypes: ["song"],
              },
            },
            {
              type: "conditional",
              condition: { type: "if-you-do" },
              then: {
                type: "sequence",
                steps: [
                  {
                    type: "reveal",
                  },
                  {
                    type: "gain-lore",
                    amount: 1,
                  },
                ],
              },
            },
          ],
        },
        type: "optional",
      },
      id: "191-1",
      name: "YOU ARE A WONDER",
      text: "YOU ARE A WONDER When you play this character, you may reveal a song card in your hand to gain 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: mirabelMadrigalCuriousChildI18n,
};
