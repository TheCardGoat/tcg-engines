import type { ActionCard } from "@tcg/lorcana-types";
import { theMobSongI18n } from "./198-the-mob-song.i18n";

export const theMobSong: ActionCard = {
  id: "FC7",
  canonicalId: "ci_f4c",
  reprints: ["set4-198", "set9-202"],
  cardType: "action",
  name: "The Mob Song",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "004",
  cardNumber: 198,
  rarity: "uncommon",
  cost: 10,
  inkable: false,
  externalIds: {
    lorcast: "crd_3145e83418b2482291dc9687d76a4057",
    tcgPlayer: 650134,
  },
  text: [
    {
      title: "Sing Together 10",
      description:
        "(Any number of your or your teammates' characters with total cost 10 or more may {E} to sing this song for free.)",
    },
    {
      title: "Deal 3 damage to up to 3 chosen characters and/or locations.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 3,
        target: {
          selector: "chosen",
          count: {
            upTo: 3,
          },
          owner: "any",
          zones: ["play"],
          cardTypes: ["character", "location"],
        },
      },
    },
  ],
  i18n: theMobSongI18n,
};
