import type { CharacterCard } from "@tcg/lorcana-types";
import { chiefBogoPoliceCommissionerI18n } from "./183-chief-bogo-police-commissioner.i18n";

export const chiefBogoPoliceCommissioner: CharacterCard = {
  id: "SUz",
  canonicalId: "ci_SUz",
  slug: "lorcana-ci_SUz",
  printings: [
    {
      id: "set14-183",
      artId: "set14-183",
      setCode: "set14",
      collectorNumber: "183",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-183"],
  cardType: "character",
  name: "Chief Bogo",
  version: "Police Commissioner",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "014",
  cardNumber: 183,
  rarity: "uncommon",
  cost: 7,
  strength: 6,
  willpower: 6,
  lore: 3,
  inkable: true,
  text: [
    {
      title: "I Know These Streets",
      description:
        "Whenever this character quests, you may move him to a Hyperia City location for free.",
    },
    {
      title: "Stop Right There",
      description:
        "6 {I} — Chosen opposing character can't challenge until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn"],
  abilities: [
    {
      id: "SUz-1",
      name: "I Know These Streets",
      type: "triggered",
      text: "I Know These Streets Whenever this character quests, you may move him to a Hyperia City location for free.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "move-to-location",
          character: "SELF",
          location: {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["play"],
            cardTypes: ["location"],
            filters: [
              {
                type: "has-classification",
                classification: "Hyperia City",
              },
            ],
          },
          cost: "free",
        },
      },
    },
    {
      id: "SUz-2",
      name: "Stop Right There",
      type: "activated",
      text: "Stop Right There 6 {I} — Chosen opposing character can't challenge until the start of your next turn.",
      cost: {
        ink: 6,
      },
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        duration: "until-start-of-next-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: chiefBogoPoliceCommissionerI18n,
};
