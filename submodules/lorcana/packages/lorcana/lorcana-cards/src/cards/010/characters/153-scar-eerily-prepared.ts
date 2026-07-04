import type { CharacterCard } from "@tcg/lorcana-types";
import { scarEerilyPreparedI18n } from "./153-scar-eerily-prepared.i18n";

import { boost } from "../../../helpers/abilities/boost";

export const scarEerilyPrepared: CharacterCard = {
  id: "xU1",
  canonicalId: "ci_X5v",
  slug: "lorcana-ci_X5v",
  printings: [
    {
      id: "set10-153",
      artId: "set10-153",
      setCode: "set10",
      collectorNumber: "153",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set10-153"],
  cardType: "character",
  name: "Scar",
  version: "Eerily Prepared",
  inkType: ["sapphire"],
  franchise: "Lion King",
  set: "010",
  cardNumber: 153,
  rarity: "common",
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_f2674e110de64c81ae9b07068364c22d",
    tcgPlayer: "659384",
  },
  text: [
    {
      title: "Boost 2 {I}",
    },
    {
      title: "SURVIVAL OF THE FITTEST",
      description:
        "Whenever you put a card under this character, chosen opposing character gets -5 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Whisper"],
  abilities: [
    boost(2),
    {
      effect: {
        duration: "this-turn",
        modifier: -5,
        stat: "strength",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "modify-stat",
      },
      id: "1rg-2",
      name: "SURVIVAL OF THE FITTEST",
      text: "SURVIVAL OF THE FITTEST Whenever you put a card under this character, chosen opposing character gets -5 {S} this turn.",
      trigger: {
        event: "put-card-under",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: scarEerilyPreparedI18n,
};
