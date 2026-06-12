import type { CharacterCard } from "@tcg/lorcana-types";
import { peteSteamboatRivalI18n } from "./116-pete-steamboat-rival.i18n";

export const peteSteamboatRival: CharacterCard = {
  id: "c2L",
  canonicalId: "ci_c2L",
  reprints: ["set5-116"],
  cardType: "character",
  name: "Pete",
  version: "Steamboat Rival",
  inkType: ["ruby"],
  set: "005",
  cardNumber: 116,
  rarity: "common",
  cost: 7,
  strength: 6,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_3c2769ada879468487b74479a921bc27",
    tcgPlayer: 561963,
  },
  text: [
    {
      title: "SCRAM!",
      description:
        "When you play this character, if you have another character named Pete in play, you may banish chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      condition: {
        type: "has-another-character",
        name: "Pete",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "nvb-1",
      name: "SCRAM!",
      text: "SCRAM! When you play this character, if you have another character named Pete in play, you may banish chosen opposing character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: peteSteamboatRivalI18n,
};
