import type { CharacterCard } from "@tcg/lorcana-types";
import { whiteRabbitLateAgainI18n } from "./089-white-rabbit-late-again.i18n";
import { underdog } from "../../../helpers/abilities/underdog";
import { evasive } from "../../../helpers/abilities/evasive";

export const whiteRabbitLateAgain: CharacterCard = {
  id: "k8j",
  canonicalId: "ci_k8j",
  reprints: ["set11-089"],
  cardType: "character",
  name: "White Rabbit",
  version: "Late Again",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "011",
  cardNumber: 89,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a8878d5ac3ea4ff7bfacb512552943cc",
    tcgPlayer: 673345,
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
  i18n: whiteRabbitLateAgainI18n,
};
