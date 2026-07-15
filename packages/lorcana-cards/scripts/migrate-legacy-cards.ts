import {
  appendFile,
  exists,
  mkdir,
  readdir,
  readFile,
  stat,
  writeFile,
} from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";

const LEGACY_CARDS_DIR = join(import.meta.dir, "../src/legacy-cards");
const NEW_CARDS_DIR = join(import.meta.dir, "../src/cards");

const HEADER_COMMENT = `
// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
`;

// Helper to comment out lines
function commentOut(content: string): string {
  return content
    .split("\n")
    .map((line) => `// ${line}`)
    .join("\n");
}

async function processFile(filePath: string, set: string, category: string) {
  const fileName = basename(filePath);
  const ext = extname(fileName);

  if (!fileName.endsWith(".ts")) return;
  if (fileName === "index.ts") return;
  if (fileName === "songs.ts") return;

  // Determine target category
  let targetCategory = category;
  if (category === "songs") {
    targetCategory = "actions";
  }

  // Determine target filename (handle test files)
  let targetFileName = fileName;
  if (fileName.endsWith(".spec.ts")) {
    targetFileName = fileName.replace(".spec.ts", ".test.ts");
  }

  // Construct target path
  const targetDir = join(NEW_CARDS_DIR, set, targetCategory);
  const targetPath = join(targetDir, targetFileName);

  // Read legacy content
  const content = await readFile(filePath, "utf-8");
  const commentedContent = HEADER_COMMENT + commentOut(content);

  // Check if target file exists
  if (await exists(targetPath)) {
    console.log(`Appending to ${targetPath}`);
    await appendFile(targetPath, "\n" + commentedContent);
  } else {
    console.log(`Creating ${targetPath}`);
    await mkdir(targetDir, { recursive: true });
    await writeFile(targetPath, commentedContent);
  }
}

async function walk(dir: string, set?: string, category?: string) {
  const files = await readdir(dir);

  for (const file of files) {
    const path = join(dir, file);
    const stats = await stat(path);

    if (stats.isDirectory()) {
      if (!set) {
        // First level is SET (e.g., 001, 002)
        await walk(path, file);
      } else if (category) {
        // Recursive? Assuming flat structure inside category based on previous `ls`
        await walk(path, set, category);
      } else {
        // Second level is CATEGORY (e.g., actions, characters, songs)
        if (file === "abilities") continue; // Skip abilities
        await walk(path, set, file);
      }
    } else {
      if (set && category) {
        await processFile(path, set, category);
      }
    }
  }
}

console.log("Starting migration...");
await walk(LEGACY_CARDS_DIR);
console.log("Migration complete.");
