import { resetCoreInfrastructureState } from "@/__tests__/coreInfrastructureState";
import { createMockBackend, makeElectorate } from "@/__tests__/mockBackend";
import { renderApp } from "@/__tests__/renderApp";
import { SupportLevel } from "@/lib/electorates";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    supportLevel: SupportLevel.Strong,
  }),
  makeElectorate({
    id: 2n,
    name: "Lae",
    province: "Morobe",
    region: "Momase",
    registeredVoters: 48_000n,
    supportLevel: SupportLevel.Opposed,
  }),
  makeElectorate({
    id: 3n,
    name: "Goroka",
    province: "Eastern Highlands",
    region: "Highlands",
    registeredVoters: 43_000n,
    supportLevel: SupportLevel.Strong,
  }),
];

describe("ElectorateDirectoryPage", () => {
  it("lists every electorate with its province, region, and support level", async () => {
    const { backend } = createMockBackend({ electorates });
    renderApp({ backend, initialPath: "/electorates" });

    expect(
      await screen.findByRole("heading", { name: "Electorate Directory" }),
    ).toBeInTheDocument();

    expect(await screen.findByText("Moresby North-East")).toBeInTheDocument();
    expect(screen.getByText("Lae")).toBeInTheDocument();
    expect(screen.getByText("Goroka")).toBeInTheDocument();
    expect(screen.getByText("Morobe")).toBeInTheDocument();
    expect(screen.getByText("Momase")).toBeInTheDocument();
  });

  it("narrows the list with the text search box", async () => {
    const user = userEvent.setup();
    const { backend } = createMockBackend({ electorates });
    renderApp({ backend, initialPath: "/electorates" });

    await screen.findByText("Moresby North-East");
    await user.type(
      screen.getByRole("searchbox", { name: "Search electorates" }),
      "lae",
    );

    await waitFor(() => {
      expect(screen.queryByText("Moresby North-East")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Lae")).toBeInTheDocument();
    expect(screen.queryByText("Goroka")).not.toBeInTheDocument();
  });

  it("filters by province and reflects the filter in the URL", async () => {
    const user = userEvent.setup();
    const { backend } = createMockBackend({ electorates });
    const { router } = renderApp({ backend, initialPath: "/electorates" });

    await screen.findByText("Moresby North-East");

    await user.click(
      screen.getByRole("combobox", { name: "Filter by province" }),
    );
    await user.click(await screen.findByRole("option", { name: "Morobe" }));

    await waitFor(() => {
      expect(screen.queryByText("Moresby North-East")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Lae")).toBeInTheDocument();
    expect(screen.queryByText("Goroka")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(router.state.location.search).toMatchObject({
        province: "Morobe",
      });
    });
  });

  it("filters by support level and reflects the filter in the URL", async () => {
    const user = userEvent.setup();
    const { backend } = createMockBackend({ electorates });
    const { router } = renderApp({ backend, initialPath: "/electorates" });

    await screen.findByText("Moresby North-East");

    await user.click(
      screen.getByRole("combobox", { name: "Filter by support level" }),
    );
    await user.click(await screen.findByRole("option", { name: "Opposed" }));

    await waitFor(() => {
      expect(screen.queryByText("Moresby North-East")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Lae")).toBeInTheDocument();
    expect(screen.queryByText("Goroka")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(router.state.location.search).toMatchObject({
        support: "Opposed",
      });
    });
  });

  it("restores filters from the URL on load", async () => {
    const { backend } = createMockBackend({ electorates });
    renderApp({ backend, initialPath: "/electorates?province=Morobe" });

    await screen.findByText("Lae");
    expect(screen.queryByText("Moresby North-East")).not.toBeInTheDocument();
    expect(screen.queryByText("Goroka")).not.toBeInTheDocument();
  });

  it("sorts by registered voters when the column header is toggled", async () => {
    const user = userEvent.setup();
    const { backend } = createMockBackend({ electorates });
    const { router } = renderApp({ backend, initialPath: "/electorates" });

    await screen.findByText("Moresby North-East");

    await user.click(screen.getByRole("button", { name: /Registered/i }));

    await waitFor(() => {
      const rows = screen.getAllByRole("row").slice(1);
      expect(
        within(rows[0]).getByText("Moresby North-East"),
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(router.state.location.search).toMatchObject({
        sort: "registeredVoters",
        dir: "desc",
      });
    });
  });

  it("shows an empty state and clears filters when nothing matches", async () => {
    const user = userEvent.setup();
    const { backend } = createMockBackend({ electorates });
    renderApp({ backend, initialPath: "/electorates" });

    await screen.findByText("Moresby North-East");
    await user.type(
      screen.getByRole("searchbox", { name: "Search electorates" }),
      "zzzz",
    );

    expect(
      await screen.findByText("No electorates match these filters"),
    ).toBeInTheDocument();

    // Both the filter bar and the empty state expose a "Clear filters"
    // button; click the empty-state one to confirm it resets the view.
    await user.click(
      document.querySelector(
        '[data-ocid="directory.empty_clear_button"]',
      ) as HTMLElement,
    );
    expect(await screen.findByText("Moresby North-East")).toBeInTheDocument();
  });
});
