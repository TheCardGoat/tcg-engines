import type { CharacterCard } from "@tcg/lorcana-types";
import { meridaWispConjurerI18n } from "./050-merida-wisp-conjurer.i18n";

export const meridaWispConjurer: CharacterCard = {
  id: "EAT",
  canonicalId: "ci_EAT",
  slug: "lorcana-ci_EAT",
  printings: [
    {
      id: "set13-050",
      artId: "set13-050",
      setCode: "set13",
      collectorNumber: "50",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set13-050"],
  cardType: "character",
  name: "Merida",
  version: "Wisp Conjurer",
  inkType: ["amethyst"],
  franchise: "Brave",
  set: "013",
  cardNumber: 50,
  rarity: "legendary",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_418bbf00ceac49df9dd203b62d63803f",
  },
  text: [
    {
      title: "FOCUSED ENERGY",
      description: "This character may enter play exerted to draw a card.",
    },
    {
      title: "BECKON",
      description:
        "During your turn, whenever another character of yours enters play exerted, you may draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess", "Sorcerer"],
  abilities: [
    {
      id: "EAT-1",
      name: "FOCUSED ENERGY",
      type: "static",
      text: "FOCUSED ENERGY This character may enter play exerted to draw a card.",
      effect: {
        type: "restriction",
        restriction: "may-enter-play-exerted",
        target: "SELF",
      },
    },
    {
      id: "EAT-2",
      name: "FOCUSED ENERGY",
      type: "triggered",
      text: "FOCUSED ENERGY This character may enter play exerted to draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "is-exerted",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
    {
      id: "EAT-3",
      name: "BECKON",
      type: "triggered",
      text: "BECKON During your turn, whenever another character of yours enters play exerted, you may draw a card.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "character",
          excludeSelf: true,
        },
        timing: "whenever",
      },
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          reference: "trigger-subject",
          filters: [
            {
              type: "exerted",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    },
  ],
  i18n: meridaWispConjurerI18n,
};
