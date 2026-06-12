import type { CharacterCard } from "@tcg/lorcana-types";
import { almaMadrigalLeadingTheWayI18n } from "./036-alma-madrigal-leading-the-way.i18n";

export const almaMadrigalLeadingTheWay: CharacterCard = {
  id: "CTq",
  canonicalId: "ci_CTq",
  reprints: ["set12-036"],
  cardType: "character",
  name: "Alma Madrigal",
  version: "Leading the Way",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 36,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a4eb09772d744fb6ace3010ef6f15745",
  },
  text: [
    {
      title: "PROTECTING THE FAMILY",
      description:
        "When you play this character, if you have another Madrigal character in play, you may exert chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Madrigal"],
  abilities: [
    {
      id: "CTq-1",
      name: "PROTECTING THE FAMILY",
      type: "triggered",
      text: "PROTECTING THE FAMILY When you play this character, if you have another Madrigal character in play, you may exert chosen opposing character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "has-character-count",
        controller: "you",
        comparison: "greater-or-equal",
        count: 1,
        classification: "Madrigal",
        excludeSelf: true,
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "exert",
          target: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            cardTypes: ["character"],
            zones: ["play"],
          },
        },
      },
    },
  ],
  i18n: almaMadrigalLeadingTheWayI18n,
};
