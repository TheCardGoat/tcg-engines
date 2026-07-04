import type { CharacterCard } from "@tcg/lorcana-types";
import { zipperBigHelperI18n } from "./150-zipper-big-helper.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const zipperBigHelper: CharacterCard = {
  id: "lnZ",
  canonicalId: "ci_lnZ",
  slug: "lorcana-ci_lnZ",
  printings: [
    {
      id: "set12-150",
      artId: "set12-150",
      setCode: "set12",
      collectorNumber: "150",
      rarity: "common",
      imageUrl: "",
    },
  ],
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
    lorcast: "crd_d515c85e0daa4cfd8c3a84154d328cd4",
    tcgPlayer: "692226",
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
