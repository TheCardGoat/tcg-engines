import "../unpack-evaluation-data.ts";
import "./unpack-traces.ts";
import { readFileSync, writeFileSync } from "node:fs";
import { stableBotHash } from "@tcg/bot-core";
import { resolveAlphaClashLabDeck } from "@tcg/alpha-clash-server-adapter/practice";
const samples = [
  { game: 1, index: 247, name: "War converts its ready board into a same-turn win" },
  { game: 6, index: 41, name: "Valen develops its third resource" },
  {
    game: 11,
    index: 219,
    name: "Valen spends resources on a threat instead of toggling the Portal",
  },
];
let source =
  '// Native Season 3 v1 loss prefixes. Rebuild each position through accepted commands.\nimport type { CreateMatchOptions } from "../../state.ts";\nimport type { AcCommand, PlayerId } from "../../types.ts";\n\nexport const mirrorLossCases = [\n';
for (const sample of samples) {
  const data = JSON.parse(
    readFileSync(new URL(`investigation/v1-mirror-${sample.game}.json`, import.meta.url), "utf8"),
  );
  const r = data.record;
  const options = {
    id: `${r.blockId}/${r.legId}`,
    seed: Number.parseInt(stableBotHash(r.seed.replace(/-seat-[12]$/, "")).split(":")[1], 16),
    firstPlayer: "player-one",
    validateDeck: false,
    players: {
      "player-one": { name: "P1", deck: resolveAlphaClashLabDeck(r.candidateDeckId) },
      "player-two": { name: "P2", deck: resolveAlphaClashLabDeck(r.baselineDeckId) },
    },
  };
  source +=
    "  { name: " +
    JSON.stringify(sample.name) +
    ", seat: " +
    JSON.stringify(r.candidateSeat === "p1" ? "player-one" : "player-two") +
    ",\noptions: " +
    JSON.stringify(options, null, 2) +
    ",\ncommands: [\n" +
    data.rows
      .slice(1, sample.index)
      .map((row: { command: unknown }) => "    " + JSON.stringify(row.command) + ",")
      .join("\n") +
    "\n]},\n";
}
source +=
  "] satisfies { name: string; seat: PlayerId; options: CreateMatchOptions; commands: AcCommand[] }[];\n";
writeFileSync(
  new URL(
    "../../../../../../../alpha-clash/packages/engine/src/automation/fixtures/mirror-losses.ts",
    import.meta.url,
  ),
  source,
);
