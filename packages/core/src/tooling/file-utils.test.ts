/**
 * Tests for file utilities
 */

import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { rm, stat } from "fs/promises";
import { join } from "path";
import { createDirectory, ensureDirectory, pathExists } from "./file-utils";

const TEST_DIR = "/tmp/tcg-file-utils-test";

describe("File Utils", () => {
  beforeEach(async () => {
    await rm(TEST_DIR, { recursive: true, force: true });
  });

  afterEach(async () => {
    await rm(TEST_DIR, { recursive: true, force: true });
  });

  describe("ensureDirectory", () => {
    test("should create directory if it does not exist", async () => {
      const dirPath = join(TEST_DIR, "new-dir");

      await ensureDirectory(dirPath);

      const stats = await stat(dirPath);
      expect(stats.isDirectory()).toBe(true);
    });

    test("should not fail if directory already exists", async () => {
      const dirPath = join(TEST_DIR, "existing-dir");

      await ensureDirectory(dirPath);
      await ensureDirectory(dirPath); // Second call should not fail

      const stats = await stat(dirPath);
      expect(stats.isDirectory()).toBe(true);
    });

    test("should create nested directories", async () => {
      const dirPath = join(TEST_DIR, "level1", "level2", "level3");

      await ensureDirectory(dirPath);

      const stats = await stat(dirPath);
      expect(stats.isDirectory()).toBe(true);
    });

    test("should work with file path (create parent directory)", async () => {
      const filePath = join(TEST_DIR, "subdir", "file.ts");

      await ensureDirectory(filePath);

      const parentDir = join(TEST_DIR, "subdir");
      const stats = await stat(parentDir);
      expect(stats.isDirectory()).toBe(true);
    });
  });

  describe("createDirectory", () => {
    test("should create directory", async () => {
      const dirPath = join(TEST_DIR, "created-dir");

      await createDirectory(dirPath);

      const stats = await stat(dirPath);
      expect(stats.isDirectory()).toBe(true);
    });

    test("should create nested directories", async () => {
      const dirPath = join(TEST_DIR, "nested", "directories", "here");

      await createDirectory(dirPath);

      const stats = await stat(dirPath);
      expect(stats.isDirectory()).toBe(true);
    });

    test("should not fail if directory exists", async () => {
      const dirPath = join(TEST_DIR, "duplicate");

      await createDirectory(dirPath);
      await createDirectory(dirPath);

      const stats = await stat(dirPath);
      expect(stats.isDirectory()).toBe(true);
    });
  });

  describe("pathExists", () => {
    test("should return true for existing directory", async () => {
      const dirPath = join(TEST_DIR, "exists");
      await createDirectory(dirPath);

      const exists = await pathExists(dirPath);

      expect(exists).toBe(true);
    });

    test("should return false for non-existing path", async () => {
      const dirPath = join(TEST_DIR, "does-not-exist");

      const exists = await pathExists(dirPath);

      expect(exists).toBe(false);
    });

    test("should return true for existing file", async () => {
      const dirPath = join(TEST_DIR, "file-test");
      await createDirectory(dirPath);

      const { writeFile } = await import("fs/promises");
      const filePath = join(dirPath, "test.txt");
      await writeFile(filePath, "content");

      const exists = await pathExists(filePath);

      expect(exists).toBe(true);
    });
  });
});
