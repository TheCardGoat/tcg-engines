import type { ActionCard } from "@tcg/lorcana-types";

export const nothingWeWontDo: ActionCard = {
  abilities: [
    {
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
      id: "1kl-1",
      text: "Sing Together 8 Ready all your characters. For the rest of this turn, they take no damage from challenges and can't quest.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 147,
  cardType: "action",
  cost: 8,
  externalIds: {
    ravensburger: "cc60de718fd85aa22601a84ebf20bf07de590a8e",
  },
  franchise: "Brother Bear",
  id: "1kl",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Nothing We Won't Do",
  set: "008",
  text: "Sing Together 8 Ready all your characters. For the rest of this turn, they take no damage from challenges and can't quest.",
};
