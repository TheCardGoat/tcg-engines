import type { DiceImageColor, DicierStyle, DieType } from "../../engine";

export const DICE_ASSET_CDN = "https://r2.tcg.online/public/assets";

const DICIER_VARIANTS = [
  "Block-Dark",
  "Block-Heavy",
  "Block-Light",
  "Flat-Dark",
  "Flat-Heavy",
  "Flat-Light",
  "Pixel",
  "Round-Dark",
  "Round-Heavy",
  "Round-Light",
];

let fontsInjected = false;

export function injectDicierFonts(): void {
  if (fontsInjected) {
    return;
  }
  fontsInjected = true;
  const css = DICIER_VARIANTS.map(
    (v) =>
      `@font-face{font-family:'Dicier-${v}';src:url('${DICE_ASSET_CDN}/Dicier%20v1_5_4/woff2/Dicier-${v}.woff2') format('woff2');font-display:swap;}`,
  ).join("");
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
}

export function getDicierFontUrl(style: DicierStyle): string {
  return `${DICE_ASSET_CDN}/Dicier%20v1_5_4/woff2/Dicier-${style}.woff2`;
}

const IMAGE_SUBFOLDER: Record<DieType, string> = {
  d4: "D4",
  d6: "D6",
  d8: "D8",
  d10: "D10_and_D100",
  d12: "D12",
  d20: "D20",
};

export function getDiceImageUrl(
  dieType: DieType,
  faceValue: number,
  color: DiceImageColor,
): string {
  const folder = IMAGE_SUBFOLDER[dieType];
  return `${DICE_ASSET_CDN}/HiResDicePack/${folder}/${dieType}_${color}_${faceValue}.png`;
}
