import type { ActionCard } from "@tcg/lorcana-types";

export const nothingWeWontDo: ActionCard = {
  id: "1kl",
  cardType: "action",
  name: "Nothing We Won't Do",
  inkType: ["ruby"],
  franchise: "Brother Bear",
  set: "008",
  text: "Sing Together 8 Ready all your characters. For the rest of this turn, they take no damage from challenges and can't quest.",
  actionSubtype: "song",
  cost: 8,
  cardNumber: 147,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cc60de718fd85aa22601a84ebf20bf07de590a8e",
  },
  abilities: [
    {
      id: "1kl-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: "YOUR_CHARACTERS",
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "SELF",
            duration: "this-turn",
          },
        ],
      },
      text: "Sing Together 8 Ready all your characters. For the rest of this turn, they take no damage from challenges and can't quest.",
    },
  ],
};
