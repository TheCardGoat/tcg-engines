import type { CharacterCard } from "@tcg/lorcana-types";
import { whiteRabbitLateAgainP3ChallengeI18n } from "./p3-029-white-rabbit-late-again-challenge.i18n";

import { underdog } from "../../../helpers/abilities/underdog";
import { evasive } from "../../../helpers/abilities/evasive";

export const whiteRabbitLateAgainP3Challenge: CharacterCard = {
  id: "WOp",
  canonicalId: "ci_qw7",
  slug: "lorcana-ci_qw7",
  printings: [
    {
      id: "set11-p3-029-challenge",
      artId: "ci_qw7-challenge",
      setCode: "set11",
      collectorNumber: "29",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set11-089"],
  cardType: "character",
  name: "White Rabbit",
  version: "Late Again",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "011",
  cardNumber: 29,
  rarity: "special",
  specialRarity: "challenge",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a8878d5ac3ea4ff7bfacb512552943cc",
    tcgPlayer: "673345",
  },
  text: [
    {
      title: "UNDERDOG",
      description:
        "If this is your first turn and you're not the first player, you pay 1 {I} less to play this character.",
    },
    {
      title: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [underdog, evasive],
  i18n: whiteRabbitLateAgainP3ChallengeI18n,
};
