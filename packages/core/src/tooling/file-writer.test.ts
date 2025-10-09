/**
 * Tests for FileWriter class
 */

import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdir, readFile, rm } from "fs/promises";
import { join } from "path";
import { FileWriter } from "./file-writer";

const TEST_DIR = "/tmp/tcg-tooling-test";

describe("FileWriter", () => {
  beforeEach(async () => {
    await rm(TEST_DIR, { recursive: true, force: true });
    await mkdir(TEST_DIR, { recursive: true });
  });

  afterEach(async () => {
    await rm(TEST_DIR, { recursive: true, force: true });
  });

  test("should write file content", async () => {
    const writer = new FileWriter();
    const filePath = join(TEST_DIR, "test.ts");
    const content = "export const test = 42;";

    await writer.write(filePath, content);

    const written = await readFile(filePath, "utf-8");
    expect(written).toBe(content);
  });

  test("should create directory if it does not exist", async () => {
    const writer = new FileWriter();
    const filePath = join(TEST_DIR, "nested", "dir", "test.ts");
    const content = "export const test = 42;";

    await writer.write(filePath, content);

    const written = await readFile(filePath, "utf-8");
    expect(written).toBe(content);
  });

  test("should write formatted content", async () => {
    const writer = new FileWriter();
    const filePath = join(TEST_DIR, "formatted.ts");
    const content = "export const test={value:42};"; // Unformatted

    await writer.writeFormatted(filePath, content);

    const written = await readFile(filePath, "utf-8");
    // Should be formatted (exact formatting depends on Biome config)
    expect(written).toContain("test");
    expect(written).toContain("42");
  });

  test("should overwrite existing file", async () => {
    const writer = new FileWriter();
    const filePath = join(TEST_DIR, "overwrite.ts");

    await writer.write(filePath, "first content");
    await writer.write(filePath, "second content");

    const written = await readFile(filePath, "utf-8");
    expect(written).toBe("second content");
  });

  test("should write multiple files", async () => {
    const writer = new FileWriter();
    const files = [
      { path: join(TEST_DIR, "file1.ts"), content: "content 1" },
      { path: join(TEST_DIR, "file2.ts"), content: "content 2" },
      { path: join(TEST_DIR, "file3.ts"), content: "content 3" },
    ];

    await writer.writeBatch(files);

    for (const file of files) {
      const written = await readFile(file.path, "utf-8");
      expect(written).toBe(file.content);
    }
  });

  test("should handle errors gracefully", async () => {
    const writer = new FileWriter();
    const filePath = "/root/cannot-write-here.ts"; // Permission denied

    await expect(writer.write(filePath, "content")).rejects.toThrow();
  });

  test("should write to subdirectories", async () => {
    const writer = new FileWriter();
    const files = [
      { path: join(TEST_DIR, "set1", "card1.ts"), content: "card 1" },
      { path: join(TEST_DIR, "set1", "card2.ts"), content: "card 2" },
      { path: join(TEST_DIR, "set2", "card3.ts"), content: "card 3" },
    ];

    await writer.writeBatch(files);

    for (const file of files) {
      const written = await readFile(file.path, "utf-8");
      expect(written).toBe(file.content);
    }
  });
});
