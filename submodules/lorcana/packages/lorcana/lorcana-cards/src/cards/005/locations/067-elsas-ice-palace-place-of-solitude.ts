import type { LocationCard } from "@tcg/lorcana-types";
import { elsasIcePalacePlaceOfSolitudeI18n } from "./067-elsas-ice-palace-place-of-solitude.i18n";

export const elsasIcePalacePlaceOfSolitude: LocationCard = {
  id: "kvC",
  canonicalId: "ci_kvC",
  reprints: ["set5-067"],
  cardType: "location",
  name: "Elsa's Ice Palace",
  version: "Place of Solitude",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  cardNumber: 67,
  rarity: "rare",
  cost: 3,
  willpower: 4,
  moveCost: 1,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_aaae8eab8f604635883282a61d3376ff",
    tcgPlayer: 560547,
  },
  text: [
    {
      title: "ETERNAL WINTER",
      description:
        "When you play this location, choose an exerted character. While this location is in play, that character can't ready at the start of their turn.",
    },
  ],
  abilities: [
    {
      effect: {
        restriction: "cant-ready",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "exerted",
            },
          ],
        },
        duration: "permanent",
        linkedToSource: true,
        type: "restriction",
      },
      id: "1h5-1",
      name: "ETERNAL WINTER",
      text: "ETERNAL WINTER When you play this location, choose an exerted character. While this location is in play, that character can't ready at the start of their turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: elsasIcePalacePlaceOfSolitudeI18n,
};
