import type { ItemCard } from "@tcg/lorcana-types";
import { recordPlayerI18n } from "./032-record-player.i18n";

export const recordPlayer: ItemCard = {
  id: "2w7",
  canonicalId: "ci_2w7",
  reprints: ["set4-032"],
  cardType: "item",
  name: "Record Player",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "004",
  cardNumber: 32,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_15a22d22153042c6ae825f60587268f1",
    tcgPlayer: 546696,
  },
  text: [
    {
      title: "LOOK AT THIS!",
      description:
        "Whenever you play a song, chosen character gets -2 {S} until the start of your next turn.",
    },
    {
      title: "HIT PARADE",
      description: "Your characters named Stitch count as having +1 cost to sing songs.",
    },
  ],
  abilities: [
    {
      id: "2w7-1",
      name: "LOOK AT THIS!",
      text: "LOOK AT THIS! Whenever you play a song, chosen character gets -2 {S} until the start of your next turn.",
      type: "triggered",
      trigger: {
        event: "play",
        on: {
          cardType: "song",
          controller: "you",
        },
        timing: "whenever",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "CHOSEN_CHARACTER",
        duration: "until-start-of-next-turn",
      },
    },
    {
      id: "2w7-2",
      name: "HIT PARADE",
      text: "HIT PARADE Your characters named Stitch count as having +1 cost to sing songs.",
      type: "static",
      effect: {
        type: "property-modification",
        property: "singer-threshold",
        operation: "add",
        value: "1",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-name",
              name: "Stitch",
            },
          ],
        },
      },
    },
  ],
  i18n: recordPlayerI18n,
};
