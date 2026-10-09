import type { CharacterCard } from "@tcg/lorcana-types";
import { brooklynFullThrottleI18n } from "./050-brooklyn-full-throttle.i18n";
import { stoneByDay } from "../../../helpers/abilities/stoneByDay";

export const brooklynFullThrottle: CharacterCard = {
  id: "PkS",
  canonicalId: "ci_PkS",
  slug: "lorcana-ci_PkS",
  printings: [
    {
      id: "set14-050",
      artId: "set14-050",
      setCode: "set14",
      collectorNumber: "50",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-050"],
  cardType: "character",
  name: "Brooklyn",
  version: "Full Throttle",
  inkType: ["amethyst"],
  franchise: "Gargoyles",
  set: "014",
  cardNumber: 50,
  rarity: "uncommon",
  cost: 1,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_dfc2900b9afb46079bebc1fd0bb83d16",
  },
  text: [
    {
      title: "WILD RIDE 6",
      description: "{I} — Gain 1 lore.",
    },
    {
      title: "STONE BY DAY",
      description: "If you have 3 or more cards in your hand, this character can't ready.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Gargoyle"],
  abilities: [
    {
      id: "PkS-1",
      name: "WILD RIDE 6",
      type: "activated",
      cost: {
        ink: 6,
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "WILD RIDE 6 {I} — Gain 1 lore.",
    },
    stoneByDay,
  ],
  i18n: brooklynFullThrottleI18n,
};
