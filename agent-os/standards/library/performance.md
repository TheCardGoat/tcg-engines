---
description: Performance and optimization standards for library packages
globs: **/*.ts, **/package.json
alwaysApply: true
---

# Performance and Optimization Standards

## Bundle Size
- **Minimize Package Size**: Keep published package as small as possible
- **Exclude Development Files**: Never include dev files, tests, or configs in package
- **Analyze Bundle Size**: Use tools like bundlephobia to track size
- **Size Budgets**: Set and enforce bundle size budgets
- **Size Reporting**: Report bundle size in documentation and CI/CD
- **Compare Alternatives**: Benchmark against similar libraries

## Tree-Shaking
- **ESM Format**: Publish ESM format for optimal tree-shaking
- **Side Effects**: Set sideEffects: false if library has no side effects
- **Pure Annotations**: Use /*#__PURE__*/ annotations for functions with no side effects
- **No Default Exports**: Prefer named exports for better tree-shaking
- **Modular Structure**: Keep modules small and focused
- **Test Tree-Shaking**: Verify unused code is eliminated by bundlers

## Code Splitting
- **Subpath Exports**: Enable code splitting through subpath exports
- **Modular Entry Points**: Provide multiple entry points for different features
- **Lazy Loading Support**: Design APIs to support lazy loading
- **Dynamic Imports**: Support dynamic imports where appropriate
- **Feature Modules**: Split features into separate importable modules
- **Core vs Extensions**: Separate core from optional extensions

## Runtime Performance
- **Algorithmic Efficiency**: Use optimal algorithms and data structures
- **Avoid Premature Optimization**: Profile before optimizing
- **Fast Defaults**: Make default configuration performant
- **Lazy Initialization**: Defer expensive initialization until needed
- **Memoization**: Cache expensive computation results appropriately
- **Avoid Repeated Work**: Don't recalculate what can be cached

## Memory Management
- **Avoid Memory Leaks**: Clean up resources, event listeners, subscriptions
- **WeakMap/WeakSet**: Use weak references where appropriate
- **Release Resources**: Provide cleanup/dispose methods for stateful objects
- **Avoid Large Closures**: Minimize closure size and scope
- **Pool Objects**: Consider object pooling for frequently created objects
- **Monitor Memory**: Test for memory leaks with long-running scenarios

## Dependency Management
- **Minimize Dependencies**: Only include necessary dependencies
- **Evaluate Dependency Size**: Consider size of dependencies
- **Tree-Shakeable Dependencies**: Prefer dependencies that tree-shake well
- **Zero Dependencies**: Consider zero-dependency approach when feasible
- **Shared Dependencies**: Use peer dependencies for commonly shared packages
- **Dependency Audits**: Regularly audit and update dependencies

## Load Time Performance
- **Fast Initialization**: Minimize work during module initialization
- **Defer Side Effects**: Avoid side effects at module load time
- **Lazy Load Heavy Features**: Load expensive features on demand
- **Async Initialization**: Support async initialization patterns
- **Progressive Enhancement**: Load features progressively as needed
- **Preload Critical Resources**: Preload critical resources if applicable

## Build Optimization
- **Minification**: Generally let consumers handle minification
- **Dead Code Elimination**: Remove unreachable code during build
- **Constant Folding**: Fold constants at build time when possible
- **Inline Small Functions**: Consider inlining small, frequently used functions
- **Optimize Imports**: Structure imports for optimal tree-shaking
- **Build Performance**: Keep build times reasonable

## Type System Performance
- **Simple Types**: Avoid overly complex type computations
- **Recursive Type Limits**: Be mindful of recursive type depth
- **Type Compilation**: Ensure reasonable TypeScript compilation times
- **Type Caching**: Structure types to enable TypeScript caching
- **Conditional Type Complexity**: Limit conditional type complexity
- **Generic Constraints**: Use appropriate constraints to help inference

## API Performance
- **Efficient API Design**: Design APIs that enable efficient use
- **Batch Operations**: Provide batch APIs for bulk operations
- **Streaming Support**: Support streaming for large data sets
- **Pagination**: Support pagination for large result sets
- **Incremental Processing**: Enable incremental processing where applicable
- **Abort Support**: Support operation cancellation/abort

