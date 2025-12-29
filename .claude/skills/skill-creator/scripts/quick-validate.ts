#!/usr/bin/env bun
/**
 * Quick validation script for skills - minimal version
 */

import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parse as parseYaml } from "yaml";

interface ValidationResult {
  valid: boolean;
  message: string;
}

interface Frontmatter {
  name?: unknown;
  description?: unknown;
  license?: unknown;
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
    frontmatter = parseYaml(frontmatterText) as Frontmatter;
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

main();
