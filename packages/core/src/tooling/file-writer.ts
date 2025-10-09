/**
 * File writer for card tooling
 *
 * Handles writing generated card files to disk with formatting support.
 */

import { writeFile } from "fs/promises";
import { ensureDirectory } from "./file-utils";
import { formatTypeScript } from "./format-utils";

/**
 * File writer class for card generation
 *
 * Provides methods for writing card files with optional formatting.
 */
export class FileWriter {
  /**
   * Write content to a file
   *
   * @param filePath - Path to write to
   * @param content - Content to write
   */
  public async write(filePath: string, content: string): Promise<void> {
    await ensureDirectory(filePath);
    await writeFile(filePath, content, "utf-8");
  }

  /**
   * Write content to a file with formatting
   *
   * @param filePath - Path to write to
   * @param content - Content to write (will be formatted)
   */
  public async writeFormatted(
    filePath: string,
    content: string,
  ): Promise<void> {
    const formatted = await formatTypeScript(content);
    await this.write(filePath, formatted);
  }

  /**
   * Write multiple files in batch
   *
   * @param files - Array of files to write
   */
  public async writeBatch(
    files: Array<{ path: string; content: string }>,
  ): Promise<void> {
    await Promise.all(files.map((file) => this.write(file.path, file.content)));
  }

  /**
   * Write multiple files in batch with formatting
   *
   * @param files - Array of files to write (will be formatted)
   */
  public async writeBatchFormatted(
    files: Array<{ path: string; content: string }>,
  ): Promise<void> {
    await Promise.all(
      files.map((file) => this.writeFormatted(file.path, file.content)),
    );
  }
}
