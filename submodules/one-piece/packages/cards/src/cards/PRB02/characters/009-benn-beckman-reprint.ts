import type { CharacterCard } from "@tcg/op-types";
import { op09BennBeckman009 } from "../../OP09/characters/009-benn-beckman.ts";
import { prb02BennBeckmanReprint009I18n } from "./009-benn-beckman-reprint.i18n.ts";

export const prb02BennBeckmanReprint009: CharacterCard = {
  ...op09BennBeckman009,
  id: "OP09-009_r1",
  slug: "benn-beckman-reprint",
  name: "Benn.Beckman (Reprint)",
  printings: [
    {
      id: "OP09-009_r1",
      artId: "OP09-009_r1",
      setCode: "PRB02",
      collectorNumber: "009",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-009_r1.jpg",
    },
  ],
  rarity: "SR",
  setId: "PRB02",
  artVariants: undefined,
  i18n: prb02BennBeckmanReprint009I18n,
};
