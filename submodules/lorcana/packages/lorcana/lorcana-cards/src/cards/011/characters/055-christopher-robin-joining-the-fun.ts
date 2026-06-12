import type { CharacterCard } from "@tcg/lorcana-types";
import { christopherRobinJoiningTheFunI18n } from "./055-christopher-robin-joining-the-fun.i18n";
import { underdog } from "../../../helpers/abilities/underdog";

export const christopherRobinJoiningTheFun: CharacterCard = {
  id: "OZm",
  canonicalId: "ci_OZm",
  reprints: ["set11-055"],
  cardType: "character",
  name: "Christopher Robin",
  version: "Joining the Fun",
  inkType: ["amethyst"],
  franchise: "Winnie the Pooh",
  set: "011",
  cardNumber: 55,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_6ef0db16a9b944d29c9a18fb37a8916d",
    tcgPlayer: 676194,
  },
  text: [
    {
      title: "UNDERDOG",
      description:
        "If this is your first turn and you're not the first player, you pay 1 {I} less to play this character.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [underdog],
  i18n: christopherRobinJoiningTheFunI18n,
};
