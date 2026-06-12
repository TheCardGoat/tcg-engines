import type { CharacterCard } from "@tcg/lorcana-types";
import { camiloMadrigalFamilyCopycatI18n } from "./058-camilo-madrigal-family-copycat.i18n";

export const camiloMadrigalFamilyCopycat: CharacterCard = {
  id: "LZo",
  canonicalId: "ci_LZo",
  reprints: ["set5-058"],
  cardType: "character",
  name: "Camilo Madrigal",
  version: "Family Copycat",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "005",
  cardNumber: 58,
  rarity: "legendary",
  cost: 6,
  strength: 3,
  willpower: 7,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7fd5d0e0a462464dbc04f11a37718f4a",
    tcgPlayer: 561300,
  },
  text: [
    {
      title: "IMITATE",
      description:
        "Whenever this character quests, you may gain lore equal to the {L} of chosen other character of yours. Return that character to your hand.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
  abilities: [
    {
      id: "1ra-1",
      name: "IMITATE",
      text: "IMITATE Whenever this character quests, you may gain lore equal to the {L} of chosen other character of yours. Return that character to your hand.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "gain-lore",
              amount: {
                type: "target-attribute",
                attribute: "lore",
              },
              target: "CONTROLLER",
            },
            {
              type: "return-to-hand",
              target: "ANOTHER_CHOSEN_CHARACTER_OF_YOURS",
            },
          ],
        },
      },
    },
  ],
  i18n: camiloMadrigalFamilyCopycatI18n,
};
