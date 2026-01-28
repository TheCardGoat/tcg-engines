## Tech stack

Define your technical stack below. This serves as a reference for all team members and helps maintain consistency across the project.

### Framework & Runtime
- **Application Framework:** SvelteKit with enhanced image processing
- **Language/Runtime:** TypeScript/JavaScript (Node.js)
- **Package Manager:** bun

### Component Architecture
- **Headless UI:** bits-ui (Radix UI principles)
- **Component Pattern:** Render delegation with class props
- **Accessibility:** WAI-ARIA compliant components

### Frontend
- **JavaScript Framework:** Svelte 5 with runes
- **CSS Framework:** TailwindCSS v4 + @tailwindcss/typography
- **Custom Components:** TCG-specific building blocks

### Images & Media
- **Image Optimization:** @sveltejs/enhanced-img (AVIF/WebP)
- **Responsive Images:** @unpic/svelte (srcset/sizes)
- **Icon System:** @iconify/svelte (275,+ icons)

### Documentation
- **Component Docs:** Storybook v10 with SvelteKit integration
- **Rich Content:** MDX with Svelte components
- **Interactive Examples:** Storybook stories and controls

### Testing & Quality
- **Unit Testing:** Vitest with browser support
- **E2E Testing:** Playwright
- **Browser Testing:** @vitest/browser + vitest-browser-svelte

### Internationalization
- **i18n Framework:** Paraglide.js (7 languages)
- **Message Format:** ICU message formatting

### Build & Distribution
- **Package Builder:** svelte-package + publint
- **Registry:** npm (@tcg/core-ui)
- **Development Tools:** vite-plugin-devtools-json, Lefthook

### Third-Party Integrations
- **Authentication:** Not applicable (component library)
- **Backend APIs:** Not applicable (headless components)
- **External Services:** Not applicable
