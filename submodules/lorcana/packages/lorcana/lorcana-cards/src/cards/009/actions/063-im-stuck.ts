import type { ActionCard } from "@tcg/lorcana-types";
import { imStuck as canonicalImStuck } from "../../002";

export const imStuck: ActionCard = {
  ...canonicalImStuck,
  id: "woM",
  reprints: ["set2-063", "set9-063"],
  set: "009",
  cardNumber: 63,
  rarity: "common",
  externalIds: {
    lorcast: "crd_8dedb2a4e41e48039aea2bca6938d28f",
    tcgPlayer: 650007,
  },
};
