# Finding and Using llm-full.txt Files

## Overview

The project uses `llm-full.txt` files to store comprehensive documentation about specific libraries and tools used in the codebase. These files are meant to be consulted by AI assistants when working with their respective libraries or tools.

## How to Find llm-full.txt Files

1. **Search the repository**: When working with a specific library or framework, first look for an `llm-full.txt` file in the associated directory:
   ```
   grep_search -p "llm-full.txt"
   ```

2. **Check common locations**:
   - Within the library's package directory (`packages/[library-name]/src/llm-full.txt`)
   - In documentation directories (`docs/llm/`)
   - In the module directory where the library is most commonly used

3. **Look near related code**: If working with a specific library like Drizzle ORM, check directories related to database operations.

## Currently Known llm-full.txt Files

- `packages/persistence/src/drizzle/llm-full.txt` - Contains comprehensive documentation about Drizzle ORM
- `packages/persistence/src/instant/llm-full.txt` - Contains documentation about Instant DB, including common mistakes and best practices

## How to Use llm-full.txt Files

1. **Read thoroughly**: Before working with a library, read the entire llm-full.txt file to understand its concepts and API
2. **Consult for syntax**: Use the file as a reference for correct syntax when writing code using the library
3. **Check for examples**: Many llm-full.txt files include examples that can be adapted to the current task
4. **Cross-reference with code**: When encountering existing code that uses a library, check the llm-full.txt file to understand how it works

## When to Create New llm-full.txt Files

If you find that AI assistance could be improved with better documentation for a specific library or tool:

1. Suggest creating a new llm-full.txt file with comprehensive documentation
2. Recommend including:
   - API reference
   - Common usage patterns
   - Configuration options
   - Best practices
   - Examples 