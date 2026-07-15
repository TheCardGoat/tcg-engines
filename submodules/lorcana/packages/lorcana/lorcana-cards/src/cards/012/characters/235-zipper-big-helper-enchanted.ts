import type { CharacterCard } from "@tcg/lorcana-types";
import { zipperBigHelperEnchantedI18n } from "./235-zipper-big-helper-enchanted.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const zipperBigHelperEnchanted: CharacterCard = {
  id: "vYu",
  canonicalId: "ci_lnZ",
  slug: "lorcana-ci_lnZ",
  printings: [
    {
      id: "set12-235-enchanted",
      artId: "ci_lnZ-enchanted",
      setCode: "set12",
      collectorNumber: "235",
      rarity: "enchanted",
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
  cardNumber: 235,
  rarity: "enchanted",
  specialRarity: "enchanted",
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
  i18n: zipperBigHelperEnchantedI18n,
};
