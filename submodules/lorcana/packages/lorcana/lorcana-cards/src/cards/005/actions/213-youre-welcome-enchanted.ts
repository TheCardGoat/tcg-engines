import type { ActionCard } from "@tcg/lorcana-types";
import { youreWelcome } from "./096-youre-welcome";

export const youreWelcomeEnchanted: ActionCard = {
  ...youreWelcome,
  id: "huo",
  reprints: ["set5-096"],
  set: "005",
  cardNumber: 213,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_f799b47b4b894912a8d83942d0fa4d22",
    tcgPlayer: 561983,
  },
};
