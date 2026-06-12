import type { CharacterCard } from "@tcg/lorcana-types";
import { tukTukCuriousPartnerI18n } from "./161-tuk-tuk-curious-partner.i18n";

export const tukTukCuriousPartner: CharacterCard = {
  id: "DHE",
  canonicalId: "ci_DHE",
  reprints: ["set4-161"],
  cardType: "character",
  name: "Tuk Tuk",
  version: "Curious Partner",
  inkType: ["sapphire"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  cardNumber: 161,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_835ae01a69684fe7af625817ecb51341",
    tcgPlayer: 550613,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: tukTukCuriousPartnerI18n,
};
