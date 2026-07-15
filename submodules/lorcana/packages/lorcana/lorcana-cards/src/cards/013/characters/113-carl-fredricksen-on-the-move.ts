import type { CharacterCard } from "@tcg/lorcana-types";
import { carlFredricksenOnTheMoveI18n } from "./113-carl-fredricksen-on-the-move.i18n";

export const carlFredricksenOnTheMove: CharacterCard = {
  id: "Vst",
  canonicalId: "ci_Vst",
  slug: "lorcana-ci_Vst",
  printings: [
    {
      id: "set13-113",
      artId: "set13-113",
      setCode: "set13",
      collectorNumber: "113",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-113"],
  cardType: "character",
  name: "Carl Fredricksen",
  version: "On the Move",
  inkType: ["ruby"],
  franchise: "Up",
  set: "013",
  cardNumber: 113,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a395fdf1aee940cab396c90eacfba65d",
  },
  text: [
    {
      title: "MOVING PARTNER",
      description:
        "Whenever you play a location, you may move this character and up to 1 of your other characters to that location for free.",
    },
    {
      title: "ADVENTURE AWAITS",
      description:
        "Whenever this character quests while at a location, draw cards equal to that location's {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      type: "triggered",
      name: "MOVING PARTNER",
      text: "MOVING PARTNER Whenever you play a location, you may move this character and up to 1 of your other characters to that location for free.",
      trigger: {
        event: "play",
        on: {
          cardType: "location",
          controller: "you",
        },
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "move-to-location",
          includeSelf: true,
          character: {
            selector: "chosen",
            count: {
              upTo: 1,
            },
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
            excludeSelf: true,
          },
          location: {
            ref: "trigger-subject",
          },
          cost: "free",
        },
      },
    },
    {
      type: "triggered",
      name: "ADVENTURE AWAITS",
      text: "ADVENTURE AWAITS Whenever this character quests while at a location, draw cards equal to that location's lore.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      condition: {
        type: "at-location",
      },
      effect: {
        type: "draw",
        amount: {
          type: "source-attribute",
          attribute: "location-lore",
        },
        target: "CONTROLLER",
      },
    },
  ],
  i18n: carlFredricksenOnTheMoveI18n,
};
