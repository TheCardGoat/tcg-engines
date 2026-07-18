import type { CharacterCard } from "@tcg/op-types";
import { op09Monster012I18n } from "./012-monster.i18n.ts";

export const op09Monster012: CharacterCard = {
  id: "OP09-012",
  canonicalId: "OP09-012",
  slug: "monster",
  name: "Monster",
  printings: [
    {
      id: "OP09-012",
      artId: "OP09-012",
      setCode: "OP09",
      collectorNumber: "012",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-012.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP09",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Animal Red-Haired Pirates"],
  attribute: "strike",
  effect:
    "If your Character [Bonk Punch] would be K.O.'d by an effect, you may trash this Character instead.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "ko",
        target: {
          player: "self",
          zones: ["character"],
          count: {
            amount: 1,
          },
          filters: [
            {
              filter: "name",
              value: "Bonk Punch",
            },
          ],
        },
        source: "effect",
        replacementAction: {
          action: "trashThisCard",
        },
      },
    ],
  },
  i18n: op09Monster012I18n,
};
