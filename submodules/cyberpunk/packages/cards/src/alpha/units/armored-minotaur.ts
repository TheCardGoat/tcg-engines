import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, condition, effect, target } from "../../helpers/builders/index.ts";

export const alphaArmoredMinotaur = defineCyberpunkCard({
  id: "3f52804a-9595-4115-a698-3b53f9b71227",
  slug: "armored-minotaur",
  rulesText: "PLAY If you have 12+ * (Street Cred), defeat a rival unit with power 5 or less.",
  name: "Armored Minotaur",
  displayName: "Armored Minotaur",
  canonicalId: "armored-minotaur",
  color: "red",
  classifications: ["Arasaka", "Militech", "Drone"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α007",
  artist: "CD PROJEKT RED",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a007.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 4,
  timingTriggers: ["play"],
  type: "unit",
  cost: 6,
  power: 9,
  abilities: [
    AbilityBuilder.triggered()
      .text("PLAY If you have 12+ Street Cred, defeat a rival unit with power 5 or less.")
      .onPlay()
      .source(target.self())
      .effect(
        effect.defeat({
          target: target.card({
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            maxPower: 5,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          }),
          conditions: [
            condition.streetCred({ controller: "friendly", comparison: "gte", value: 12 }),
          ],
        }),
      )
      .build(),
  ],
}) satisfies UnitCardDefinition;
