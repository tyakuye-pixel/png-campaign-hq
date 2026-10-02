// Loads the `@testing-library/jest-dom` matcher augmentations for Vitest's
// `Assertion` interface into the app's TypeScript project. The runtime setup
// file (`vitest.setup.ts`) imports the same module, but it lives outside
// `tsconfig.json`'s `include` (`src`), so `tsc --noEmit` never sees it and the
// matchers (`toBeInTheDocument`, `toHaveTextContent`, …) would otherwise be
// reported as missing on `expect(...)`.
import "@testing-library/jest-dom/vitest";
