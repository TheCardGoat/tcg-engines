import type { CharacterCard } from "@tcg/lorcana-types";

export const basilSecretInformer: CharacterCard = {
  id: "lk0",
  cardType: "character",
  name: "Basil",
  version: "Secret Informer",
  fullName: "Basil - Secret Informer",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "007",
  text: "DRAW THEM OUT Whenever this character quests, opposing damaged characters gain Reckless during their next turn. (They can't quest and must challenge if able.)",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 3,
  cardNumber: 93,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4db0a324dcb5d1ff69156dfa4c107253863062c3",
  },
  abilities: [
    {
      id: "lk0-1",
      type: "triggered",
      name: "DRAW THEM OUT",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
      },
      text: "DRAW THEM OUT Whenever this character quests, opposing damaged characters gain Reckless during their next turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
};
