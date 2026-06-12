import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { alphaDyingNightVSPistol } from "./dying-night-v-s-pistol.ts";
import { alphaKiroshiOptics } from "./kiroshi-optics.ts";
import { alphaMandibularUpgrade } from "./mandibular-upgrade.ts";
import { alphaMantisBlades } from "./mantis-blades.ts";
import { alphaSandevistan } from "./sandevistan.ts";
import { alphaSatoriSwordOfSaburo } from "./satori-sword-of-saburo.ts";

export { alphaDyingNightVSPistol } from "./dying-night-v-s-pistol.ts";
export { alphaKiroshiOptics } from "./kiroshi-optics.ts";
export { alphaMandibularUpgrade } from "./mandibular-upgrade.ts";
export { alphaMantisBlades } from "./mantis-blades.ts";
export { alphaSandevistan } from "./sandevistan.ts";
export { alphaSatoriSwordOfSaburo } from "./satori-sword-of-saburo.ts";

export const alphaGear = [
  alphaDyingNightVSPistol,
  alphaKiroshiOptics,
  alphaMandibularUpgrade,
  alphaMantisBlades,
  alphaSandevistan,
  alphaSatoriSwordOfSaburo,
] satisfies AlphaCardDefinition[];
