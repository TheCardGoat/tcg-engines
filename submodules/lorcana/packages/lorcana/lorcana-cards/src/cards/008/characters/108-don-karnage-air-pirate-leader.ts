import type { CharacterCard } from "@tcg/lorcana-types";
import { donKarnageAirPirateLeaderI18n } from "./108-don-karnage-air-pirate-leader.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const donKarnageAirPirateLeader: CharacterCard = {
  id: "lub",
  canonicalId: "ci_lub",
  reprints: ["set8-108"],
  cardType: "character",
  name: "Don Karnage",
  version: "Air Pirate Leader",
  inkType: ["emerald", "steel"],
  franchise: "Talespin",
  set: "008",
  cardNumber: 108,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_618a43c6b78446dbb31c8637116fafb7",
    tcgPlayer: 631419,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "SCORNFUL TAUNT",
      description:
        "Whenever you play an action that isn't a song, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
    },
  ],
  classifications: ["Storyborn", "Villain", "Prince", "Pirate"],
  abilities: [
    evasive,
    {
      effect: {
        keyword: "Reckless",
        duration: "their-next-turn",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "gain-keyword",
      },
      id: "3tm-2",
      name: "SCORNFUL TAUNT",
      text: "SCORNFUL TAUNT Whenever you play an action that isn’t a song, chosen opposing character gains Reckless during their next turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
          excludeSong: true,
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: donKarnageAirPirateLeaderI18n,
};
