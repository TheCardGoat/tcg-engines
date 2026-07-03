import type { CharacterCard } from "@tcg/lorcana-types";
import { mingLeeOverprotectiveParentI18n } from "./049-ming-lee-overprotective-parent.i18n";

export const mingLeeOverprotectiveParent: CharacterCard = {
  id: "N4W",
  canonicalId: "ci_N4W",
  slug: "lorcana-ci_N4W",
  printings: [
    {
      id: "set13-049",
      artId: "set13-049",
      setCode: "set13",
      collectorNumber: "49",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-049"],
  cardType: "character",
  name: "Ming Lee",
  version: "Overprotective Parent",
  inkType: ["amethyst"],
  franchise: "Turning Red",
  set: "013",
  cardNumber: 49,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_0cba97ca8b2d4eb3bdf4e78eceb0e6d9",
  },
  text: [
    {
      title: "YOU'RE GROUNDED",
      description:
        "When you shift a character on top of this character, chosen opposing exerted character can't ready at the start of their next turn.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Red Panda"],
  abilities: [
    {
      id: "N4W-1",
      name: "YOU'RE GROUNDED",
      type: "triggered",
      text: "YOU'RE GROUNDED When you shift a character on top of this character, chosen opposing exerted character can't ready at the start of their next turn.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "character",
          shiftedOntoSelf: true,
        },
        timing: "when",
      },
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        duration: "until-start-of-next-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "status",
              status: "exerted",
            },
          ],
        },
      },
    },
  ],
  i18n: mingLeeOverprotectiveParentI18n,
};
