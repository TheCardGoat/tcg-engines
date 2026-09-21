import { expect, test } from "bun:test";
import { mkdtemp, writeFile, chmod, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

for (const scenario of [
  { name: "QA rejects successful child without a game", qa: true, killed: false, expected: 1 },
  {
    name: "normal launcher preserves successful child exit",
    qa: false,
    killed: false,
    expected: 0,
  },
  { name: "normal launcher fails a signal-killed child", qa: false, killed: true, expected: 1 },
  { name: "QA fails a signal-killed child without a game", qa: true, killed: true, expected: 1 },
]) {
  test(
    scenario.name,
    async () => {
      const directory = await mkdtemp(join(tmpdir(), "native-desktop-test-"));
      try {
        const executable = join(directory, "client");
        await writeFile(
          executable,
          `#!/usr/bin/env bun\n${scenario.killed ? 'process.kill(process.pid, "SIGKILL")' : "process.exit(0)"};\n`,
        );
        await chmod(executable, 0o755);
        const child = Bun.spawn(
          [
            process.execPath,
            new URL("./desktop.ts", import.meta.url).pathname,
            ...(scenario.qa ? ["--qa"] : []),
          ],
          {
            env: { ...process.env, GA_CLIENT_BINARY: executable, GA_QA_OUTPUT: directory },
            stdout: "pipe",
            stderr: "pipe",
          },
        );
        expect(await child.exited).toBe(scenario.expected);
        if (scenario.qa) {
          expect(
            JSON.parse(await readFile(join(directory, "server-verification.json"), "utf8")),
          ).toEqual({ replayMatches: false, humanActivations: 0, error: "no_game_created" });
        }
      } finally {
        await rm(directory, { recursive: true, force: true });
      }
    },
    15000,
  );
}
