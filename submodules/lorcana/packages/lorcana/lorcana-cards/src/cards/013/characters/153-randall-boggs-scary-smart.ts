import type { CharacterCard } from "@tcg/lorcana-types";
import { randallBoggsScarySmartI18n } from "./153-randall-boggs-scary-smart.i18n";

export const randallBoggsScarySmart: CharacterCard = {
  id: "ioe",
  canonicalId: "ci_ioe",
  slug: "lorcana-ci_ioe",
  printings: [
    {
      id: "set13-153",
      artId: "set13-153",
      setCode: "set13",
      collectorNumber: "153",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-153"],
  cardType: "character",
  name: "Randall Boggs",
  version: "Scary Smart",
  inkType: ["sapphire"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 153,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f5a95305c84042fab5a5ccb06da4f464",
  },
  text: [
    {
      title: "GET OUTTA HERE!",
      description:
        "When you play this character, put chosen character of yours into your inkwell facedown and exerted.",
    },
    {
      title: "DEVIOUS PLAN",
      description:
        "At the end of your turn, if all cards in your inkwell are exerted, gain 1 lore.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Monster"],
  abilities: [
    {
      id: "ioe-1",
      name: "GET OUTTA HERE!",
      type: "triggered",
      text: "GET OUTTA HERE! When you play this character, put chosen character of yours into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "put-into-inkwell",
        source: "chosen-card-in-play",
        exerted: true,
        facedown: true,
        target: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
    {
      id: "ioe-2",
      name: "DEVIOUS PLAN",
      type: "triggered",
      text: "DEVIOUS PLAN At the end of your turn, if all cards in your inkwell are exerted, gain 1 lore.",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "resource-count",
        what: "ready-cards-in-inkwell",
        controller: "you",
        comparison: "equal",
        value: 0,
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: randallBoggsScarySmartI18n,
};
