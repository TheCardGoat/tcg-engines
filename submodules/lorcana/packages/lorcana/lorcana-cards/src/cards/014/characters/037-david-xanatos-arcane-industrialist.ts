import type { CharacterCard } from "@tcg/lorcana-types";
import { davidXanatosArcaneIndustrialistI18n } from "./037-david-xanatos-arcane-industrialist.i18n";

export const davidXanatosArcaneIndustrialist: CharacterCard = {
  id: "ljM",
  canonicalId: "ci_ljM",
  slug: "lorcana-ci_ljM",
  printings: [
    {
      id: "set14-037",
      artId: "set14-037",
      setCode: "set14",
      collectorNumber: "37",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-037"],
  cardType: "character",
  name: "David Xanatos",
  version: "Arcane Industrialist",
  inkType: ["amethyst"],
  franchise: "Gargoyles",
  set: "014",
  cardNumber: 37,
  rarity: "common",
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_050a926ae1604a0dbbbb9d5b9621ec8e",
  },
  classifications: ["Dreamborn", "Villain"],
  i18n: davidXanatosArcaneIndustrialistI18n,
};
