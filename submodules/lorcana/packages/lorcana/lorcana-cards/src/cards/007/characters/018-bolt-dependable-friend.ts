import type { CharacterCard } from "@tcg/lorcana-types";
import { boltDependableFriendI18n } from "./018-bolt-dependable-friend.i18n";
import { support } from "../../../helpers/abilities/support";

export const boltDependableFriend: CharacterCard = {
  id: "XZV",
  canonicalId: "ci_XZV",
  reprints: ["set7-018"],
  cardType: "character",
  name: "Bolt",
  version: "Dependable Friend",
  inkType: ["amber"],
  franchise: "Bolt",
  set: "007",
  cardNumber: 18,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_9b70e9c76a6643c69167b3f081530ae9",
    tcgPlayer: 618157,
  },
  text: "Support",
  classifications: ["Storyborn", "Hero"],
  abilities: [support],
  i18n: boltDependableFriendI18n,
};
