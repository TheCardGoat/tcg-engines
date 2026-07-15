#!/usr/bin/env bun
/**
 * Skill Packager - Creates a distributable .skill file of a skill folder
 *
 * Usage:
 *     bun run package-skill.ts <path/to/skill-folder> [output-directory]
 *
 * Example:
 *     bun run package-skill.ts skills/public/my-skill
 *     bun run package-skill.ts skills/public/my-skill ./dist
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { validateSkill } from "./quick-validate";

function getAllFiles(dirPath: string, basePath: string = dirPath): string[] {
  const files: string[] = [];
  const entries = readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, basePath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

async function packageSkill(
  skillPath: string,
  outputDir?: string,
): Promise<string | null> {
  const resolvedSkillPath = resolve(skillPath);

  if (!existsSync(resolvedSkillPath)) {
    console.log(`❌ Error: Skill folder not found: ${resolvedSkillPath}`);
    return null;
  }

  const stats = statSync(resolvedSkillPath);
  if (!stats.isDirectory()) {
    console.log(`❌ Error: Path is not a directory: ${resolvedSkillPath}`);
    return null;
  }

  const skillMd = join(resolvedSkillPath, "SKILL.md");
  if (!existsSync(skillMd)) {
    console.log(`❌ Error: SKILL.md not found in ${resolvedSkillPath}`);
    return null;
  }

  console.log("🔍 Validating skill...");
  const { valid, message } = validateSkill(resolvedSkillPath);
  if (!valid) {
    console.log(`❌ Validation failed: ${message}`);
    console.log("   Please fix the validation errors before packaging.");
    return null;
  }
  console.log(`✅ ${message}\n`);

  const skillName = basename(resolvedSkillPath);
  let outputPath: string;
  if (outputDir) {
    outputPath = resolve(outputDir);
    mkdirSync(outputPath, { recursive: true });
  } else {
    outputPath = process.cwd();
  }

  const skillFilename = join(outputPath, `${skillName}.skill`);

  try {
    const files = getAllFiles(resolvedSkillPath);
    const parentDir = dirname(resolvedSkillPath);

    // Create a simple zip file using Bun's built-in capabilities
    // We'll use the 'archiver' pattern but with a simpler approach
    const zipEntries: Array<{ path: string; content: Buffer }> = [];

    for (const filePath of files) {
      const arcname = relative(parentDir, filePath);
      const content = readFileSync(filePath);
      zipEntries.push({ path: arcname, content });
      console.log(`  Added: ${arcname}`);
    }

    // Use Bun's native zip support
    const zipData = await createZipBuffer(zipEntries);
    writeFileSync(skillFilename, zipData);

    console.log(`\n✅ Successfully packaged skill to: ${skillFilename}`);
    return skillFilename;
  } catch (error) {
    console.log(`❌ Error creating .skill file: ${error}`);
    return null;
  }
}

async function createZipBuffer(
  entries: Array<{ path: string; content: Buffer }>,
): Promise<Buffer> {
  // Simple ZIP file creation using the ZIP format specification
  // This is a minimal implementation that creates valid ZIP files

  const localFileHeaders: Buffer[] = [];
  const centralDirectoryHeaders: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const filename = Buffer.from(entry.path, "utf-8");
    const content = entry.content;

    // Local file header
    const localHeader = Buffer.alloc(30 + filename.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // Local file header signature
    localHeader.writeUInt16LE(20, 4); // Version needed to extract
    localHeader.writeUInt16LE(0, 6); // General purpose bit flag
    localHeader.writeUInt16LE(0, 8); // Compression method (0 = stored)
    localHeader.writeUInt16LE(0, 10); // Last mod file time
    localHeader.writeUInt16LE(0, 12); // Last mod file date
    localHeader.writeUInt32LE(crc32(content), 14); // CRC-32
    localHeader.writeUInt32LE(content.length, 18); // Compressed size
    localHeader.writeUInt32LE(content.length, 22); // Uncompressed size
    localHeader.writeUInt16LE(filename.length, 26); // File name length
    localHeader.writeUInt16LE(0, 28); // Extra field length
    filename.copy(localHeader, 30);

    localFileHeaders.push(localHeader);
    localFileHeaders.push(content);

    // Central directory header
    const centralHeader = Buffer.alloc(46 + filename.length);
    centralHeader.writeUInt32LE(0x02014b50, 0); // Central directory header signature
    centralHeader.writeUInt16LE(20, 4); // Version made by
    centralHeader.writeUInt16LE(20, 6); // Version needed to extract
    centralHeader.writeUInt16LE(0, 8); // General purpose bit flag
    centralHeader.writeUInt16LE(0, 10); // Compression method
    centralHeader.writeUInt16LE(0, 12); // Last mod file time
    centralHeader.writeUInt16LE(0, 14); // Last mod file date
    centralHeader.writeUInt32LE(crc32(content), 16); // CRC-32
    centralHeader.writeUInt32LE(content.length, 20); // Compressed size
    centralHeader.writeUInt32LE(content.length, 24); // Uncompressed size
    centralHeader.writeUInt16LE(filename.length, 28); // File name length
    centralHeader.writeUInt16LE(0, 30); // Extra field length
    centralHeader.writeUInt16LE(0, 32); // File comment length
    centralHeader.writeUInt16LE(0, 34); // Disk number start
    centralHeader.writeUInt16LE(0, 36); // Internal file attributes
    centralHeader.writeUInt32LE(0, 38); // External file attributes
    centralHeader.writeUInt32LE(offset, 42); // Relative offset of local header
    filename.copy(centralHeader, 46);

    centralDirectoryHeaders.push(centralHeader);

    offset += localHeader.length + content.length;
  }

  const centralDirectoryOffset = offset;
  const centralDirectorySize = centralDirectoryHeaders.reduce(
    (sum, h) => sum + h.length,
    0,
  );

  // End of central directory record
  const endRecord = Buffer.alloc(22);
  endRecord.writeUInt32LE(0x06054b50, 0); // End of central directory signature
  endRecord.writeUInt16LE(0, 4); // Number of this disk
  endRecord.writeUInt16LE(0, 6); // Disk where central directory starts
  endRecord.writeUInt16LE(entries.length, 8); // Number of central directory records on this disk
  endRecord.writeUInt16LE(entries.length, 10); // Total number of central directory records
  endRecord.writeUInt32LE(centralDirectorySize, 12); // Size of central directory
  endRecord.writeUInt32LE(centralDirectoryOffset, 16); // Offset of start of central directory
  endRecord.writeUInt16LE(0, 20); // Comment length

  return Buffer.concat([
    ...localFileHeaders,
    ...centralDirectoryHeaders,
    endRecord,
  ]);
}

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;
  const table = getCrc32Table();

  for (let i = 0; i < buffer.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buffer[i]) & 0xff];
  }

  return (crc ^ 0xffffffff) >>> 0;
}

let crc32Table: number[] | null = null;

function getCrc32Table(): number[] {
  if (crc32Table) return crc32Table;

  crc32Table = [];
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
    crc32Table[i] = crc >>> 0;
  }

  return crc32Table;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log(
      "Usage: bun run package-skill.ts <path/to/skill-folder> [output-directory]",
    );
    console.log("\nExample:");
    console.log("  bun run package-skill.ts skills/public/my-skill");
    console.log("  bun run package-skill.ts skills/public/my-skill ./dist");
    process.exit(1);
  }

  const skillPath = args[0];
  const outputDir = args.length > 1 ? args[1] : undefined;

  console.log(`📦 Packaging skill: ${skillPath}`);
  if (outputDir) {
    console.log(`   Output directory: ${outputDir}`);
  }
  console.log();

  const result = await packageSkill(skillPath, outputDir);

  if (result) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main();
