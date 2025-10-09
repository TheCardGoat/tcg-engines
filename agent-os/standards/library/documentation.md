---
description: Documentation standards for library packages
globs: **/README.md, **/*.md, **/*.ts
alwaysApply: true
---

# Documentation Standards

## README.md Structure
- **Title and Description**: Clear, concise description of what the library does
- **Badges**: Status badges (build, coverage, version, downloads, license)
- **Installation**: Clear installation instructions with package manager examples
- **Quick Start**: Minimal example showing basic usage
- **Features**: Bullet list of key features and capabilities
- **API Documentation**: Link to detailed API docs or include inline
- **Examples**: Multiple examples showing common use cases
- **Configuration**: Document configuration options if applicable
- **Contributing**: Link to CONTRIBUTING.md for contribution guidelines
- **License**: Specify license clearly

## Code Documentation
- **JSDoc Comments**: Document all public exports with JSDoc
- **Type Descriptions**: Describe complex types and their purpose
- **Parameter Documentation**: Document each parameter with @param tags
- **Return Documentation**: Document return values with @returns tags
- **Examples in Code**: Include @example tags with usage examples
- **Links**: Use @see tags to link related functionality
- **Deprecation**: Mark deprecated APIs with @deprecated tag and migration path

## API Documentation
- **Reference Documentation**: Complete API reference for all public exports
- **Type Documentation**: Full type information for TypeScript consumers
- **Method Signatures**: Clear function/method signatures with descriptions
- **Property Documentation**: Document all public properties and fields
- **Usage Examples**: Show real-world usage for each API
- **Edge Cases**: Document edge cases and limitations
- **Default Values**: Clearly state default values for optional parameters

## Usage Examples
- **Quick Start**: Minimal example for immediate value
- **Common Use Cases**: Examples for typical scenarios
- **Advanced Usage**: Examples showing advanced features
- **Integration Examples**: Show integration with popular frameworks/tools
- **Complete Examples**: Full working examples in examples/ directory
- **Code Comments**: Comment examples to explain what's happening
- **Runnable Examples**: Ensure examples actually work and are tested

## Guide Documentation
- **Getting Started**: Step-by-step guide for new users
- **Core Concepts**: Explain fundamental concepts and architecture
- **Recipes**: Common patterns and solutions
- **Best Practices**: Recommended approaches and patterns
- **Migration Guides**: Guide for upgrading between major versions
- **Troubleshooting**: Common issues and solutions
- **FAQ**: Frequently asked questions and answers

## Type Documentation
- **Type Exports**: Document all exported types clearly
- **Generic Parameters**: Explain generic type parameters and constraints
- **Type Examples**: Show type usage examples in JSDoc
- **Complex Types**: Break down complex types with explanations
- **Type Aliases**: Document why type aliases exist and when to use them
- **Utility Types**: Document custom utility types provided

## Configuration Documentation
- **Options Reference**: Complete reference for all configuration options
- **Default Configuration**: Document default values clearly
- **Configuration Examples**: Show common configuration patterns
- **Environment Variables**: Document any environment variables
- **Runtime Configuration**: Explain runtime configuration options
- **Validation**: Document configuration validation rules

## Integration Documentation
- **Framework Integration**: Document integration with popular frameworks (React, Vue, etc.)
- **Build Tool Setup**: Document bundler/build tool configuration
- **TypeScript Setup**: Document TypeScript configuration requirements
- **Compatibility**: Document compatibility with other libraries
- **Peer Dependencies**: Explain peer dependency requirements
- **Migration from Alternatives**: Guide from competing libraries

## Change Documentation
- **CHANGELOG.md**: Maintain comprehensive changelog
- **Breaking Changes**: Clearly document all breaking changes
- **Migration Guides**: Provide step-by-step migration instructions
- **Deprecation Notices**: Document deprecated features with alternatives
- **Release Notes**: Write clear release notes for each version
- **Upgrade Paths**: Document supported upgrade paths

## Error Documentation
- **Error Messages**: Document possible error messages
- **Error Handling**: Show how to handle errors properly
- **Error Types**: Document custom error types and when they're thrown
- **Troubleshooting**: Common errors and solutions
- **Debug Mode**: Document debugging features if available
- **Support Channels**: Where to get help with errors

## Performance Documentation
- **Performance Characteristics**: Document time/space complexity where relevant
- **Optimization Tips**: Best practices for performance
- **Benchmarks**: Include benchmark results if relevant
- **Bundle Size**: Document package size and impact
- **Tree-Shaking**: Explain tree-shaking support
- **Lazy Loading**: Document lazy loading capabilities

## Contributing Documentation
- **CONTRIBUTING.md**: Detailed contribution guidelines
- **Development Setup**: How to set up development environment
- **Code Style**: Code style requirements and linting setup
- **Testing**: How to run tests and add new tests
- **Pull Request Process**: PR requirements and review process
- **Release Process**: How releases are managed (for maintainers)
- **Code of Conduct**: Community guidelines and expectations

## Documentation Quality
- **Accuracy**: Keep documentation in sync with code
- **Completeness**: Document all public APIs comprehensively
- **Clarity**: Write clear, concise documentation
- **Examples**: Include examples for every major feature
- **Grammar**: Use proper grammar and spelling
- **Consistency**: Maintain consistent style and terminology
- **Up-to-Date**: Update docs with every release

## Documentation Tools
- **TypeDoc**: Consider TypeDoc for generating API documentation
- **Docusaurus**: Use for comprehensive documentation sites
- **JSDoc**: Use for inline code documentation
- **Markdown**: Use markdown for all documentation files
- **Code Playground**: Consider interactive code playgrounds
- **Search**: Implement search for large documentation sites

## Inline Comments
- **Public APIs Only**: Only JSDoc for public exports - avoid inline comments
- **Self-Documenting Code**: Prefer clear naming over comments
- **Complex Logic**: Comment only when logic is unavoidably complex
- **Why Over What**: Explain why, not what (code shows what)
- **TODO Comments**: Avoid in published code - use issue tracker
- **License Headers**: Include license headers if required

## Documentation Testing
- **Code Examples**: Test that all code examples work
- **Link Checking**: Verify all links work
- **Spelling**: Run spell checker on documentation
- **Type Checking**: Ensure TypeScript examples type-check
- **Build Docs**: Verify documentation builds without errors
- **Regular Review**: Review and update docs regularly

## Accessibility
- **Clear Language**: Use clear, simple language
- **Code Block Labels**: Label code blocks with language
- **Alt Text**: Include alt text for images
- **Semantic Structure**: Use proper heading hierarchy
- **Skip Links**: Consider skip navigation links
- **Screen Reader Friendly**: Test with screen readers if possible

## Internationalization
- **English First**: Primary documentation in English
- **Translation Support**: Consider i18n for wider adoption
- **Community Translations**: Allow community translations
- **Localization**: Localize examples and content appropriately
- **Language Switcher**: Implement language selection if multi-lingual

## Common Pitfalls
- **Outdated Examples**: Keep examples updated with API changes
- **Missing Edge Cases**: Document limitations and edge cases
- **Assumed Knowledge**: Don't assume prior knowledge
- **Over-Documentation**: Focus on what users need, not implementation details
- **Poor Examples**: Ensure examples are practical and realistic
- **Broken Links**: Regularly check for broken links
- **Inconsistent Terminology**: Use consistent terms throughout
