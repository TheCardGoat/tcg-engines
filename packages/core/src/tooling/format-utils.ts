/**
 * Code formatting utilities
 *
 * Provides functions for formatting TypeScript code using Biome.
 */

import { spawn } from "child_process";
import { promisify } from "util";

const _execPromise = promisify(spawn);

/**
 * Format TypeScript code using Biome
 *
 * @param code - TypeScript code to format
 * @returns Formatted code
 */
export async function formatTypeScript(code: string): Promise<string> {
  try {
    // Use Biome's format command via stdin/stdout
    const biomeProcess = spawn("bunx", [
      "@biomejs/biome",
      "format",
      "--stdin-file-path",
      "_.ts",
    ]);

    let formattedCode = "";
    let errorOutput = "";

    biomeProcess.stdout.on("data", (data) => {
      formattedCode += data.toString();
    });

    biomeProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    // Write code to stdin
    biomeProcess.stdin.write(code);
    biomeProcess.stdin.end();

    // Wait for process to complete
    await new Promise((resolve, reject) => {
      biomeProcess.on("close", (exitCode) => {
        if (exitCode === 0) {
          resolve(formattedCode);
        } else {
          reject(
            new Error(
              `Biome formatting failed: ${errorOutput || "Unknown error"}`,
            ),
          );
        }
      });

      biomeProcess.on("error", (error) => {
        reject(new Error(`Failed to spawn Biome process: ${error.message}`));
      });
    });

    return formattedCode || code;
  } catch (error) {
    // If formatting fails, return original code
    console.warn(
      `Warning: Failed to format code with Biome: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    return code;
  }
}

/**
 * Format JSON with proper indentation
 *
 * @param obj - Object to format as JSON
 * @param indent - Number of spaces for indentation (default: 2)
 * @returns Formatted JSON string
 */
export function formatJSON(obj: unknown, indent = 2): string {
  return JSON.stringify(obj, null, indent);
}
