import type { CharacterCard } from "@tcg/lorcana-types";
import { lyleTiberiusRourkeCrystallizedCommanderEpicI18n } from "./214-lyle-tiberius-rourke-crystallized-commander-epic.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const lyleTiberiusRourkeCrystallizedCommanderEpic: CharacterCard = {
  id: "N9V",
  canonicalId: "ci_hMm",
  slug: "lorcana-ci_hMm",
  printings: [
    {
      id: "set12-214-epic",
      artId: "ci_hMm-epic",
      setCode: "set12",
      collectorNumber: "214",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set12-103"],
  cardType: "character",
  name: "Lyle Tiberius Rourke",
  version: "Crystallized Commander",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 214,
  rarity: "common",
  specialRarity: "epic",
  cost: 6,
  strength: 6,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_ab041a63b5204af49dbe1cbc49cbabe2",
    tcgPlayer: "692210",
  },
  text: [
    {
      title: "Shift 4 {I}",
    },
    {
      title: "PLAN'S CHANGED",
      description:
        "When you play this character, put the top 2 cards of your deck into your discard. Then, you may return an action card with cost 4 or less from your discard to your hand.",
    },
  ],
  classifications: ["Floodborn", "Villain"],
  abilities: [
    shift(4),
    {
      id: "hMm-2",
      name: "Plan's Changed",
      type: "triggered",
      text: "Plan's Changed When you play this character, put the top 2 cards of your deck into your discard. Then, you may return an action card with cost 4 or less from your discard to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "mill",
            amount: 2,
            target: "CONTROLLER",
          },
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "return-from-discard",
              target: "CONTROLLER",
              count: 1,
              cardType: "action",
              costRestriction: {
                comparison: "less-or-equal",
                value: 4,
              },
            },
          },
        ],
      },
    },
  ],
  i18n: lyleTiberiusRourkeCrystallizedCommanderEpicI18n,
};
