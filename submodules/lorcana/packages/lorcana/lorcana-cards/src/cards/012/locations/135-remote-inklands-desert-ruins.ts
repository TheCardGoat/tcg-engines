import type { LocationCard } from "@tcg/lorcana-types";
import { remoteInklandsDesertRuinsI18n } from "./135-remote-inklands-desert-ruins.i18n";

export const remoteInklandsDesertRuins: LocationCard = {
  id: "JRM",
  canonicalId: "ci_JRM",
  reprints: ["set12-135"],
  cardType: "location",
  name: "Remote Inklands",
  version: "Desert Ruins",
  inkType: ["ruby"],
  set: "012",
  cardNumber: 135,
  rarity: "rare",
  cost: 2,
  willpower: 6,
  moveCost: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_89c1af2f0ec443728e91c461511190f1",
  },
  text: [
    {
      title: "ERODING WINGS",
      description: "At the start of your turn, put the top card of your deck into your discard.",
    },
    {
      title: "SUCCESSFUL EXPEDITION",
      description: "Characters get +2 {S} while here.",
    },
  ],
  abilities: [
    {
      id: "y22-1",
      name: "ERODING WINDS",
      text: "ERODING WINDS At the start of your turn, put the top card of your deck into your discard.",
      type: "triggered",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        type: "mill",
        amount: 1,
        target: "CONTROLLER",
      },
    },
    {
      id: "y22-2",
      name: "SUCCESSFUL EXPEDITION",
      text: "SUCCESSFUL EXPEDITION Characters get +2 {S} while here.",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "CHARACTERS_HERE",
      },
    },
  ],
  i18n: remoteInklandsDesertRuinsI18n,
};
