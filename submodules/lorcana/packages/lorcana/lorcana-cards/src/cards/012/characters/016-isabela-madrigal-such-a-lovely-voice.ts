import type { CharacterCard } from "@tcg/lorcana-types";
import { isabelaMadrigalSuchALovelyVoiceI18n } from "./016-isabela-madrigal-such-a-lovely-voice.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const isabelaMadrigalSuchALovelyVoice: CharacterCard = {
  id: "jrh",
  canonicalId: "ci_jrh",
  reprints: ["set12-016"],
  cardType: "character",
  name: "Isabela Madrigal",
  version: "Such a Lovely Voice",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 16,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1747f940605e4b6eb87f5df5ee96d9d8",
  },
  text: [
    {
      title: "Singer 5",
    },
    {
      title: "NEW MOTIF",
      description:
        "When you play this character, if you removed 1 or more damage from one of your characters this turn, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
  abilities: [
    singer(5),
    {
      id: "jrh-2",
      name: "NEW MOTIF",
      type: "triggered",
      text: "NEW MOTIF When you play this character, if you removed 1 or more damage from one of your characters this turn, gain 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "turn-metric",
        metric: "damage-removed-by-player",
        playerScope: "you",
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: isabelaMadrigalSuchALovelyVoiceI18n,
};
