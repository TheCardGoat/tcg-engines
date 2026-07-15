import type { CharacterCard } from "@tcg/lorcana-types";

export const basilSecretInformer: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      id: "lk0-1",
      name: "DRAW THEM OUT",
      text: "DRAW THEM OUT Whenever this character quests, opposing damaged characters gain Reckless during their next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 93,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Detective"],
  cost: 6,
  externalIds: {
    ravensburger: "4db0a324dcb5d1ff69156dfa4c107253863062c3",
  },
  franchise: "Great Mouse Detective",
  fullName: "Basil - Secret Informer",
  id: "lk0",
  inkType: ["emerald"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Basil",
  set: "007",
  strength: 3,
  text: "DRAW THEM OUT Whenever this character quests, opposing damaged characters gain Reckless during their next turn. (They can't quest and must challenge if able.)",
  version: "Secret Informer",
  willpower: 6,
};
