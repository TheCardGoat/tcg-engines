import type { CharacterCard } from "@tcg/lorcana-types";
import { moanaUndeterredVoyager as canonicalMoanaUndeterredVoyager } from "../../003";

export const moanaUndeterredVoyager: CharacterCard = {
  ...canonicalMoanaUndeterredVoyager,
  id: "6ld",
  reprints: ["set3-117", "set9-116"],
  set: "009",
  cardNumber: 116,
  rarity: "common",
  externalIds: {
    lorcast: "crd_0f11f39f42d84f9cb09ca24a2893f39d",
    tcgPlayer: 650052,
  },
};
