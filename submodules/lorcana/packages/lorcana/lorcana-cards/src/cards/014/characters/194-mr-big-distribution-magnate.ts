import type { CharacterCard } from "@tcg/lorcana-types";
import { mrBigDistributionMagnateI18n } from "./194-mr-big-distribution-magnate.i18n";

export const mrBigDistributionMagnate: CharacterCard = {
  id: "PXK",
  canonicalId: "ci_PXK",
  slug: "lorcana-ci_PXK",
  printings: [
    {
      id: "set14-194",
      artId: "set14-194",
      setCode: "set14",
      collectorNumber: "194",
      rarity: "super_rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-194"],
  cardType: "character",
  name: "Mr. Big",
  version: "Distribution Magnate",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "014",
  cardNumber: 194,
  rarity: "super_rare",
  cost: 2,
  strength: 0,
  willpower: 2,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Ice Out",
      description:
        "At the end of your turn, if all cards in your inkwell are exerted, chosen opposing character can't challenge until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      id: "mr-big-1",
      name: "Ice Out",
      type: "triggered",
      text: "Ice Out At the end of your turn, if all cards in your inkwell are exerted, chosen opposing character can't challenge until the start of your next turn.",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "resource-count",
        what: "ready-cards-in-inkwell",
        controller: "you",
        comparison: "equal",
        value: 0,
      },
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "until-start-of-next-turn",
      },
    },
  ],
  i18n: mrBigDistributionMagnateI18n,
};
