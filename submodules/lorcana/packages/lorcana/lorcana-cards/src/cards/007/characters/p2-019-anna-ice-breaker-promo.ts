import type { CharacterCard } from "@tcg/lorcana-types";
import { annaIceBreakerP2PromoI18n } from "./p2-019-anna-ice-breaker-promo.i18n";

import { support } from "../../../helpers/abilities/support";

export const annaIceBreakerP2Promo: CharacterCard = {
  id: "3D5",
  canonicalId: "ci_U6J",
  slug: "lorcana-ci_U6J",
  printings: [
    {
      id: "set7-p2-019-promo",
      artId: "ci_U6J-promo",
      setCode: "set7",
      collectorNumber: "19",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set7-072"],
  cardType: "character",
  name: "Anna",
  version: "Ice Breaker",
  inkType: ["amethyst", "sapphire"],
  franchise: "Frozen",
  set: "007",
  cardNumber: 19,
  rarity: "special",
  specialRarity: "promo",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b46a014c04334b358578cee5fbd9444f",
    tcgPlayer: "619444",
  },
  text: [
    {
      title: "Support",
    },
    {
      title: "WINTER AMBUSH",
      description:
        "When you play this character, chosen opposing character can't ready at the start of their next turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Queen", "Sorcerer"],
  abilities: [
    support,
    {
      effect: {
        duration: "until-start-of-next-turn",
        restriction: "cant-ready",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "restriction",
      },
      id: "pj2-2",
      name: "WINTER AMBUSH",
      text: "WINTER AMBUSH When you play this character, chosen opposing character can't ready at the start of their next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: annaIceBreakerP2PromoI18n,
};
