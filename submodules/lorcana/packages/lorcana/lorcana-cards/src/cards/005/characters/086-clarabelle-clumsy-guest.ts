import type { CharacterCard } from "@tcg/lorcana-types";
import { clarabelleClumsyGuestI18n } from "./086-clarabelle-clumsy-guest.i18n";

export const clarabelleClumsyGuest: CharacterCard = {
  id: "EZO",
  canonicalId: "ci_EZO",
  reprints: ["set5-086"],
  cardType: "character",
  name: "Clarabelle",
  version: "Clumsy Guest",
  inkType: ["emerald"],
  set: "005",
  cardNumber: 86,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ecb9566eb3fb4a9f9765dac205bf1b2d",
    tcgPlayer: 561960,
  },
  text: [
    {
      title: "BUTTERFINGERS",
      description: "When you play this character, you may pay 2 {I} to banish chosen item.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 2,
          },
          effect: {
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["item"],
            },
            type: "banish",
          },
        },
        type: "optional",
      },
      id: "EZO-1",
      name: "BUTTERFINGERS",
      text: "BUTTERFINGERS When you play this character, you may pay 2 {I} to banish chosen item.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: clarabelleClumsyGuestI18n,
};
