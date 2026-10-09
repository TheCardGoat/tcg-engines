import type { CharacterCard } from "@tcg/lorcana-types";
import { koslovImposingEnforcerI18n } from "./189-koslov-imposing-enforcer.i18n";

export const koslovImposingEnforcer: CharacterCard = {
  id: "pP7",
  canonicalId: "ci_pP7",
  slug: "lorcana-ci_pP7",
  printings: [
    {
      id: "set14-189",
      artId: "set14-189",
      setCode: "set14",
      collectorNumber: "189",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-189"],
  cardType: "character",
  name: "Koslov",
  version: "Imposing Enforcer",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "014",
  cardNumber: 189,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_d8b66cb988364f29b55e699242ebc517",
  },
  classifications: ["Storyborn", "Ally"],
  i18n: koslovImposingEnforcerI18n,
};
