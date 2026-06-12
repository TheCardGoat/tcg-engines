import type { CharacterCard } from "@tcg/lorcana-types";
import { davidXanatosSteelClanLeaderI18n } from "./184-david-xanatos-steel-clan-leader.i18n";

export const davidXanatosSteelClanLeader: CharacterCard = {
  id: "FZS",
  canonicalId: "ci_FZS",
  reprints: ["set10-184"],
  cardType: "character",
  name: "David Xanatos",
  version: "Steel Clan Leader",
  inkType: ["steel"],
  franchise: "Gargoyles",
  set: "010",
  cardNumber: 184,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_af2df57fb8c4408f9bf4e1358f6cac30",
    tcgPlayer: 658502,
  },
  text: [
    {
      title: "MINOR INCONVENIENCE",
      description:
        "When you play this character, you may choose and discard a card to deal 2 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              type: "discard",
            },
            {
              amount: 2,
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
              type: "deal-damage",
            },
          ],
        },
        type: "optional",
      },
      id: "xa7-1",
      name: "MINOR INCONVENIENCE",
      text: "MINOR INCONVENIENCE When you play this character, you may choose and discard a card to deal 2 damage to chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: davidXanatosSteelClanLeaderI18n,
};
