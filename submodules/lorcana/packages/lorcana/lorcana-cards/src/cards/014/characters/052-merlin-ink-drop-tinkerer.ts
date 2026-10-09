import type { CharacterCard } from "@tcg/lorcana-types";
import { merlinInkDropTinkererI18n } from "./052-merlin-ink-drop-tinkerer.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const merlinInkDropTinkerer: CharacterCard = {
  id: "AtI",
  canonicalId: "ci_AtI",
  slug: "lorcana-ci_AtI",
  printings: [
    {
      id: "set14-052",
      artId: "set14-052",
      setCode: "set14",
      collectorNumber: "52",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-052"],
  cardType: "character",
  name: "Merlin",
  version: "Ink Drop Tinkerer",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 52,
  rarity: "rare",
  cost: 7,
  strength: 6,
  willpower: 8,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_df613732dc6641a6b0a8699c056c070f",
  },
  text: [
    {
      title: "Shift 5 {I}",
    },
    {
      title: "WHAT",
      description:
        "A DISCOVERY! When you play this character, get 1 ink drop. If you used Shift to play him, get 2 ink drops instead. (Each ink drop may be removed to pay 1 {I}.)",
    },
  ],
  classifications: ["Dreamborn", "Mentor", "Sorcerer"],
  abilities: [
    shift(5),
    {
      id: "AtI-2",
      name: "WHAT A DISCOVERY!",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "not",
        condition: {
          type: "used-shift",
        },
      },
      effect: {
        type: "gain-ink-drop",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "WHAT A DISCOVERY! When you play this character, get 1 ink drop if you did not use Shift to play him.",
    },
    {
      id: "AtI-3",
      name: "WHAT A DISCOVERY!",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "used-shift",
      },
      effect: {
        type: "gain-ink-drop",
        amount: 2,
        target: "CONTROLLER",
      },
      text: "WHAT A DISCOVERY! If you used Shift to play him, get 2 ink drops instead.",
    },
  ],
  i18n: merlinInkDropTinkererI18n,
};
