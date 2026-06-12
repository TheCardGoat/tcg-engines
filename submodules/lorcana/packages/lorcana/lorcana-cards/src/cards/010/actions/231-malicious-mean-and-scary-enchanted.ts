import type { ActionCard } from "@tcg/lorcana-types";
import { maliciousMeanAndScary } from "./097-malicious-mean-and-scary";

export const maliciousMeanAndScaryEnchanted: ActionCard = {
  ...maliciousMeanAndScary,
  id: "nis",
  reprints: ["set10-097"],
  set: "010",
  cardNumber: 231,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_5547bd08bb6344d4bcd03d37e415c75f",
    tcgPlayer: 660027,
  },
};
