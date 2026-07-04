import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const spoilerElSombreronLaVenganzaLenta = defineCyberpunkCard({
  id: "e6ab6b31-cf5d-4acb-9d83-ce57f1b6718f",
  slug: "el-sombreron-la-venganza-lenta",
  rulesText: "ATTACK While fighting a rival Unit, double this Unit's power.",
  subname: "La Venganza Lenta",
  name: "El Sombrerón",
  displayName: "El Sombrerón - La Venganza Lenta",
  canonicalId: "el-sombreron-la-venganza-lenta",
  color: "red",
  classifications: ["Ganger", "Valentino"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "019",
  artist: "Rafael de Latorre & Clonerh",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/019.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 4,
  timingTriggers: ["attack"],
  type: "unit",
  cost: 4,
  power: 4,
  abilities: [
    {
      kind: "triggered",
      text: "ATTACK While fighting a rival Unit, double this Unit's power.",
      trigger: {
        trigger: "attack",
      },
      source: {
        selector: "self",
      },
      conditions: [
        {
          condition: "fightKind",
          target: {
            selector: "self",
          },
          kind: "fight",
        },
      ],
      effects: [
        {
          effect: "multiplyPower",
          target: {
            selector: "self",
          },
          multiplier: 2,
          duration: "turn",
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
