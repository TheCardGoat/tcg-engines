import type { ItemCard } from "@tcg/lorcana-types";
import { spyglassHatI18n } from "./168-spyglass-hat.i18n";

export const spyglassHat: ItemCard = {
  id: "PsC",
  canonicalId: "ci_PsC",
  slug: "lorcana-ci_PsC",
  printings: [
    {
      id: "set14-168",
      artId: "set14-168",
      setCode: "set14",
      collectorNumber: "168",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-168"],
  cardType: "item",
  name: "Spyglass Hat",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "014",
  cardNumber: 168,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_9177aee61f9c4737912612c5253a6aab",
  },
  text: [
    {
      title: "HAT COUTURE",
      description:
        "Whenever you play this or another item, if the item you played has a different name than each other item you have in play, you may put a card from your hand into your inkwell facedown and exerted.",
    },
  ],
  abilities: [
    {
      id: "spyglass-hat-self",
      name: "HAT COUTURE",
      type: "triggered",
      text: "HAT COUTURE Whenever you play this or another item, if the item you played has a different name than each other item you have in play, you may put a card from your hand into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "whenever",
      },
      condition: {
        type: "played-card-name",
        zone: "play",
        cardTypes: ["item"],
        excludeSelf: true,
        requireAbsent: true,
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "hand",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
          chosenBy: "you",
        },
      },
    },
    {
      id: "spyglass-hat-1",
      name: "HAT COUTURE",
      type: "triggered",
      text: "HAT COUTURE Whenever you play this or another item, if the item you played has a different name than each other item you have in play, you may put a card from your hand into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: {
          cardType: "item",
          controller: "you",
        },
        timing: "whenever",
      },
      condition: {
        type: "played-card-name",
        zone: "play",
        cardTypes: ["item"],
        excludeSelf: true,
        requireAbsent: true,
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "hand",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
          chosenBy: "you",
        },
      },
    },
  ],
  i18n: spyglassHatI18n,
};
