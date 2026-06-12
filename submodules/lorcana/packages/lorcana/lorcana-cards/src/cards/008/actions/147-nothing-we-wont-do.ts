import type { ActionCard } from "@tcg/lorcana-types";
import { nothingWeWontDoI18n } from "./147-nothing-we-wont-do.i18n";

export const nothingWeWontDo: ActionCard = {
  id: "vhy",
  canonicalId: "ci_vhy",
  reprints: ["set8-147"],
  cardType: "action",
  name: "Nothing We Won't Do",
  inkType: ["ruby"],
  franchise: "Brother Bear",
  set: "008",
  cardNumber: 147,
  rarity: "rare",
  cost: 8,
  inkable: true,
  externalIds: {
    lorcast: "crd_d3991d318fce49248c57af5fea2ee5a7",
    tcgPlayer: 631447,
  },
  text: [
    {
      title: "Sing Together 8",
      description:
        "(Any number of your or your teammates' characters with total cost 8 or more may {E} to sing this song for free.)",
    },
    {
      title:
        "Ready all your characters. For the rest of this turn, they take no damage from challenges and can't quest.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        steps: [
          {
            target: "YOUR_CHARACTERS",
            type: "ready",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: "YOUR_CHARACTERS",
            type: "restriction",
          },
          {
            type: "grant-ability",
            ability: "takes-no-damage-from-challenges",
            duration: "this-turn",
            target: "YOUR_CHARACTERS",
          },
        ],
        type: "sequence",
      },
      id: "1kl-1",
      text: "Sing Together 8 Ready all your characters. For the rest of this turn, they take no damage from challenges and can't quest.",
      type: "action",
    },
  ],
  i18n: nothingWeWontDoI18n,
};
