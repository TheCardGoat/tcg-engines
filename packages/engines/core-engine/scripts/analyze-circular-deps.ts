#!/usr/bin/env bun

import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative, resolve } from "path";

interface ImportInfo {
  file: string;
  imports: string[];
}

interface CircularDependency {
  cycle: string[];
  depth: number;
}

class CircularDependencyAnalyzer {
  private imports = new Map<string, Set<string>>();
  private visited = new Set<string>();
  private recursionStack = new Set<string>();
  private cycles: CircularDependency[] = [];

  constructor(private rootDir: string) {}

  analyze(): CircularDependency[] {
    this.scanDirectory(this.rootDir);
    this.findCycles();
    return this.cycles;
  }

  private scanDirectory(dir: string): void {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (
        stat.isDirectory() &&
        !entry.startsWith(".") &&
        entry !== "node_modules"
      ) {
        this.scanDirectory(fullPath);
      } else if (entry.endsWith(".ts") && !entry.endsWith(".d.ts")) {
        this.analyzeFile(fullPath);
      }
    }
  }

  private analyzeFile(filePath: string): void {
    try {
      const content = readFileSync(filePath, "utf-8");
      const imports = this.extractImports(content, filePath);

      if (imports.length > 0) {
        this.imports.set(filePath, new Set(imports));
      }
    } catch (error) {
      console.warn(`Failed to analyze ${filePath}:`, error);
    }
  }

  private extractImports(content: string, currentFile: string): string[] {
    const imports: string[] = [];
    const importRegex =
      /import\s+(?:(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"`]([^'"`]+)['"`]|['"`]([^'"`]+)['"`])/g;

    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1] || match[2];

      // Only analyze relative imports (local files)
      if (importPath.startsWith(".")) {
        const resolvedPath = this.resolveImportPath(importPath, currentFile);
        if (resolvedPath) {
          imports.push(resolvedPath);
        }
      }
    }

    return imports;
  }

  private resolveImportPath(
    importPath: string,
    currentFile: string,
  ): string | null {
    const currentDir = resolve(currentFile, "..");
    const resolvedPath = resolve(currentDir, importPath);

    // Try different extensions
    const extensions = [".ts", ".tsx", "/index.ts", "/index.tsx"];

    for (const ext of extensions) {
      const testPath = resolvedPath + ext;
      try {
        if (statSync(testPath).isFile()) {
          return testPath;
        }
      } catch {
        // File doesn't exist, continue
      }
    }

    return null;
  }

  private findCycles(): void {
    for (const file of this.imports.keys()) {
      if (!this.visited.has(file)) {
        this.dfs(file, []);
      }
    }
  }

  private dfs(file: string, path: string[]): void {
    if (this.recursionStack.has(file)) {
      // Found a cycle
      const cycleStart = path.indexOf(file);
      if (cycleStart !== -1) {
        const cycle = path.slice(cycleStart).concat([file]);
        this.cycles.push({
          cycle: cycle.map((f) => relative(this.rootDir, f)),
          depth: cycle.length - 1,
        });
      }
      return;
    }

    if (this.visited.has(file)) {
      return;
    }

    this.visited.add(file);
    this.recursionStack.add(file);
    path.push(file);

    const dependencies = this.imports.get(file) || new Set();
    for (const dep of dependencies) {
      this.dfs(dep, [...path]);
    }

    this.recursionStack.delete(file);
    path.pop();
  }

  printResults(): void {
    if (this.cycles.length === 0) {
      console.log("✅ No circular dependencies found!");
      return;
    }

    console.log(`🔄 Found ${this.cycles.length} circular dependencies:\n`);

    // Sort by depth (shorter cycles first)
    this.cycles.sort((a, b) => a.depth - b.depth);

    this.cycles.forEach((cycle, index) => {
      console.log(`${index + 1}. Cycle (depth ${cycle.depth}):`);
      cycle.cycle.forEach((file, i) => {
        const arrow = i < cycle.cycle.length - 1 ? " → " : "";
        console.log(`   ${file}${arrow}`);
      });
      console.log();
    });
  }
}

// Run the analysis
const rootDir = resolve(process.cwd(), "src");
const analyzer = new CircularDependencyAnalyzer(rootDir);
const cycles = analyzer.analyze();
analyzer.printResults();

// Exit with error code if cycles found
process.exit(cycles.length > 0 ? 1 : 0);
