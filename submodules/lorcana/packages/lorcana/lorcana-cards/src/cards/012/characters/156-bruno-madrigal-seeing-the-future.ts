import type { CharacterCard } from "@tcg/lorcana-types";
import { brunoMadrigalSeeingTheFutureI18n } from "./156-bruno-madrigal-seeing-the-future.i18n";

export const brunoMadrigalSeeingTheFuture: CharacterCard = {
  id: "U5v",
  canonicalId: "ci_U5v",
  reprints: ["set12-156"],
  cardType: "character",
  name: "Bruno Madrigal",
  version: "Seeing the Future",
  inkType: ["sapphire"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 156,
  rarity: "common",
  cost: 6,
  strength: 5,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_8a69b362d8e44f9abee64c1d4800420f",
  },
  text: [
    {
      title: "CHANGE THE OUTCOME",
      description:
        "When you play this character, you may look at the top card of chosen player's deck. Put it on either the top or the bottom of their deck.",
    },
  ],
  abilities: [
    {
      id: "U5v-1",
      name: "CHANGE THE OUTCOME",
      type: "triggered",
      trigger: { event: "play", on: "SELF", timing: "when" },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "scry",
          amount: 1,
          target: "CHOSEN_PLAYER",
          destinations: [
            { zone: "deck-top", max: 1 },
            { zone: "deck-bottom", remainder: true },
          ],
        },
      },
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
  i18n: brunoMadrigalSeeingTheFutureI18n,
};
