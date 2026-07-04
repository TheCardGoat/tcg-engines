import type { CharacterCard } from "@tcg/lorcana-types";
import { scroogeMcduckUncleMoneybagsP1PromoI18n } from "./p1-039-scrooge-mcduck-uncle-moneybags-promo.i18n";

export const scroogeMcduckUncleMoneybagsP1Promo: CharacterCard = {
  id: "Xsr",
  canonicalId: "ci_5aa",
  slug: "lorcana-ci_5aa",
  printings: [
    {
      id: "set3-p1-039-promo",
      artId: "ci_5aa-promo",
      setCode: "set3",
      collectorNumber: "39",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set3-155"],
  cardType: "character",
  name: "Scrooge McDuck",
  version: "Uncle Moneybags",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "003",
  cardNumber: 39,
  rarity: "special",
  specialRarity: "promo",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e25b0a04fd4a44c18a2d52940e33ff64",
    tcgPlayer: "538374",
  },
  text: [
    {
      title: "TREASURE FINDER",
      description:
        "Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      effect: {
        amount: 1,
        cardType: "item",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      id: "ekh-1",
      name: "TREASURE FINDER",
      text: "TREASURE FINDER Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: scroogeMcduckUncleMoneybagsP1PromoI18n,
};
