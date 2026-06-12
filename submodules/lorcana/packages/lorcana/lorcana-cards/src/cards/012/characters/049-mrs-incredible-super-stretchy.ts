import type { CharacterCard } from "@tcg/lorcana-types";
import { mrsIncredibleSuperStretchyI18n } from "./049-mrs-incredible-super-stretchy.i18n";

export const mrsIncredibleSuperStretchy: CharacterCard = {
  id: "QuL",
  canonicalId: "ci_QuL",
  reprints: ["set12-049"],
  cardType: "character",
  name: "Mrs. Incredible",
  version: "Super Stretchy",
  inkType: ["amethyst"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 49,
  rarity: "rare",
  cost: 5,
  strength: 5,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a7974610679d43d190ee370d23d6e0b3",
  },
  text: [
    {
      title: "FLEXIBLE THINKING",
      description: "At the start of your turn, you may choose one:",
    },
    {
      title: "• This character gains Evasive until the start of your next turn.",
    },
    {
      title: "• This character gets +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero"],
  abilities: [
    {
      id: "QuL-1",
      name: "FLEXIBLE THINKING",
      type: "triggered",
      text: "FLEXIBLE THINKING At the start of your turn, you may choose one: • This character gains Evasive until the start of your next turn. • This character gets +1 {L} this turn.",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "choice",
          optionLabels: [
            "This character gains Evasive until the start of your next turn.",
            "This character gets +1 {L} this turn.",
          ],
          options: [
            {
              type: "gain-keyword",
              keyword: "Evasive",
              duration: "until-start-of-next-turn",
              target: "SELF",
            },
            {
              type: "modify-stat",
              stat: "lore",
              modifier: 1,
              duration: "this-turn",
              target: "SELF",
            },
          ],
        },
      },
    },
  ],
  i18n: mrsIncredibleSuperStretchyI18n,
};
