import type { CharacterCard } from "@tcg/lorcana-types";
import { liShangValiantLeaderI18n } from "./183-li-shang-valiant-leader.i18n";

export const liShangValiantLeader: CharacterCard = {
  id: "qoa",
  canonicalId: "ci_qoa",
  reprints: ["set11-183"],
  cardType: "character",
  name: "Li Shang",
  version: "Valiant Leader",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "011",
  cardNumber: 183,
  rarity: "uncommon",
  cost: 7,
  strength: 9,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_cf304010edfd42ddb7e2a2ee5702f7ab",
    tcgPlayer: 676240,
  },
  text: "Shift 4 {I}",
  classifications: ["Floodborn", "Hero", "Captain"],
  abilities: [
    {
      id: "25z-1",
      cost: {
        ink: 4,
      },
      keyword: "Shift",
      type: "keyword",
      text: "Shift 4 {I}",
    },
  ],
  i18n: liShangValiantLeaderI18n,
};
