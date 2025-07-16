# File Organization Component

This component creates structured output with proper naming and directory organization, generating one file per card and one folder per set.

## Purpose

- Generate TypeScript card definition files with proper formatting
- Create set-based directory structure
- Generate index files with proper exports
- Manage file naming conventions and conflict resolution

## Key Interfaces

- `FileOrganizer` - Main interface for file organization functionality
- `FileGenerator` - Creates individual TypeScript card files
- `IndexGenerator` - Creates set-level and master index files
- `DirectoryManager` - Manages set-based folder structure
- `CodeFormatter` - Formats and validates generated TypeScript code

## Directory Structure

```
packages/engines/core-engine/src/game-engine/engines/gundam/src/cards/definitions/
├── ST01/
│   ├── ST01-001-gundam.ts
│   ├── ST01-002-guncannon.ts
│   └── index.ts
├── ST02/
│   ├── ST02-001-wing-gundam-zero.ts
│   └── index.ts
└── index.ts (exports all sets)
```

## Features

- Consistent naming conventions (kebab-case for files)
- Proper TypeScript import/export statements
- Code formatting and syntax validation
- Backup creation for existing files
- Incremental updates with change detection
- Parallel file generation for performance

## Usage

```typescript
const fileOrganizer = new FileOrganizer(config);
const result = await fileOrganizer.generateCardFile(card);
// Generates properly formatted TypeScript file
```