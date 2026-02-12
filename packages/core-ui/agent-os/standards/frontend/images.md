## Image and media best practices

- **Enhanced Images**: Use @sveltejs/enhanced-img for all static images with automatic AVIF/WebP conversion
- **Responsive Images**: Use @unpic/svelte for responsive images requiring custom srcset and sizes
- **Performance Optimization**: Leverage automatic EXIF stripping and intrinsic dimension detection
- **Alt Text**: Always provide descriptive alt text for accessibility
- **Loading Strategy**: Use loading="lazy" for below-fold images, loading="eager" for above-fold critical images
- **Fetch Priority**: Set fetchpriority="high" for important images like hero images
- **Size Attributes**: Always provide width and height for better CLS (Cumulative Layout Shift)
- **Format Fallbacks**: Enhanced images automatically provide fallbacks for browsers that don't support modern formats
- **HiDPI Support**: Provide images at 2x resolution for high-DPI displays
- **Art Direction**: Use responsive images with different crops for different screen sizes when needed
