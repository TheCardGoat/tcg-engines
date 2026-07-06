import type { ActionCard } from "@tcg/lorcana-types";
import { itsGonnaBeGreatI18n } from "./138-its-gonna-be-great.i18n";

export const itsGonnaBeGreat: ActionCard = {
  id: "5UQ",
  canonicalId: "ci_5UQ",
  slug: "lorcana-ci_5UQ",
  printings: [
    {
      id: "set13-138",
      artId: "set13-138",
      setCode: "set13",
      collectorNumber: "138",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-138"],
  cardType: "action",
  name: "It's Gonna Be Great!",
  inkType: ["ruby"],
  franchise: "Winnie the Pooh",
  set: "013",
  cardNumber: 138,
  rarity: "common",
  cost: 2,
  inkable: true,
  text: "Ready chosen character. They can't quest for the rest of this turn.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            duration: "this-turn",
            target: {
              ref: "previous-target",
            },
          },
        ],
      },
    },
  ],
  i18n: itsGonnaBeGreatI18n,
};
