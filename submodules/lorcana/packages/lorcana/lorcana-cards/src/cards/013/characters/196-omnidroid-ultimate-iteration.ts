import type { CharacterCard } from "@tcg/lorcana-types";
import { omnidroidUltimateIterationI18n } from "./196-omnidroid-ultimate-iteration.i18n";

import { resist } from "../../../helpers/abilities/resist";
import { shift } from "../../../helpers/abilities/shift";

export const omnidroidUltimateIteration: CharacterCard = {
  id: "NTm",
  canonicalId: "ci_NTm",
  slug: "lorcana-ci_NTm",
  printings: [
    {
      id: "set13-196",
      artId: "set13-196",
      setCode: "set13",
      collectorNumber: "196",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-196"],
  cardType: "character",
  name: "Omnidroid",
  version: "Ultimate Iteration",
  inkType: ["steel"],
  franchise: "Incredibles",
  set: "013",
  cardNumber: 196,
  rarity: "rare",
  cost: 8,
  strength: 8,
  willpower: 8,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_dce73ba526114978b851ac2f673a02bc",
  },
  text: [
    {
      title: "Shift 6",
      description:
        "(You may pay 6 ink to play this on top of one of your characters named Omnidroid.)",
    },
    {
      title: "Resist +2",
    },
    {
      title: "RETURN ON INVESTMENT",
      description: "When you shift this character, you may return all cards under it to your hand.",
    },
  ],
  classifications: ["Dreamborn", "Robot"],
  abilities: [
    shift(6),
    resist(2),
    {
      id: "NTm-1",
      name: "RETURN ON INVESTMENT",
      type: "triggered",
      text: "RETURN ON INVESTMENT When you shift this character, you may return all cards under it to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "used-shift",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "move-cards-from-under",
          target: "SELF",
          destination: "hand",
        },
      },
    },
  ],
  i18n: omnidroidUltimateIterationI18n,
};
