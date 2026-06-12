import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";
import { spoilerAfterpartyAtLizzieS } from "./afterparty-at-lizzie-s.ts";
import { spoilerCarnageAtTheColosseum } from "./carnage-at-the-colosseum.ts";
import { spoilerChromeReverie } from "./chrome-reverie.ts";
import { spoilerCyberpsychosis } from "./cyberpsychosis.ts";
import { spoilerPeaceOffering } from "./peace-offering.ts";

export { spoilerAfterpartyAtLizzieS } from "./afterparty-at-lizzie-s.ts";
export { spoilerCarnageAtTheColosseum } from "./carnage-at-the-colosseum.ts";
export { spoilerChromeReverie } from "./chrome-reverie.ts";
export { spoilerCyberpsychosis } from "./cyberpsychosis.ts";
export { spoilerPeaceOffering } from "./peace-offering.ts";

export const spoilerPrograms = [
  spoilerAfterpartyAtLizzieS,
  spoilerCarnageAtTheColosseum,
  spoilerChromeReverie,
  spoilerCyberpsychosis,
  spoilerPeaceOffering,
] satisfies SpoilerCardDefinition[];
