import type { CharacterCard } from "@tcg/lorcana-types";
import { shift } from "../../../helpers/abilities/shift";
import { fredAwesomeBossI18n } from "./086-fred-awesome-boss.i18n";

export const fredAwesomeBoss: CharacterCard = {
  id: "B6x",
  canonicalId: "ci_B6x",
  slug: "lorcana-ci_B6x",
  printings: [
    {
      id: "set14-086",
      artId: "set14-086",
      setCode: "set14",
      collectorNumber: "86",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-086"],
  cardType: "character",
  name: "Fred",
  version: "Awesome Boss",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 86,
  rarity: "rare",
  cost: 6,
  strength: 6,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0d1f76836f764e568f7061fc57887923",
  },
  text: [
    {
      title: "Shift 4 {I}",
    },
    {
      title: "RADICAL RESOURCES",
      description:
        "Whenever you play this or another Super character, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  classifications: ["Dreamborn", "Super", "Hero"],
  abilities: [
    shift(4),
    {
      id: "B6x-1",
      name: "RADICAL RESOURCES",
      type: "triggered",
      text: "RADICAL RESOURCES Whenever you play this or another Super character, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "gain-ink-drop",
        amount: 1,
        target: "CONTROLLER",
      },
    },
    {
      id: "B6x-2",
      name: "RADICAL RESOURCES",
      type: "triggered",
      text: "RADICAL RESOURCES Whenever you play this or another Super character, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          classification: "Super",
          controller: "you",
        },
        timing: "whenever",
      },
      effect: {
        type: "gain-ink-drop",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: fredAwesomeBossI18n,
};
