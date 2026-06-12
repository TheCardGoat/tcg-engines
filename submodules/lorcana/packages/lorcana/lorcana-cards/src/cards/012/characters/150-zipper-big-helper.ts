import type { CharacterCard } from "@tcg/lorcana-types";
import { zipperBigHelperI18n } from "./150-zipper-big-helper.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const zipperBigHelper: CharacterCard = {
  id: "lnZ",
  canonicalId: "ci_lnZ",
  reprints: ["set12-150"],
  cardType: "character",
  name: "Zipper",
  version: "Big Helper",
  inkType: ["sapphire"],
  franchise: "Rescue Rangers",
  set: "012",
  cardNumber: 150,
  rarity: "common",
  cost: 4,
  strength: 0,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a7f1e4a1087a438a98d149bb5c4e508b",
  },
  text: [
    {
      title: "Shift 2 {I}",
    },
    {
      title: "BUZZING ENTHUSIASM",
      description:
        "Whenever this character quests, you may add his {W} to another chosen character's {S} this turn.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
  abilities: [
    shift(2),
    {
      id: "lnZ-2",
      name: "BUZZING ENTHUSIASM",
      type: "triggered",
      text: "BUZZING ENTHUSIASM Whenever this character quests, you may add his {W} to another chosen character's {S} this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "modify-stat",
          stat: "strength",
          duration: "this-turn",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
            excludeSelf: true,
          },
          modifier: {
            type: "willpower-of",
            target: "SELF",
          },
        },
      },
    },
  ],
  i18n: zipperBigHelperI18n,
};
