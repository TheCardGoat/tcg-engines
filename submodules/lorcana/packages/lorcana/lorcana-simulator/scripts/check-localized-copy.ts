import { readFile } from "node:fs/promises";

const GUARDED_FILES = [
  "src/lib/features/simulator/shell/LorcanaTabletopSimulator.svelte",
  "src/lib/features/simulator/shell/LorcanaSimulatorSidebar.svelte",
  "src/lib/features/matchmaking/ui/MatchmakingLobby.svelte",
  "src/lib/features/simulator/panels/AvailableMovesPanel.svelte",
  "src/lib/features/simulator/panels/EventLogPanel.svelte",
  "src/lib/features/simulator/board/HandZone.svelte",
  "src/lib/features/simulator/board/PlayZone.svelte",
  "src/lib/features/simulator/board/DiscardZone.svelte",
  "src/lib/features/simulator/board/InkwellZone.svelte",
  "src/lib/features/simulator/dialogs/DiscardPileDialog.svelte",
  "src/lib/features/simulator/dialogs/CardTargetDialog.svelte",
  "src/lib/features/simulator/dialogs/PlayerSettingsDialog.svelte",
  "src/lib/features/simulator/panels/PlayerInfo.svelte",
  "src/lib/design-system/simulator/cards/CardFace.svelte",
  "src/lib/design-system/simulator/cards/CardBack.svelte",
  "src/lib/design-system/simulator/display/DropIndicator.svelte",
  "src/lib/design-system/simulator/display/EmptyState.svelte",
  "src/lib/design-system/simulator/display/LoreBadge.svelte",
] as const;

const DIRECT_TEXT_PATTERN = />\s*([A-Za-z][^<{]*)\s*</g;
const DIRECT_A11Y_PATTERN = /\b(?:aria-label|title|alt)\s*=\s*"([^"{][^"]*[A-Za-z][^"]*)"/g;

function getLineNumber(content: string, index: number): number {
  return content.slice(0, index).split("\n").length;
}

function stripBraces(content: string): string {
  let previous = "";
  let result = content;
  const maxPasses = Math.max(content.length, 1);

  for (let pass = 0; pass < maxPasses && previous !== result; pass += 1) {
    previous = result;
    result = result.replace(/\{[^{}]*\}/g, "");
  }

  if (previous !== result) {
    throw new Error(
      `Exceeded ${maxPasses} brace-stripping passes while normalizing localized copy.`,
    );
  }
  return result;
}

function stripScriptAndStyle(content: string): string {
  return content
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\{#[^}]*\}/g, "")
    .replace(/\{:[^}]*\}/g, "")
    .replace(/\{\/[^}]*\}/g, "")
    .replace(/\{@[^}]*\}/g, "");
}

const violations: string[] = [];

for (const filePath of GUARDED_FILES) {
  const file = new URL(`../${filePath}`, import.meta.url);
  const content = await readFile(file, "utf8");
  const markupContent = stripBraces(stripScriptAndStyle(content));

  for (const match of markupContent.matchAll(DIRECT_TEXT_PATTERN)) {
    const text = match[1]?.trim() ?? "";
    if (!text) {
      continue;
    }

    const line = getLineNumber(markupContent, match.index ?? 0);
    violations.push(`${filePath}:${line} contains hardcoded text node "${text}"`);
  }

  for (const match of markupContent.matchAll(DIRECT_A11Y_PATTERN)) {
    const value = match[1]?.trim() ?? "";
    if (!value) {
      continue;
    }

    const line = getLineNumber(markupContent, match.index ?? 0);
    violations.push(`${filePath}:${line} contains hardcoded accessibility text "${value}"`);
  }
}

if (violations.length > 0) {
  console.error(
    "Hardcoded UI literals detected. Use Paraglide message keys in guarded runtime simulator files.",
  );
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}
