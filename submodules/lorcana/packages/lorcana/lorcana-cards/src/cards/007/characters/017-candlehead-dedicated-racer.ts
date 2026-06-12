import type { CharacterCard } from "@tcg/lorcana-types";
import { candleheadDedicatedRacerI18n } from "./017-candlehead-dedicated-racer.i18n";

export const candleheadDedicatedRacer: CharacterCard = {
  id: "isc",
  canonicalId: "ci_isc",
  reprints: ["set7-017"],
  cardType: "character",
  name: "Candlehead",
  version: "Dedicated Racer",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "007",
  cardNumber: 17,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_71551dd2d3334d509ce2f72fb84bd5fe",
    tcgPlayer: 618717,
  },
  text: [
    {
      title: "WINNING ISN'T EVERYTHING",
      description:
        "When this character is banished, you may remove up to 2 damage from chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Racer"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: { type: "up-to", value: 2 },
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "remove-damage",
        },
        type: "optional",
      },
      id: "w07-1",
      name: "WINNING ISN'T EVERYTHING",
      text: "WINNING ISN'T EVERYTHING When this character is banished, you may remove up to 2 damage from chosen character.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: candleheadDedicatedRacerI18n,
};
