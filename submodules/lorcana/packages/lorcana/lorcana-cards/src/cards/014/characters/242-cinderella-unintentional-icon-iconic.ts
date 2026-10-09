import type { CharacterCard } from "@tcg/lorcana-types";
import { shift } from "../../../helpers/abilities";
import { cinderellaUnintentionalIconIconicI18n } from "./242-cinderella-unintentional-icon-iconic.i18n";

export const cinderellaUnintentionalIconIconic: CharacterCard = {
  id: "QzF",
  canonicalId: "ci_aqW",
  slug: "lorcana-ci_aqW",
  printings: [
    {
      id: "set14-242-iconic",
      artId: "ci_aqW-iconic",
      setCode: "set14",
      collectorNumber: "242",
      rarity: "iconic",
      imageUrl: "",
    },
  ],
  reprints: ["set14-157"],
  cardType: "character",
  name: "Cinderella",
  version: "Unintentional Icon",
  inkType: ["sapphire"],
  franchise: "Cinderella",
  set: "014",
  cardNumber: 242,
  rarity: "iconic",
  specialRarity: "iconic",
  cost: 7,
  strength: 4,
  willpower: 6,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_6a6e3f2df2d448bc99d1492d3d6585e6",
  },
  text: [
    {
      title: "Shift 5 {I}",
    },
    {
      title: "BESPOKE DESIGN",
      description:
        "At the end of your turn, you may look at the top 2 cards of your deck. Put one on either the top or the bottom of your deck and the other into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    shift(5),
    {
      id: "cinderella-1",
      name: "BESPOKE DESIGN",
      type: "triggered",
      text: "BESPOKE DESIGN At the end of your turn, you may look at the top 2 cards of your deck. Put one on either the top or the bottom of your deck and the other into your inkwell facedown and exerted.",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "scry",
          amount: 2,
          target: "CONTROLLER",
          destinations: [
            {
              zone: "deck-top",
              max: 1,
            },
            {
              zone: "deck-bottom",
              max: 1,
            },
            {
              zone: "inkwell",
              min: 1,
              requiresLookedAtLeast: 2,
              max: 1,
              exerted: true,
              facedown: true,
            },
          ],
        },
      },
    },
  ],
  i18n: cinderellaUnintentionalIconIconicI18n,
};
