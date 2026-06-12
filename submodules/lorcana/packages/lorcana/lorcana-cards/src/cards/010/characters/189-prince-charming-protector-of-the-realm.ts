import type { CharacterCard } from "@tcg/lorcana-types";
import { princeCharmingProtectorOfTheRealmI18n } from "./189-prince-charming-protector-of-the-realm.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const princeCharmingProtectorOfTheRealm: CharacterCard = {
  id: "rzC",
  canonicalId: "ci_rzC",
  reprints: ["set10-189"],
  cardType: "character",
  name: "Prince Charming",
  version: "Protector of the Realm",
  inkType: ["steel"],
  franchise: "Cinderella",
  set: "010",
  cardNumber: 189,
  rarity: "legendary",
  cost: 7,
  strength: 3,
  willpower: 10,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_fafe3c3da4484cf6b0485a5f5a1c557a",
    tcgPlayer: 658343,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "PROTECTIVE PRESENCE",
      description: "Each turn, only one character can challenge.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince"],
  abilities: [
    bodyguard,
    {
      id: "rzC-2",
      name: "PROTECTIVE PRESENCE",
      text: "PROTECTIVE PRESENCE Each turn, only one character can challenge.",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "challenge-limit",
        limit: 1,
        target: "ALL_PLAYERS",
      },
    },
  ],
  i18n: princeCharmingProtectorOfTheRealmI18n,
};
