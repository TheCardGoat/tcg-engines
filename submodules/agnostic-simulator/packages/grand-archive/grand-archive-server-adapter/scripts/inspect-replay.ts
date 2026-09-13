import { readFile } from "node:fs/promises";
import { grandArchiveCards } from "@tcg/grand-archive-cards";
import { createGrandArchiveMatchProgram } from "@tcg/grand-archive-engine/runtime";
import { inspectGrandArchiveReplay, type GrandArchiveReplayV1 } from "../src/replay.ts";

function usage(): never {
  throw new Error(
    "Usage: pnpm inspect-replay -- <replay.json> --viewer <player-id> [--command <accepted-count>]",
  );
}

const args = process.argv.slice(2);
const replayPath = args.find((value) => !value.startsWith("--"));
const viewerFlag = args.indexOf("--viewer");
const commandFlag = args.indexOf("--command");
if (!replayPath || viewerFlag < 0 || !args[viewerFlag + 1]) usage();

const replay = JSON.parse(await readFile(replayPath, "utf8")) as GrandArchiveReplayV1;
const command = commandFlag < 0 ? undefined : Number(args[commandFlag + 1]);
const program = createGrandArchiveMatchProgram(grandArchiveCards);
const inspection = inspectGrandArchiveReplay(program, replay, args[viewerFlag + 1]!, command);

process.stdout.write(`${JSON.stringify(inspection, null, 2)}\n`);
