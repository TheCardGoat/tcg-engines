import type { CharacterCard } from "@tcg/lorcana-types";
import { launchpadExceptionalPilotI18n } from "./083-launchpad-exceptional-pilot.i18n";

export const launchpadExceptionalPilot: CharacterCard = {
  id: "zE0",
  canonicalId: "ci_zE0",
  reprints: ["set10-083"],
  cardType: "character",
  name: "Launchpad",
  version: "Exceptional Pilot",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 83,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5380e792419f4668ad25176094c6e667",
    tcgPlayer: 658464,
  },
  text: [
    {
      title: "OFF THE MAP",
      description: "When you play this character, you may banish chosen location.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["location"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "m1r-1",
      name: "OFF THE MAP",
      text: "OFF THE MAP When you play this character, you may banish chosen location.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: launchpadExceptionalPilotI18n,
};
