#!/usr/bin/env bun
/**
 * Type Usage Analysis Script
 *
 * This script analyzes the core-engine codebase to identify:
 * 1. All type definition locations
 * 2. Import patterns and dependencies
 * 3. Usage patterns for key types (PlayerID, InstanceId, etc.)
 */

import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";

interface TypeDefinition {
  name: string;
  file: string;
  line: number;
  definition: string;
  isExported: boolean;
}

interface TypeUsage {
  name: string;
  file: string;
  line: number;
  context: "import" | "type-import" | "usage" | "export";
  source?: string; // For imports, where it's imported from
}

interface FileAnalysis {
  file: string;
  definitions: TypeDefinition[];
  usages: TypeUsage[];
  imports: string[];
  exports: string[];
}

class TypeAnalyzer {
  private readonly sourceDir = "packages/engines/core-engine/src";
  private readonly targetTypes = [
    "PlayerID",
    "PlayerId",
    "InstanceId",
    "CardInstanceID",
    "PublicId",
    "ZoneId",
    "GameCards",
  ];

  private files: string[] = [];
  private analysis: FileAnalysis[] = [];

  constructor() {
    this.collectFiles();
  }

  private collectFiles(dir: string = this.sourceDir): void {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        this.collectFiles(fullPath);
      } else if (entry.endsWith(".ts") && !entry.endsWith(".d.ts")) {
        this.files.push(fullPath);
      }
    }
  }

  private analyzeFile(filePath: string): FileAnalysis {
    const content = readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    const relativePath = relative(process.cwd(), filePath);

    const analysis: FileAnalysis = {
      file: relativePath,
      definitions: [],
      usages: [],
      imports: [],
      exports: [],
    };

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Find type definitions
      const typeDefMatch = line.match(/^\s*(export\s+)?type\s+(\w+)\s*=/);
      if (typeDefMatch) {
        const [, exportKeyword, typeName] = typeDefMatch;
        if (this.targetTypes.includes(typeName)) {
          analysis.definitions.push({
            name: typeName,
            file: relativePath,
            line: lineNum,
            definition: line.trim(),
            isExported: !!exportKeyword,
          });
        }
      }

      // Find imports
      const importMatch = line.match(
        /import\s+(type\s+)?\{([^}]+)\}\s+from\s+["']([^"']+)["']/,
      );
      if (importMatch) {
        const [, typeOnly, imports, source] = importMatch;
        const importedTypes = imports.split(",").map((s) => s.trim());

        for (const importedType of importedTypes) {
          const cleanType = importedType.replace(/\s+as\s+\w+/, "").trim();
          if (this.targetTypes.includes(cleanType)) {
            analysis.usages.push({
              name: cleanType,
              file: relativePath,
              line: lineNum,
              context: typeOnly ? "type-import" : "import",
              source,
            });
          }
        }

        analysis.imports.push(line.trim());
      }

      // Find exports
      const exportMatch = line.match(/export\s+(type\s+)?\{([^}]+)\}/);
      if (exportMatch) {
        analysis.exports.push(line.trim());
      }

      // Find type usage in code
      for (const targetType of this.targetTypes) {
        const usageRegex = new RegExp(`\\b${targetType}\\b`, "g");
        if (
          usageRegex.test(line) &&
          !line.includes("import") &&
          !line.includes("export") &&
          !line.includes("type ")
        ) {
          analysis.usages.push({
            name: targetType,
            file: relativePath,
            line: lineNum,
            context: "usage",
          });
        }
      }
    });

    return analysis;
  }

  public analyze(): void {
    console.log("🔍 Analyzing type usage across core-engine codebase...\n");

    for (const file of this.files) {
      this.analysis.push(this.analyzeFile(file));
    }
  }

  public generateReport(): void {
    console.log("📊 TYPE USAGE ANALYSIS REPORT");
    console.log("=".repeat(50));

    // Summary statistics
    const totalFiles = this.analysis.length;
    const filesWithDefinitions = this.analysis.filter(
      (a) => a.definitions.length > 0,
    ).length;
    const filesWithUsages = this.analysis.filter(
      (a) => a.usages.length > 0,
    ).length;

    console.log("\n📈 SUMMARY STATISTICS");
    console.log(`Total TypeScript files analyzed: ${totalFiles}`);
    console.log(`Files with type definitions: ${filesWithDefinitions}`);
    console.log(`Files with type usages: ${filesWithUsages}`);

    // Type definitions by type
    console.log("\n🏗️  TYPE DEFINITIONS BY TYPE");
    for (const targetType of this.targetTypes) {
      const definitions = this.analysis
        .flatMap((a) => a.definitions)
        .filter((d) => d.name === targetType);
      console.log(`\n${targetType}:`);
      if (definitions.length === 0) {
        console.log("  ❌ No definitions found");
      } else {
        definitions.forEach((def) => {
          console.log(
            `  📍 ${def.file}:${def.line} ${def.isExported ? "(exported)" : "(local)"}`,
          );
          console.log(`     ${def.definition}`);
        });
      }
    }

    // Import patterns
    console.log("\n📥 IMPORT PATTERNS");
    for (const targetType of this.targetTypes) {
      const imports = this.analysis
        .flatMap((a) => a.usages)
        .filter(
          (u) =>
            u.name === targetType &&
            (u.context === "import" || u.context === "type-import"),
        );

      if (imports.length > 0) {
        console.log(`\n${targetType} imports:`);
        const importSources = new Map<string, number>();
        imports.forEach((imp) => {
          const source = imp.source || "unknown";
          importSources.set(source, (importSources.get(source) || 0) + 1);
        });

        for (const [source, count] of importSources.entries()) {
          console.log(`  📦 ${source} (${count} files)`);
        }
      }
    }

    // Files with multiple definitions of same type
    console.log("\n⚠️  DUPLICATE TYPE DEFINITIONS");
    for (const targetType of this.targetTypes) {
      const definitions = this.analysis
        .flatMap((a) => a.definitions)
        .filter((d) => d.name === targetType);
      if (definitions.length > 1) {
        console.log(`\n${targetType} defined in ${definitions.length} files:`);
        definitions.forEach((def) => {
          console.log(`  🔄 ${def.file}:${def.line}`);
        });
      }
    }

    // Circular dependency analysis
    console.log("\n🔄 IMPORT DEPENDENCY ANALYSIS");
    const importGraph = new Map<string, Set<string>>();

    this.analysis.forEach((fileAnalysis) => {
      const deps = new Set<string>();
      fileAnalysis.usages
        .filter((u) => u.context === "import" || u.context === "type-import")
        .forEach((u) => {
          if (u.source) {
            deps.add(u.source);
          }
        });
      importGraph.set(fileAnalysis.file, deps);
    });

    // Find potential circular dependencies
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const cycles: string[][] = [];

    const findCycles = (file: string, path: string[]): void => {
      if (recursionStack.has(file)) {
        const cycleStart = path.indexOf(file);
        if (cycleStart !== -1) {
          cycles.push(path.slice(cycleStart));
        }
        return;
      }

      if (visited.has(file)) return;

      visited.add(file);
      recursionStack.add(file);
      path.push(file);

      const deps = importGraph.get(file) || new Set();
      for (const dep of deps) {
        // Convert relative imports to file paths for analysis
        if (dep.startsWith(".") || dep.startsWith("~")) {
          findCycles(dep, [...path]);
        }
      }

      recursionStack.delete(file);
      path.pop();
    };

    for (const file of importGraph.keys()) {
      if (!visited.has(file)) {
        findCycles(file, []);
      }
    }

    if (cycles.length > 0) {
      console.log("Found potential circular dependencies:");
      cycles.forEach((cycle, index) => {
        console.log(`  ${index + 1}. ${cycle.join(" → ")}`);
      });
    } else {
      console.log("✅ No obvious circular dependencies detected");
    }

    // Recommendations
    console.log("\n💡 RECOMMENDATIONS");
    console.log("1. Consolidate duplicate type definitions to core-types.ts");
    console.log("2. Update all imports to use centralized types");
    console.log("3. Use type-only imports where appropriate");
    console.log("4. Remove unused local type definitions");
    console.log("5. Standardize import paths and patterns");
  }
}

// Run the analysis
const analyzer = new TypeAnalyzer();
analyzer.analyze();
analyzer.generateReport();
