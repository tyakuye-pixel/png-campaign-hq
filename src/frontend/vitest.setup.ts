import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import { coreInfrastructureState } from "./src/__tests__/coreInfrastructureState";

// The app's hooks call `useActor`/`useInternetIdentity` from this package. Mock
// it at the module boundary so tests drive the real hooks and pages against a
// typed local actor mock, with no network or canister. The factory reads a
// mutable holder because `vi.mock` is hoisted above the test file's imports.
vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({
    actor: coreInfrastructureState.backend,
    isFetching: false,
  }),
  useInternetIdentity: () => ({
    identity: coreInfrastructureState.isAuthenticated
      ? { getPrincipal: () => ({ toText: () => "aaaaa-bbbbb-ccccc" }) }
      : undefined,
    isAuthenticated: coreInfrastructureState.isAuthenticated,
    login: vi.fn(),
    clear: vi.fn(),
    loginStatus: coreInfrastructureState.isAuthenticated ? "success" : "idle",
    isInitializing: false,
    isLoginIdle: !coreInfrastructureState.isAuthenticated,
    isLoggingIn: false,
    isLoginSuccess: coreInfrastructureState.isAuthenticated,
    isLoginError: false,
  }),
  InternetIdentityProvider: ({ children }: { children: unknown }) => children,
}));

// Recharts' ResponsiveContainer measures its parent, which jsdom reports as 0x0
// and which would render no chart at all. Give every element a non-zero box so
// the chart components mount and render their SVG.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!("ResizeObserver" in globalThis)) {
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver =
    ResizeObserverStub;
}

Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
  configurable: true,
  value: 800,
});
Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
  configurable: true,
  value: 400,
});
Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
  configurable: true,
  value: () => ({
    width: 800,
    height: 400,
    top: 0,
    left: 0,
    right: 800,
    bottom: 400,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  }),
});

// Radix UI primitives call these pointer-capture APIs, which jsdom does not
// implement. Without them, opening a Select throws
// "target.hasPointerCapture is not a function".
if (!HTMLElement.prototype.hasPointerCapture) {
  HTMLElement.prototype.hasPointerCapture = () => false;
}
if (!HTMLElement.prototype.setPointerCapture) {
  HTMLElement.prototype.setPointerCapture = () => {};
}
if (!HTMLElement.prototype.releasePointerCapture) {
  HTMLElement.prototype.releasePointerCapture = () => {};
}
if (!HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = () => {};
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
