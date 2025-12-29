#!/usr/bin/env bun
/**
 * Quick validation script for skills - minimal version
 */

import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

interface ValidationResult {
  valid: boolean;
  message: string;
}

interface Frontmatter {
  name?: string;
  description?: string;
  license?: string;
  "allowed-tools"?: unknown;
  metadata?: unknown;
  [key: string]: unknown;
}

const ALLOWED_PROPERTIES = new Set([
  "name",
  "description",
  "license",
  "allowed-tools",
  "metadata",
]);

/**
 * Simple YAML frontmatter parser for skill validation.
 * Only handles the simple key: value format used in skill frontmatter.
 */
function parseSimpleYaml(yamlText: string): Frontmatter {
  const result: Frontmatter = {};
  const lines = yamlText.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    let value = trimmed.slice(colonIndex + 1).trim();

    // Handle quoted strings
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  }

  return result;
}

export function validateSkill(skillPath: string): ValidationResult {
  const resolvedPath = resolve(skillPath);
  const skillMd = join(resolvedPath, "SKILL.md");

  if (!existsSync(skillMd)) {
    return { valid: false, message: "SKILL.md not found" };
  }

  const content = readFileSync(skillMd, "utf-8");

  if (!content.startsWith("---")) {
    return { valid: false, message: "No YAML frontmatter found" };
  }

  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return { valid: false, message: "Invalid frontmatter format" };
  }

  const frontmatterText = match[1];

  let frontmatter: Frontmatter;
  try {
    frontmatter = parseSimpleYaml(frontmatterText);
    if (typeof frontmatter !== "object" || frontmatter === null) {
      return { valid: false, message: "Frontmatter must be a YAML dictionary" };
    }
  } catch (error) {
    return { valid: false, message: `Invalid YAML in frontmatter: ${error}` };
  }

  const unexpectedKeys = Object.keys(frontmatter).filter(
    (key) => !ALLOWED_PROPERTIES.has(key),
  );
  if (unexpectedKeys.length > 0) {
    return {
      valid: false,
      message: `Unexpected key(s) in SKILL.md frontmatter: ${unexpectedKeys.sort().join(", ")}. Allowed properties are: ${[...ALLOWED_PROPERTIES].sort().join(", ")}`,
    };
  }

  if (!("name" in frontmatter)) {
    return { valid: false, message: "Missing 'name' in frontmatter" };
  }
  if (!("description" in frontmatter)) {
    return { valid: false, message: "Missing 'description' in frontmatter" };
  }

  const name = frontmatter.name;
  if (typeof name !== "string") {
    return {
      valid: false,
      message: `Name must be a string, got ${typeof name}`,
    };
  }

  const trimmedName = name.trim();
  if (trimmedName) {
    if (!/^[a-z0-9-]+$/.test(trimmedName)) {
      return {
        valid: false,
        message: `Name '${trimmedName}' should be hyphen-case (lowercase letters, digits, and hyphens only)`,
      };
    }
    if (
      trimmedName.startsWith("-") ||
      trimmedName.endsWith("-") ||
      trimmedName.includes("--")
    ) {
      return {
        valid: false,
        message: `Name '${trimmedName}' cannot start/end with hyphen or contain consecutive hyphens`,
      };
    }
    if (trimmedName.length > 64) {
      return {
        valid: false,
        message: `Name is too long (${trimmedName.length} characters). Maximum is 64 characters.`,
      };
    }
  }

  const description = frontmatter.description;
  if (typeof description !== "string") {
    return {
      valid: false,
      message: `Description must be a string, got ${typeof description}`,
    };
  }

  const trimmedDescription = description.trim();
  if (trimmedDescription) {
    if (trimmedDescription.includes("<") || trimmedDescription.includes(">")) {
      return {
        valid: false,
        message: "Description cannot contain angle brackets (< or >)",
      };
    }
    if (trimmedDescription.length > 1024) {
      return {
        valid: false,
        message: `Description is too long (${trimmedDescription.length} characters). Maximum is 1024 characters.`,
      };
    }
  }

  return { valid: true, message: "Skill is valid!" };
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length !== 1) {
    console.log("Usage: bun run quick-validate.ts <skill_directory>");
    process.exit(1);
  }

  const { valid, message } = validateSkill(args[0]);
  console.log(message);
  process.exit(valid ? 0 : 1);
}

// Only run main when executed directly, not when imported
if (import.meta.main) {
  main();
}
