## UI component best practices

- **Headless Foundation**: Build on bits-ui for accessibility and behavior, separate styling from logic
- **Single Responsibility**: Each component should have one clear purpose and do it well
- **Render Delegation**: Use class props and data attributes for complete styling control
- **Composability**: Build complex UIs by combining smaller, focused components
- **Clear Interface**: Define explicit TypeScript interfaces with sensible defaults
- **Icon Integration**: Use @iconify/svelte with consistent prefix:name format (e.g., "mdi:home")
- **Image Handling**: Use @unpic/svelte for responsive images with proper srcset and sizes
- **Accessibility**: Leverage bits-ui's built-in WAI-ARIA compliance and keyboard navigation
- **Styling Freedom**: Apply TailwindCSS classes through component props for theming
- **Storybook Coverage**: Create comprehensive stories with all variants and interaction states
- **Component Variants**: Support multiple states (primary, secondary, destructive) through props
- **Type Safety**: Export TypeScript interfaces for all component props and events
