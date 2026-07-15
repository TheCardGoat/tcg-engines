import type { CharacterCard } from "@tcg/lorcana-types";
import { celiaMaeFriendlyReceptionistI18n } from "./006-celia-mae-friendly-receptionist.i18n";

export const celiaMaeFriendlyReceptionist: CharacterCard = {
  id: "mJ6",
  canonicalId: "ci_mJ6",
  slug: "lorcana-ci_mJ6",
  printings: [
    {
      id: "set13-006",
      artId: "set13-006",
      setCode: "set13",
      collectorNumber: "6",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-006"],
  cardType: "character",
  name: "Celia Mae",
  version: "Friendly Receptionist",
  inkType: ["amber"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 6,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_b8569f3f5fd643c4adacaa5ee82c5e9e",
  },
  text: [
    {
      title: "PLEASE HOLD",
      description:
        "When you play this character, you may pay 1 {I} to ready chosen character of yours. They can't quest or challenge for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Monster"],
  abilities: [
    {
      type: "triggered",
      id: "mJ6-1",
      name: "PLEASE HOLD",
      text: "PLEASE HOLD When you play this character, you may pay 1 {I} to ready chosen character of yours. They can't quest or challenge for the rest of this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 1,
          },
          effect: {
            type: "sequence",
            steps: [
              {
                type: "ready",
                target: {
                  selector: "chosen",
                  count: 1,
                  owner: "you",
                  zones: ["play"],
                  cardTypes: ["character"],
                },
              },
              {
                type: "restriction",
                restriction: "cant-quest-or-challenge",
                duration: "this-turn",
                target: {
                  ref: "previous-target",
                },
              },
            ],
          },
        },
      },
    },
  ],
  i18n: celiaMaeFriendlyReceptionistI18n,
};
