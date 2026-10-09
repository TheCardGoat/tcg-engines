import type { CharacterCard } from "@tcg/lorcana-types";
import { fruFruVipGuestI18n } from "./001-fru-fru-vip-guest.i18n";

export const fruFruVipGuest: CharacterCard = {
  id: "CJC",
  canonicalId: "ci_CJC",
  slug: "lorcana-ci_CJC",
  printings: [
    {
      id: "set14-001",
      artId: "set14-001",
      setCode: "set14",
      collectorNumber: "1",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-001"],
  cardType: "character",
  name: "Fru Fru",
  version: "VIP Guest",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "014",
  cardNumber: 1,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_0ad02170c068455bbd5e5ab3f8d47fc3",
  },
  classifications: ["Storyborn", "Ally"],
  i18n: fruFruVipGuestI18n,
};
