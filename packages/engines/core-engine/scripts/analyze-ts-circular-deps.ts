#!/usr/bin/env bun

import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative, resolve } from "path";
import * as ts from "typescript";

interface DependencyGraph {
  [file: string]: Set<string>;
}

interface CircularChain {
  files: string[];
  type: "import" | "type" | "mixed";
}

class TypeScriptCircularAnalyzer {
  private program: ts.Program;
  private checker: ts.TypeChecker;
  private dependencies: DependencyGraph = {};
  private typeDependencies: DependencyGraph = {};
  private sourceRoot: string;

  constructor(configPath: string, sourceRoot: string) {
    this.sourceRoot = sourceRoot;

    // Load TypeScript config
    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    const parsedConfig = ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      resolve(configPath, ".."),
    );

    // Create program
    this.program = ts.createProgram(
      parsedConfig.fileNames,
      parsedConfig.options,
    );
    this.checker = this.program.getTypeChecker();
  }

  analyze(): CircularChain[] {
    // Build dependency graph
    for (const sourceFile of this.program.getSourceFiles()) {
      if (
        !sourceFile.isDeclarationFile &&
        sourceFile.fileName.includes(this.sourceRoot)
      ) {
        this.analyzeSourceFile(sourceFile);
      }
    }

    // Find circular dependencies
    return this.findCircularDependencies();
  }

  private analyzeSourceFile(sourceFile: ts.SourceFile): void {
    const fileName = sourceFile.fileName;
    const imports = new Set<string>();
    const typeImports = new Set<string>();

    // Visit all nodes to find imports
    const visit = (node: ts.Node) => {
      if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
        const moduleSpecifier = node.moduleSpecifier;
        if (moduleSpecifier && ts.isStringLiteral(moduleSpecifier)) {
          const importPath = moduleSpecifier.text;

          // Only analyze relative imports
          if (importPath.startsWith(".")) {
            const resolvedPath = this.resolveModulePath(importPath, fileName);
            if (resolvedPath) {
              // Check if it's a type-only import
              if (
                ts.isImportDeclaration(node) &&
                node.importClause?.isTypeOnly
              ) {
                typeImports.add(resolvedPath);
              } else {
                imports.add(resolvedPath);
              }
            }
          }
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    if (imports.size > 0) {
      this.dependencies[fileName] = imports;
    }
    if (typeImports.size > 0) {
      this.typeDependencies[fileName] = typeImports;
    }
  }

  private resolveModulePath(
    importPath: string,
    currentFile: string,
  ): string | null {
    const resolution = ts.resolveModuleName(
      importPath,
      currentFile,
      this.program.getCompilerOptions(),
      ts.sys,
    );

    if (resolution.resolvedModule) {
      return resolution.resolvedModule.resolvedFileName;
    }

    return null;
  }

  private findCircularDependencies(): CircularChain[] {
    const cycles: CircularChain[] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (
      file: string,
      path: string[],
      depGraph: DependencyGraph,
      type: "import" | "type",
    ): void => {
      if (recursionStack.has(file)) {
        const cycleStart = path.indexOf(file);
        if (cycleStart !== -1) {
          const cycle = path.slice(cycleStart);
          cycles.push({
            files: cycle.map((f) => relative(this.sourceRoot, f)),
            type,
          });
        }
        return;
      }

      if (visited.has(file)) {
        return;
      }

      visited.add(file);
      recursionStack.add(file);

      const deps = depGraph[file] || new Set();
      for (const dep of deps) {
        dfs(dep, [...path, file], depGraph, type);
      }

      recursionStack.delete(file);
    };

    // Check import dependencies
    for (const file of Object.keys(this.dependencies)) {
      visited.clear();
      recursionStack.clear();
      dfs(file, [], this.dependencies, "import");
    }

    // Check type dependencies
    for (const file of Object.keys(this.typeDependencies)) {
      visited.clear();
      recursionStack.clear();
      dfs(file, [], this.typeDependencies, "type");
    }

    return cycles;
  }

  printResults(cycles: CircularChain[]): void {
    if (cycles.length === 0) {
      console.log("✅ No circular dependencies found!");
      return;
    }

    console.log(`🔄 Found ${cycles.length} circular dependencies:\n`);

    cycles.forEach((cycle, index) => {
      console.log(
        `${index + 1}. ${cycle.type.toUpperCase()} Circular Dependency:`,
      );
      cycle.files.forEach((file, i) => {
        const arrow = i < cycle.files.length - 1 ? " → " : " → (back to start)";
        console.log(`   ${file}${arrow}`);
      });
      console.log();
    });

    // Print dependency statistics
    console.log("📊 Dependency Statistics:");
    console.log(
      `   Import dependencies: ${Object.keys(this.dependencies).length} files`,
    );
    console.log(
      `   Type dependencies: ${Object.keys(this.typeDependencies).length} files`,
    );

    const totalDeps =
      Object.values(this.dependencies).reduce(
        (sum, deps) => sum + deps.size,
        0,
      ) +
      Object.values(this.typeDependencies).reduce(
        (sum, deps) => sum + deps.size,
        0,
      );
    console.log(`   Total dependencies: ${totalDeps}`);
  }

  // Additional method to show dependency graph for debugging
  printDependencyGraph(): void {
    console.log("\n📋 Import Dependency Graph:");
    for (const [file, deps] of Object.entries(this.dependencies)) {
      const relativeFile = relative(this.sourceRoot, file);
      console.log(`${relativeFile}:`);
      for (const dep of deps) {
        console.log(`  → ${relative(this.sourceRoot, dep)}`);
      }
    }

    if (Object.keys(this.typeDependencies).length > 0) {
      console.log("\n📋 Type Dependency Graph:");
      for (const [file, deps] of Object.entries(this.typeDependencies)) {
        const relativeFile = relative(this.sourceRoot, file);
        console.log(`${relativeFile}:`);
        for (const dep of deps) {
          console.log(`  → ${relative(this.sourceRoot, dep)}`);
        }
      }
    }
  }
}

// Run the analysis
const configPath = resolve(process.cwd(), "tsconfig.json");
const sourceRoot = resolve(process.cwd(), "src");

try {
  const analyzer = new TypeScriptCircularAnalyzer(configPath, sourceRoot);
  const cycles = analyzer.analyze();
  analyzer.printResults(cycles);

  // Uncomment to see full dependency graph
  // analyzer.printDependencyGraph();

  process.exit(cycles.length > 0 ? 1 : 0);
} catch (error) {
  console.error("Analysis failed:", error);
  process.exit(1);
}
