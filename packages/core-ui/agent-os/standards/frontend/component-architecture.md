## Component architecture best practices

- **Headless Foundation**: Build components on bits-ui as the headless foundation for accessibility and behavior
- **Render Delegation**: Use class props and data attributes for complete styling freedom
- **Composable Design**: Create complex components by combining smaller, focused components
- **Styling Layer**: Apply TailwindCSS classes through component props for consistent theming
- **Icon Integration**: Use @iconify/svelte for all icon needs with consistent naming conventions
- **Image Optimization**: Leverage @unpic/svelte for responsive images and @sveltejs/enhanced-img for automatic optimization
- **Accessibility First**: Ensure all components follow WAI-ARIA standards provided by bits-ui
- **Type Safety**: Use TypeScript interfaces for all component props and exported types
- **Component Variants**: Support multiple variants through props while maintaining headless behavior
- **Extensibility**: Design components to be easily extended by consumers without breaking changes