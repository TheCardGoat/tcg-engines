import type { CharacterCard } from "@tcg/lorcana-types";
import { isabelaMadrigalCaringCultivatorI18n } from "./019-isabela-madrigal-caring-cultivator.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const isabelaMadrigalCaringCultivator: CharacterCard = {
  id: "MoR",
  canonicalId: "ci_MoR",
  reprints: ["set12-019"],
  cardType: "character",
  name: "Isabela Madrigal",
  version: "Caring Cultivator",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 19,
  rarity: "rare",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_68c6733378304dca8d2adb4b1c993433",
  },
  text: [
    {
      title: "Shift 4 {I}",
    },
    {
      title: "DO NO WRONG",
      description:
        "Whenever you remove damage from one of your characters, gain 1 lore for each 1 damage removed.",
    },
  ],
  classifications: ["Floodborn", "Ally", "Madrigal"],
  abilities: [
    shift(4),
    {
      id: "MoR-2",
      name: "DO NO WRONG",
      type: "triggered",
      text: "DO NO WRONG Whenever you remove damage from one of your characters, gain 1 lore for each 1 damage removed.",
      trigger: {
        event: "remove-damage",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: "DAMAGE_REMOVED",
        target: "CONTROLLER",
      },
    },
  ],
  i18n: isabelaMadrigalCaringCultivatorI18n,
};
