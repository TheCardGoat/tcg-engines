import { resolve } from "node:path";
import { mkdir, writeFile, access } from "node:fs/promises";
import { startNativeHost } from "./host.ts";
import {
  fingerprintGrandArchiveValue,
  replayGrandArchiveReplay,
} from "@tcg/grand-archive-server-adapter";

// Local launcher: credentials travel through the child environment, never command arguments.
const qa = process.argv.includes("--qa");
const exported = process.env.GA_CLIENT_BINARY;
const projectPath = process.env.GODOT_PROJECT_PATH;
if (!exported && !projectPath) {
  throw new Error(
    "Set GODOT_PROJECT_PATH to your godot-sim checkout, or GA_CLIENT_BINARY to an exported executable.",
  );
}
const project = resolve(projectPath ?? process.cwd());
if (!exported) await access(resolve(project, "project.godot"));
const host = startNativeHost({
  opponent: qa ? "pass-only" : "champion-profile",
  ...(qa ? { testSeed: "native-standard-1", opponentDelayMs: 500 } : {}),
});
const evidence =
  process.env.GA_QA_OUTPUT ?? resolve(project, "evidence", exported ? "exported" : "editor");
const child = await (async () => {
  try {
    return Bun.spawn(
      exported
        ? [exported, ...(qa ? ["--", "--qa"] : [])]
        : [process.env.GODOT_BIN ?? "godot", "--path", project, ...(qa ? ["--", "--qa"] : [])],
      {
        env: {
          ...process.env,
          GA_NATIVE_URL: host.url,
          GA_NATIVE_CREDENTIAL: host.sessions[0]!.credential,
          GA_QA_OUTPUT: evidence,
        },
        stdout: "inherit",
        stderr: "inherit",
      },
    );
  } catch (error) {
    await host.stop();
    throw error;
  }
})();
const watchdog = qa ? setTimeout(() => child.kill(), 100_000) : undefined;
const stop = async () => {
  child.kill();
  await host.stop();
};
process.on("SIGINT", () => {
  void stop();
});
process.on("SIGTERM", () => {
  void stop();
});
let status = 1;
try {
  const childStatus = await child.exited;
  status = childStatus === 0 && child.signalCode === null ? 0 : 1;
  if (qa && !host.engine) {
    status = 1;
    await mkdir(evidence, { recursive: true });
    await writeFile(
      resolve(evidence, "server-verification.json"),
      JSON.stringify(
        { replayMatches: false, humanActivations: 0, error: "no_game_created" },
        null,
        2,
      ),
    );
  }
  if (qa && host.engine) {
    const engine = host.engine;
    const replay = engine.exportReplay();
    const fingerprint = fingerprintGrandArchiveValue(
      replayGrandArchiveReplay(engine.program, replay),
    );
    const activations = engine.replayJournal.commands.filter(
      (entry) => entry.command.move === "activate-card" && entry.actorId === "p1",
    );
    await mkdir(evidence, { recursive: true });
    await writeFile(
      resolve(evidence, "server-verification.json"),
      JSON.stringify(
        {
          replayMatches: fingerprint === replay.finalSnapshotFingerprint,
          humanActivations: activations.length,
          acceptedCommands: engine.replayJournal.commands.map((entry) => ({
            actorId: entry.actorId,
            move: entry.command.move,
            stateVersion: entry.resultingStateVersion,
          })),
        },
        null,
        2,
      ),
    );
    if (fingerprint !== replay.finalSnapshotFingerprint || activations.length !== 1) status = 1;
  }
} finally {
  if (watchdog) clearTimeout(watchdog);
  await host.stop();
}
process.exit(status);
