import type { CharacterCard } from "@tcg/lorcana-types";
import { lyleTiberiusRourkeCrystallizedCommanderI18n } from "./103-lyle-tiberius-rourke-crystallized-commander.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const lyleTiberiusRourkeCrystallizedCommander: CharacterCard = {
  id: "hMm",
  canonicalId: "ci_hMm",
  reprints: ["set12-103"],
  cardType: "character",
  name: "Lyle Tiberius Rourke",
  version: "Crystallized Commander",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 103,
  rarity: "rare",
  cost: 6,
  strength: 6,
  willpower: 4,
  lore: 2,
  inkable: false,
  text: [
    {
      title: "<Shift> 4 {I}",
    },
    {
      title: "Plan's Changed",
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
  i18n: lyleTiberiusRourkeCrystallizedCommanderI18n,
};
