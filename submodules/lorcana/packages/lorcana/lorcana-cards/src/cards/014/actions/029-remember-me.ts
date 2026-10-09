import type { ActionCard } from "@tcg/lorcana-types";
import { singTogether } from "../../../helpers/abilities";
import { rememberMeI18n } from "./029-remember-me.i18n";

export const rememberMe: ActionCard = {
  id: "v5B",
  canonicalId: "ci_v5B",
  slug: "lorcana-ci_v5B",
  printings: [
    {
      id: "set14-029",
      artId: "set14-029",
      setCode: "set14",
      collectorNumber: "29",
      rarity: "super_rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-029"],
  cardType: "action",
  name: "Remember Me",
  inkType: ["amber"],
  franchise: "Coco",
  set: "014",
  cardNumber: 29,
  rarity: "super_rare",
  cost: 6,
  inkable: true,
  externalIds: {
    lorcast: "crd_fdadb83a1b0b49f8b0931d6837fb27b7",
  },
  text: [
    {
      title: "Sing Together 6",
      description:
        "(Any number of your or your teammates' characters with total cost 6 or more may {E} to sing this song for free.)",
    },
    {
      title:
        "For the rest of this turn, you may play characters from your discard. If you do, they enter play exerted and you can't play characters with the same name as characters you played this way this turn.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    singTogether(6),
    {
      type: "action",
      text: "For the rest of this turn, you may play characters from your discard. If you do, they enter play exerted and you can't play characters with the same name as characters you played this way this turn.",
      effect: {
        type: "enable-play-from-discard",
        cardType: "character",
        duration: "this-turn",
        entersExerted: true,
        scope: "all-cards",
        uniqueByName: true,
      },
    },
  ],
  i18n: rememberMeI18n,
};
