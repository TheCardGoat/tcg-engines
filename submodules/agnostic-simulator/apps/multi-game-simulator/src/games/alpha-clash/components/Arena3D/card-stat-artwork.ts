import combatFrame from "./assets/combat-stat-frame.svg?raw";
import healthFrame from "./assets/contender-health-frame.svg?raw";

const palettes: Record<string, readonly [string, string, string]> = {
  green: ["#479465", "#24583f", "#102c21"],
  red: ["#c34b4a", "#8d2428", "#3e1018"],
  blue: ["#5269a9", "#293b75", "#131e46"],
  black: ["#77717c", "#39333f", "#17141e"],
  white: ["#bcbcaf", "#777a73", "#363e3a"],
};
const inner = (svg: string) =>
  svg
    .trim()
    .replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>$/, "");
const number = (value: number) => String(Math.trunc(value));
/** Coordinates follow standard printed frames in the 400 × 557 source artwork. */
export function cardStatArtwork({
  attack,
  defense,
  health,
  contender,
  color,
  field = false,
}: {
  attack?: number;
  defense?: number;
  health?: number;
  contender: boolean;
  color: string;
  /** Use the printed frame's full interior for readable board-size numbers. */
  field?: boolean;
}): string {
  const combat =
    Number.isFinite(attack) && Number.isFinite(defense)
      ? inner(combatFrame)
          .replace('data-value="attack">0', `data-value="attack">${number(attack!)}`)
          .replace('data-value="defense">0', `data-value="defense">${number(defense!)}`)
      : "";
  const life = Number.isFinite(health)
    ? inner(healthFrame).replace('data-value="health">0', `data-value="health">${number(health!)}`)
    : "";
  const fieldTypography = field
    ? `<style>
      text:not([data-value]) { display: none; }
      text[data-value] { font-family: Arial, sans-serif; font-style: normal; font-weight: 900; fill: #ffffff; stroke: #08130f; stroke-width: 2; letter-spacing: -1px; }
      text[data-value="attack"] { font-size: 42px; transform: translateY(3px); }
      text[data-value="defense"] { font-size: 42px; transform: translateY(3px); }
      text[data-value="health"] { font-size: 44px; transform: translateY(5px); }
    </style>`
    : "";
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1114" viewBox="0 0 400 557">${fieldTypography}<g transform="translate(0 ${contender ? -4 : 0})">${combat}</g>${life}</svg>`;
  const palette = palettes[color] ?? palettes.black;
  ["#479465", "#24583f", "#102c21"].forEach((original, index) => {
    svg = svg.replaceAll(original, palette[index]);
  });
  return svg;
}