## Benchmarking
- **Performance Tests**: Include performance tests in test suite
- **Benchmark Suite**: Create benchmark suite for critical operations
- **Baseline Benchmarks**: Establish baseline performance metrics
- **Regression Detection**: Detect performance regressions in CI/CD
- **Comparative Benchmarks**: Compare against alternative implementations
- **Real-World Scenarios**: Benchmark realistic use cases

## Browser Performance
- **Main Thread**: Minimize main thread blocking
- **Web Workers**: Consider Web Worker support for heavy operations
- **RequestIdleCallback**: Use idle callbacks for non-critical work
- **Passive Event Listeners**: Use passive listeners where appropriate
- **Layout Thrashing**: Avoid layout thrashing in DOM operations
- **Paint Performance**: Minimize repaints and reflows

## Network Performance
- **CDN Delivery**: Consider CDN distribution for browser libraries
- **Compression**: Ensure gzip/brotli compression is effective
- **HTTP/2**: Optimize for HTTP/2 delivery
- **Resource Hints**: Support preload/prefetch hints
- **Caching Headers**: Recommend appropriate caching strategies
- **Incremental Loading**: Support incremental loading patterns

## Monitoring and Profiling
- **Performance Markers**: Use Performance API markers for profiling
- **Metrics Collection**: Collect key performance metrics
- **Profiling Support**: Make library easy to profile
- **Debug Mode**: Provide debug mode without performance overhead in production
- **Telemetry**: Consider optional performance telemetry
- **Performance Budget**: Set and track performance budgets

## Optimization Strategies
- **Lazy Evaluation**: Defer computation until results are needed
- **Caching**: Cache expensive computations and results
- **Batching**: Batch operations to reduce overhead
- **Debouncing/Throttling**: Provide utilities for rate limiting
- **Virtualization**: Support virtual lists/trees for large data sets
- **Incremental Updates**: Support incremental rather than full updates

## Documentation Performance
- **Document Performance**: Document performance characteristics
- **Big-O Notation**: Include time/space complexity where relevant
- **Performance Tips**: Provide performance best practices
- **Optimization Guide**: Guide consumers on optimization
- **Known Limitations**: Document known performance limitations
- **Benchmarks**: Share benchmark results and methodology

## Common Performance Pitfalls
- **Premature Optimization**: Don't optimize without profiling
- **Over-Engineering**: Keep it simple first, optimize later
- **Micro-Optimizations**: Focus on algorithmic improvements first
- **Unnecessary Dependencies**: Don't add dependencies without evaluation
- **Blocking Operations**: Avoid synchronous blocking operations
- **Memory Leaks**: Always clean up resources properly
- **Bundle Bloat**: Regularly audit and reduce bundle size

## Performance Testing
- **Load Testing**: Test with large data sets
- **Stress Testing**: Test under high load conditions
- **Memory Testing**: Test for memory leaks and growth
- **CPU Profiling**: Profile CPU usage for hot paths
- **Bundle Analysis**: Analyze bundle size and composition
- **Comparative Testing**: Compare against alternatives

## Platform Considerations
- **Node.js Performance**: Optimize for Node.js event loop
- **Browser Performance**: Optimize for browser rendering pipeline
- **Mobile Performance**: Consider mobile device constraints
- **Low-End Devices**: Test on low-end devices
- **Network Conditions**: Test on slow networks
- **Resource Constraints**: Handle limited memory/CPU gracefully

## Optimization Checklist
- [ ] Bundle size is minimal and documented
- [ ] Tree-shaking works correctly
- [ ] No memory leaks in long-running usage
- [ ] Fast initialization and load time
- [ ] Efficient algorithms and data structures
- [ ] Minimal and carefully chosen dependencies
- [ ] Performance tests in test suite
- [ ] Performance characteristics documented
- [ ] Benchmarks available for critical operations
- [ ] Performance regressions detected in CI/CD

## Advanced Optimizations
- **WASM Integration**: Consider WebAssembly for CPU-intensive operations
- **Worker Threads**: Use worker threads for parallel processing
- **Streaming APIs**: Implement streaming for large data processing
- **Incremental Computation**: Support incremental updates
- **Code Generation**: Generate optimized code at build time
- **JIT Optimization**: Structure code for JIT optimization

## Performance Culture
- **Profile Before Optimizing**: Always measure before optimizing
- **Performance Reviews**: Include performance in code reviews
- **Performance Metrics**: Track key performance indicators
- **Performance Goals**: Set clear performance objectives
- **Continuous Monitoring**: Monitor performance over time
- **User Experience**: Optimize for perceived performance
