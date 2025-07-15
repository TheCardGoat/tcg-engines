#!/usr/bin/env bun

import { readFile, writeFile } from "node:fs/promises";

// Focus on core-engine specific files that are likely to have genuinely unused exports
const CORE_ENGINE_FILES_TO_CLEAN = [
  "src/game-engine/core-engine/engine/types.ts",
  "src/game-engine/core-engine/engine/action-creators.ts",
  "src/game-engine/core-engine/engine/zone-operation.ts",
  "src/game-engine/core-engine/engine/authoritative-client-types.ts",
  "src/game-engine/core-engine/engine/test-core-engine.ts",
];

// Exports that are definitely unused based on the analysis
const UNUSED_EXPORTS_TO_REMOVE = {
  "src/game-engine/core-engine/engine/types.ts": [
    "Undo",
    "Redo",
    "StripTransients",
    "Any",
    "MakeMove",
    "GameEvent",
    "AutomaticGameEvent",
  ],
  "src/game-engine/core-engine/engine/action-creators.ts": [
    "makeMove",
    "gameEvent",
    "automaticGameEvent",
    "sync",
    "patch",
    "update",
    "reset",
    "undo",
    "redo",
    "stripTransients",
  ],
  "src/game-engine/core-engine/engine/zone-operation.ts": [
    "ZonePosition",
    "ZoneVisibility",
    "ZoneConfig",
    "ZoneMoveEvent",
    "ZoneShuffleEvent",
    "ZoneSearchEvent",
    "ZoneCountEvent",
    "ZonePeekEvent",
    "ZoneEvent",
    "ZoneOperationError",
    "isZoneOperationError",
    "getCardZoneByInstanceId",
    "shuffleZone",
    "moveCardByInstanceId",
    "move",
  ],
  "src/game-engine/core-engine/engine/authoritative-client-types.ts": [
    "CallbackFn",
    "TransportData",
    "IntermediateTransportData",
    "TransportAPI",
    "PlayerMetadata",
    "MatchData",
  ],
  "src/game-engine/core-engine/engine/test-core-engine.ts": [
    "TestCardDefinition",
    "TestCardInstance",
    "TestGameState",
    "TestPlayerState",
    "TestCardFilter",
    "TestMove",
    "TestCardRepository",
    "testCard",
    "testGame",
  ],
};

async function removeUnusedExports(
  filePath: string,
  exportsToRemove: string[],
) {
  const content = await readFile(filePath, "utf-8");
  const lines = content.split("\n");
  const newLines: string[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    let shouldRemove = false;

    // Check if this line exports something we want to remove
    for (const exportName of exportsToRemove) {
      // Match export declarations
      if (
        line.startsWith(`export type ${exportName}`) ||
        line.startsWith(`export interface ${exportName}`) ||
        line.startsWith(`export const ${exportName}`) ||
        line.startsWith(`export function ${exportName}`) ||
        line.startsWith(`export class ${exportName}`)
      ) {
        shouldRemove = true;
        break;
      }

      // Match named exports
      if (line.includes("export {") && line.includes(exportName)) {
        // For named exports, we need to be more careful
        const namedExportMatch = line.match(/export\s+(?:type\s+)?{([^}]+)}/);
        if (namedExportMatch) {
          const exports = namedExportMatch[1].split(",").map((e) => e.trim());
          const filteredExports = exports.filter(
            (e) => !exportsToRemove.includes(e.replace(/\s+as\s+\w+/, "")),
          );

          if (filteredExports.length === 0) {
            shouldRemove = true;
          } else if (filteredExports.length !== exports.length) {
            // Reconstruct the export line with remaining exports
            const isTypeOnly = line.includes("export type");
            const newLine = `export ${isTypeOnly ? "type " : ""}{ ${filteredExports.join(", ")} }`;
            newLines.push(newLine);
            i++;
          }
        }
      }
    }

    if (shouldRemove) {
      console.log(`Removing export from ${filePath}: ${line}`);

      // Skip multi-line declarations
      if (line.includes("{") && !line.includes("}")) {
        i++;
        while (i < lines.length && !lines[i].includes("}")) {
          console.log(`  Removing continuation: ${lines[i]}`);
          i++;
        }
        if (i < lines.length) {
          console.log(`  Removing continuation: ${lines[i]}`);
        }
      }
    } else {
      newLines.push(lines[i]);
    }

    i++;
  }

  const newContent = newLines.join("\n");
  await writeFile(filePath, newContent);
  console.log(`Updated ${filePath}`);
}

async function main() {
  console.log("=== CLEANING UP UNUSED EXPORTS ===\n");

  for (const [filePath, exportsToRemove] of Object.entries(
    UNUSED_EXPORTS_TO_REMOVE,
  )) {
    try {
      await removeUnusedExports(filePath, exportsToRemove);
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  }

  console.log("\n=== CLEANUP COMPLETE ===");
  console.log("Run 'bun run check' to verify no functionality was broken.");
}

if (import.meta.main) {
  main().catch(console.error);
}
