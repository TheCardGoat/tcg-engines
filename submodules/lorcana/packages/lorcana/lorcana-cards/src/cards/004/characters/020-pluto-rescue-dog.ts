import type { CharacterCard } from "@tcg/lorcana-types";
import { plutoRescueDogI18n } from "./020-pluto-rescue-dog.i18n";

export const plutoRescueDog: CharacterCard = {
  id: "vP8",
  canonicalId: "ci_hkQ",
  reprints: ["set4-020", "set9-016"],
  cardType: "character",
  name: "Pluto",
  version: "Rescue Dog",
  inkType: ["amber"],
  set: "004",
  cardNumber: 20,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_e16de0af3ca24eaa9e6570598920d9e8",
    tcgPlayer: 649964,
  },
  text: [
    {
      title: "TO THE RESCUE",
      description:
        "When you play this character, you may remove up to 3 damage from one of your characters.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: { type: "up-to", value: 3 },
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
      id: "141-1",
      name: "TO THE RESCUE",
      text: "TO THE RESCUE When you play this character, you may remove up to 3 damage from chosen character of yours.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: plutoRescueDogI18n,
};
