import type { CharacterCard } from "@tcg/lorcana-types";
import { brunoMadrigalOasisOracleEpicI18n } from "./218-bruno-madrigal-oasis-oracle-epic.i18n";
import { brunoMadrigalOasisOracle } from "./154-bruno-madrigal-oasis-oracle";

export const brunoMadrigalOasisOracleEpic: CharacterCard = {
  ...brunoMadrigalOasisOracle,
  id: "0w8",
  cardNumber: 218,
  rarity: "common",
  specialRarity: "epic",
  i18n: brunoMadrigalOasisOracleEpicI18n,
};
