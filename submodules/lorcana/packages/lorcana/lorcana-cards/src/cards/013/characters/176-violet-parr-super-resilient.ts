import type { CharacterCard } from "@tcg/lorcana-types";
import { resist } from "../../../helpers/abilities/resist";
import { shift } from "../../../helpers/abilities/shift";
import { violetParrSuperResilientI18n } from "./176-violet-parr-super-resilient.i18n";

export const violetParrSuperResilient: CharacterCard = {
  id: "Fqd",
  canonicalId: "ci_Fqd",
  slug: "lorcana-ci_Fqd",
  printings: [
    {
      id: "set13-176",
      artId: "set13-176",
      setCode: "set13",
      collectorNumber: "176",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-176"],
  cardType: "character",
  name: "Violet Parr",
  version: "Super Resilient",
  inkType: ["steel"],
  franchise: "Incredibles",
  set: "013",
  cardNumber: 176,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_42efa28cb93746cf9a64e8b2929ef069",
  },
  text: [
    {
      title: "Shift 3",
      description:
        "(You may pay 3 ink to play this on top of one of your characters named Violet Parr.)",
    },
    {
      title: "Resist +1",
    },
    {
      title: "HEROIC SYNERGY",
      description:
        "Whenever you play this or another Hero character, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero"],
  abilities: [
    shift("Violet Parr", 3),
    resist(1),
    {
      type: "triggered",
      name: "HEROIC SYNERGY",
      text: "HEROIC SYNERGY Whenever you play this or another Hero character, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          classification: "Hero",
          controller: "you",
        },
        timing: "whenever",
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
              type: "discard",
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
            },
          ],
        },
      },
    },
  ],
  i18n: violetParrSuperResilientI18n,
};
