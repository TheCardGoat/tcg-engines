import type { CharacterCard } from "@tcg/lorcana-types";
import { annaTrustingSisterI18n } from "./157-anna-trusting-sister.i18n";

export const annaTrustingSister: CharacterCard = {
  id: "wSF",
  canonicalId: "ci_wSF",
  reprints: ["set8-157"],
  cardType: "character",
  name: "Anna",
  version: "Trusting Sister",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "008",
  cardNumber: 157,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_37bea5da923b495eaeecaf71420a2beb",
    tcgPlayer: 631455,
  },
  text: [
    {
      title: "WE CAN DO THIS TOGETHER",
      description:
        "When you play this character, if you have a character named Elsa in play, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Queen"],
  abilities: [
    {
      condition: {
        type: "has-named-character",
        name: "Elsa",
        controller: "you",
      },
      effect: {
        exerted: true,
        facedown: true,
        source: "top-of-deck",
        target: "CONTROLLER",
        type: "put-into-inkwell",
      },
      id: "8vk-1",
      name: "WE CAN DO THIS TOGETHER",
      text: "WE CAN DO THIS TOGETHER When you play this character, if you have a character named Elsa in play, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: annaTrustingSisterI18n,
};
