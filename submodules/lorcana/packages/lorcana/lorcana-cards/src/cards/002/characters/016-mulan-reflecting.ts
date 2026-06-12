import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanReflectingI18n } from "./016-mulan-reflecting.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const mulanReflecting: CharacterCard = {
  id: "1Ib",
  canonicalId: "ci_1Ib",
  reprints: ["set2-016"],
  cardType: "character",
  name: "Mulan",
  version: "Reflecting",
  inkType: ["amber"],
  franchise: "Mulan",
  set: "002",
  cardNumber: 16,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f04fa097a7234ecb95ea7eeea70c9c39",
    tcgPlayer: 525083,
  },
  text: [
    {
      title: "Shift 2",
    },
    {
      title: "HONOR TO THE ANCESTORS",
      description:
        "Whenever this character quests, you may reveal the top card of your deck. If it's a song card, you may play it for free. Otherwise, put it on the top of your deck.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
  abilities: [
    shift(2),
    {
      effect: {
        type: "scry",
        amount: 1,
        target: "CONTROLLER",
        revealAll: true,
        destinations: [
          {
            zone: "play",
            min: 0,
            max: 1,
            cost: "free",
            filter: { type: "song" },
          },
          {
            zone: "deck-top",
            remainder: true,
          },
        ],
      },
      id: "1ox-2",
      name: "HONOR TO THE ANCESTORS",
      text: "HONOR TO THE ANCESTORS Whenever this character quests, you may reveal the top card of your deck. If it's a song card, you may play it for free. Otherwise, put it on the top of your deck.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: mulanReflectingI18n,
};
