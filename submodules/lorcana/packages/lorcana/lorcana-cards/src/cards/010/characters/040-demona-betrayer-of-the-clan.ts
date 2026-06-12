import type { CharacterCard } from "@tcg/lorcana-types";
import { demonaBetrayerOfTheClanI18n } from "./040-demona-betrayer-of-the-clan.i18n";
import { challenger } from "../../../helpers/abilities/challenger";
import { stoneByDay } from "../../../helpers/abilities/stoneByDay";

export const demonaBetrayerOfTheClan: CharacterCard = {
  id: "dX5",
  canonicalId: "ci_dX5",
  reprints: ["set10-040"],
  cardType: "character",
  name: "Demona",
  version: "Betrayer of the Clan",
  inkType: ["amethyst"],
  franchise: "Gargoyles",
  set: "010",
  cardNumber: 40,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_35f7836ceed84e21ba7cfdde813d73bc",
    tcgPlayer: 658503,
  },
  text: [
    {
      title: "Challenger +2",
    },
    {
      title: "STONE BY DAY",
      description: "If you have 3 or more cards in your hand, this character can't ready.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Gargoyle", "Sorcerer"],
  abilities: [challenger(2), stoneByDay],
  i18n: demonaBetrayerOfTheClanI18n,
};
