import type { CharacterCard } from "@tcg/lorcana-types";
import { rush } from "../../../helpers/abilities/rush";
import { hermesHarriedMessengerI18n } from "./112-hermes-harried-messenger.i18n";

export const hermesHarriedMessenger: CharacterCard = {
  id: "RlF",
  canonicalId: "ci_RlF",
  reprints: ["set10-112"],
  cardType: "character",
  name: "Hermes",
  version: "Harried Messenger",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "010",
  cardNumber: 112,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_54dc293b739a4ed0afb598fa0484eaf6",
    tcgPlayer: 658878,
  },
  text: "Rush",
  classifications: ["Storyborn", "Deity"],
  abilities: [rush],
  i18n: hermesHarriedMessengerI18n,
};
