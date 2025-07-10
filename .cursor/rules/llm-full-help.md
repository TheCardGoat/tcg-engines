# LLM Full File Helper Rule

## Purpose
This rule guides the AI agent to look for and consult `llm-full.txt` files when encountering syntax questions or implementation challenges related to libraries and frameworks.

## When to Apply This Rule
Apply this rule whenever you:
1. Need to understand the syntax of a particular library or framework
2. Are unsure about the correct parameters for a function or method
3. Need examples of how to use an API
4. Are implementing code that uses an external library
5. Need to understand configuration options for a system

## How to Use LLM-Full Files
1. **Locate**: When working in a particular directory or with a specific library, check if there's a `llm-full.txt` file in the related directory
2. **Consult**: Read the `llm-full.txt` file to understand the library's API, configuration options, and syntax
3. **Apply**: Use the information from the file to implement the correct solution
4. **Reference**: If sharing information from the file, mention that it comes from the documentation

For detailed instructions on finding and using llm-full.txt files, see the [Finding and Using llm-full.txt Files](./finding-llm-full-files.md) guide.

## Current LLM-Full Files Available
The repository currently has the following `llm-full.txt` files:
- `packages/persistence/src/drizzle/llm-full.txt` - Contains comprehensive documentation about Drizzle ORM
- `packages/persistence/src/instant/llm-full.txt` - Contains documentation about Instant DB, including common mistakes and best practices

## Format of LLM-Full Files
LLM-Full files typically contain:
- Library documentation
- API references
- Usage examples
- Configuration options
- Best practices

## Benefits of Using LLM-Full Files
- Ensures code correctness and adherence to library conventions
- Reduces the need for trial and error
- Provides access to official documentation directly within the codebase
- Helps maintain consistency across the project

## Example Workflow

When asked to help with a Drizzle ORM implementation:

1. First check for the llm-full.txt file in the Drizzle-related directories
2. Read the file to understand the correct syntax and options
3. Reference the examples in the file to create a properly structured database query
4. Ensure that the implementation follows the patterns shown in the llm-full.txt file
