import { resetCoreInfrastructureState } from "@/__tests__/coreInfrastructureState";
import {
  createMockBackend,
  makeActivity,
  makeElectorate,
} from "@/__tests__/mockBackend";
import { renderApp } from "@/__tests__/renderApp";
import { screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

afterEach(() => {
  resetCoreInfrastructureState();
});

const electorates = [
  makeElectorate({
    id: 1n,
    name: "Moresby North-East",
    province: "National Capital District",
    region: "Southern",
    registeredVoters: 62_000n,
  }),
  makeElectorate({
    id: 2n,
    name: "Lae",
    province: "Morobe",
    region: "Momase",
    registeredVoters: 48_000n,
  }),
];

describe("NationalOverviewPage", () => {
  it("renders national totals and the breakdown charts", async () => {
    const { backend } = createMockBackend({
      electorates,
      activities: [
        makeActivity({
          id: 1n,
          electorateId: 1n,
          description: "Door-knock in the capital",
        }),
      ],
    });

    renderApp({ backend, initialPath: "/" });

    expect(
      await screen.findByRole("heading", { name: "National Overview" }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Electorates Tracked")).toBeInTheDocument();
    });
    expect(screen.getByText("Provinces")).toBeInTheDocument();
    expect(screen.getByText("Registered Voters")).toBeInTheDocument();
    expect(screen.getByText("Activities Logged")).toBeInTheDocument();

    // Two electorates across two provinces, 110,000 registered voters.
    expect(screen.getByText("110K")).toBeInTheDocument();

    expect(screen.getByText("Electorates by Province")).toBeInTheDocument();
    expect(
      screen.getByText("Electorates by Support Level"),
    ).toBeInTheDocument();
  });

  it("shows the recent activity feed with the electorate name", async () => {
    const { backend } = createMockBackend({
      electorates,
      activities: [
        makeActivity({
          id: 1n,
          electorateId: 2n,
          description: "Rally in Lae",
        }),
      ],
    });

    renderApp({ backend, initialPath: "/" });

    expect(await screen.findByText("Rally in Lae")).toBeInTheDocument();
    expect(screen.getByText("Lae")).toBeInTheDocument();
  });

  it("shows an empty state when no activity has been recorded", async () => {
    const { backend } = createMockBackend({ electorates });

    renderApp({ backend, initialPath: "/" });

    expect(
      await screen.findByText("No campaign activity recorded yet"),
    ).toBeInTheDocument();
  });
});
