/**
 * File system utilities for card tooling
 *
 * Provides helper functions for directory management and file operations.
 */

import { access, mkdir } from "fs/promises";
import { dirname } from "path";

/**
 * Ensure a directory exists, creating it if necessary
 *
 * This function is path-aware: it will create the parent directory
 * if the path appears to be a file path.
 *
 * @param path - Directory path or file path
 */
export async function ensureDirectory(path: string): Promise<void> {
  const dir = path.endsWith(".ts") || path.includes(".") ? dirname(path) : path;
  await mkdir(dir, { recursive: true });
}

/**
 * Create a directory if it doesn't exist
 *
 * @param path - Directory path to create
 */
export async function createDirectory(path: string): Promise<void> {
  await mkdir(path, { recursive: true });
}

/**
 * Check if a path exists
 *
 * @param path - Path to check
 * @returns True if path exists, false otherwise
 */
export async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
