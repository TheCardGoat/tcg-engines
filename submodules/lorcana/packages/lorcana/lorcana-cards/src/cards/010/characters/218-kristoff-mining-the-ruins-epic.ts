import type { CharacterCard } from "@tcg/lorcana-types";
import { kristoffMiningTheRuins } from "./159-kristoff-mining-the-ruins";

export const kristoffMiningTheRuinsEpic: CharacterCard = {
  ...kristoffMiningTheRuins,
  id: "lsw",
  reprints: ["set10-159"],
  set: "010",
  cardNumber: 218,
  rarity: "common",
  specialRarity: "epic",
  externalIds: {
    lorcast: "crd_c74126bc80ba4d52bc7c499ba67dce25",
    tcgPlayer: 660270,
  },
};
