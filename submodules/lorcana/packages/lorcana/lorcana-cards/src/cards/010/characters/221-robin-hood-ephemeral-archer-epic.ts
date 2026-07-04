import type { CharacterCard } from "@tcg/lorcana-types";
import { robinHoodEphemeralArcherEpicI18n } from "./221-robin-hood-ephemeral-archer-epic.i18n";

import { boost } from "../../../helpers/abilities/boost";

export const robinHoodEphemeralArcherEpic: CharacterCard = {
  id: "gNw",
  canonicalId: "ci_ZXj",
  slug: "lorcana-ci_ZXj",
  printings: [
    {
      id: "set10-221-epic",
      artId: "ci_ZXj-epic",
      setCode: "set10",
      collectorNumber: "221",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set10-171"],
  cardType: "character",
  name: "Robin Hood",
  version: "Ephemeral Archer",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "010",
  cardNumber: 221,
  rarity: "common",
  specialRarity: "epic",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_9a7e83a63b8444438f4bc7714df6faf9",
    tcgPlayer: "660272",
  },
  text: [
    {
      title: "Boost 1 {I}",
    },
    {
      title: "EXPERT SHOT",
      description:
        "Whenever this character quests, if there's a card under him, deal 1 damage to up to 2 chosen characters.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Whisper"],
  abilities: [
    boost(1),
    {
      condition: {
        type: "has-card-under",
      },
      effect: {
        amount: 1,
        target: {
          selector: "chosen",
          count: { upTo: 2 },
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "deal-damage",
      },
      id: "1pw-2",
      name: "EXPERT SHOT",
      text: "EXPERT SHOT Whenever this character quests, if there's a card under him, deal 1 damage to up to 2 chosen characters.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: robinHoodEphemeralArcherEpicI18n,
};
