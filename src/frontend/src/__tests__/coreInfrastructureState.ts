import type { MockBackend } from "./mockBackend";

/**
 * Mutable state the module-level mock of `@caffeineai/core-infrastructure`
 * reads from. `vi.mock` is hoisted above imports, so the factory cannot close
 * over a per-test variable; it closes over this holder instead, and each test
 * sets the holder before rendering.
 */
export interface CoreInfrastructureState {
  backend: MockBackend | null;
  isAuthenticated: boolean;
}

export const coreInfrastructureState: CoreInfrastructureState = {
  backend: null,
  isAuthenticated: false,
};

export function resetCoreInfrastructureState(): void {
  coreInfrastructureState.backend = null;
  coreInfrastructureState.isAuthenticated = false;
}
