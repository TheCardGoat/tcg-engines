#!/usr/bin/env bun

/**
 * Check Regeneration Progress
 *
 * Monitors the progress of card file regeneration by checking file modification times.
 */

import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";

interface SetStats {
  name: string;
  totalFiles: number;
  recentlyModified: number;
  oldFiles: number;
  lastModified?: Date;
}

const SETS_DIR = "src/cards/sets";
const RECENT_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes

async function getSetStats(
  setPath: string,
  setName: string,
): Promise<SetStats> {
  const entries = await readdir(setPath, { withFileTypes: true });
  const now = Date.now();

  let totalFiles = 0;
  let recentlyModified = 0;
  let oldFiles = 0;
  let lastModified: Date | undefined;

  for (const entry of entries) {
    if (
      entry.isFile() &&
      entry.name.endsWith(".ts") &&
      entry.name !== "index.ts"
    ) {
      totalFiles++;

      const filePath = join(setPath, entry.name);
      const stats = await stat(filePath);
      const mtime = stats.mtime.getTime();

      if (now - mtime < RECENT_THRESHOLD_MS) {
        recentlyModified++;
      } else {
        oldFiles++;
      }

      if (!lastModified || mtime > lastModified.getTime()) {
        lastModified = stats.mtime;
      }
    }
  }

  return {
    name: setName,
    totalFiles,
    recentlyModified,
    oldFiles,
    lastModified,
  };
}

async function checkProgress() {
  console.log("📊 Checking regeneration progress...\n");

  const sets = await readdir(SETS_DIR, { withFileTypes: true });
  const setStats: SetStats[] = [];

  for (const set of sets) {
    if (set.isDirectory()) {
      const setPath = join(SETS_DIR, set.name);
      const stats = await getSetStats(setPath, set.name.toUpperCase());
      setStats.push(stats);
    }
  }

  // Sort by name
  setStats.sort((a, b) => a.name.localeCompare(b.name));

  console.log("┌─────────┬───────┬──────────┬─────────┬─────────────────────┐");
  console.log("│ Set     │ Total │ Recent   │ Old     │ Last Modified       │");
  console.log("├─────────┼───────┼──────────┼─────────┼─────────────────────┤");

  let totalFiles = 0;
  let totalRecent = 0;
  let totalOld = 0;

  for (const stats of setStats) {
    const recent =
      stats.recentlyModified > 0
        ? `✅ ${stats.recentlyModified}`
        : `   ${stats.recentlyModified}`;
    const old =
      stats.oldFiles > 0 ? `⚠️  ${stats.oldFiles}` : `   ${stats.oldFiles}`;
    const lastMod = stats.lastModified
      ? stats.lastModified.toLocaleTimeString()
      : "N/A";

    console.log(
      `│ ${stats.name.padEnd(7)} │ ${String(stats.totalFiles).padStart(5)} │ ${recent.padEnd(8)} │ ${old.padEnd(7)} │ ${lastMod.padEnd(19)} │`,
    );

    totalFiles += stats.totalFiles;
    totalRecent += stats.recentlyModified;
    totalOld += stats.oldFiles;
  }

  console.log("├─────────┼───────┼──────────┼─────────┼─────────────────────┤");
  console.log(
    `│ TOTAL   │ ${String(totalFiles).padStart(5)} │ ✅ ${String(totalRecent).padEnd(6)} │ ⚠️  ${String(totalOld).padEnd(5)} │                     │`,
  );
  console.log("└─────────┴───────┴──────────┴─────────┴─────────────────────┘");

  const percentComplete =
    totalFiles > 0 ? ((totalRecent / totalFiles) * 100).toFixed(1) : "0.0";
  console.log(
    `\n📈 Progress: ${percentComplete}% (${totalRecent}/${totalFiles} files regenerated in last 10 minutes)`,
  );

  if (totalRecent === totalFiles) {
    console.log("\n🎉 All files have been recently regenerated!");
  } else if (totalRecent > 0) {
    console.log("\n⏳ Regeneration in progress...");
    console.log(`   ${totalOld} file(s) still need to be regenerated`);
  } else {
    console.log("\n⚠️  No recent regeneration detected.");
    console.log("   Run: bun scripts/regenerate-all-sets.ts");
  }

  console.log();
}

async function main() {
  await checkProgress();
}

if (import.meta.main) {
  main().catch(console.error);
}
