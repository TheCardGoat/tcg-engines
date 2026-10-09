import type { CharacterCard } from "@tcg/lorcana-types";
import { shift } from "../../../helpers/abilities";
import { cinderellaUnintentionalIconI18n } from "./157-cinderella-unintentional-icon.i18n";

export const cinderellaUnintentionalIcon: CharacterCard = {
  id: "aqW",
  canonicalId: "ci_aqW",
  slug: "lorcana-ci_aqW",
  printings: [
    {
      id: "set14-157",
      artId: "set14-157",
      setCode: "set14",
      collectorNumber: "157",
      rarity: "super_rare",
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
  cardNumber: 157,
  rarity: "super_rare",
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
              requiresLookedAtLeast: 2,
              min: 1,
              max: 1,
              exerted: true,
              facedown: true,
            },
          ],
        },
      },
    },
  ],
  i18n: cinderellaUnintentionalIconI18n,
};
