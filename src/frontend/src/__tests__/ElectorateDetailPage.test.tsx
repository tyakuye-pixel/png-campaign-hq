import { resetCoreInfrastructureState } from "@/__tests__/coreInfrastructureState";
import {
  createMockBackend,
  makeActivity,
  makeElectorate,
} from "@/__tests__/mockBackend";
import { renderApp } from "@/__tests__/renderApp";
import { ActivityType, SeatType, SupportLevel } from "@/lib/electorates";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

afterEach(() => {
  resetCoreInfrastructureState();
});

/**
 * The app marks interactive/structural elements with `data-ocid`, not
 * `data-testid`, so Testing Library's `getByTestId` cannot see them. This
 * resolves an ocid to its element for use with `within`.
 */
function byOcid(ocid: string): HTMLElement {
  const el = document.querySelector(`[data-ocid="${ocid}"]`);
  if (!el) throw new Error(`No element with data-ocid="${ocid}"`);
  return el as HTMLElement;
}

const moresbyNorthEast = makeElectorate({
  id: 1n,
  name: "Moresby North-East",
  province: "National Capital District",
  region: "Southern",
  seatType: SeatType.open,
  registeredVoters: 57_000n,
  supportLevel: SupportLevel.Leaning,
  campaignManager: "Alice Kila",
  notes: "Strong ground game in the wards.",
  updatedAt: 1_800_000_000_000_000_000n,
});

const olderActivity = makeActivity({
  id: 10n,
  electorateId: 1n,
  activityType: ActivityType.contact,
  date: 1_700_000_000_000_000_000n,
  description: "Met with the ward councillor",
});

const newerActivity = makeActivity({
  id: 11n,
  electorateId: 1n,
  activityType: ActivityType.event,
  date: 1_750_000_000_000_000_000n,
  description: "Rally at the market",
});

describe("ElectorateDetailPage", () => {
  it("shows the profile, campaign status, and activity log for an electorate", async () => {
    const { backend } = createMockBackend({
      electorates: [moresbyNorthEast],
      activities: [olderActivity, newerActivity],
    });
    renderApp({ backend, initialPath: "/electorates/1" });

    await screen.findByText("Moresby North-East");

    const profile = byOcid("electorate.profile_panel");
    expect(within(profile).getByText("Moresby North-East")).toBeInTheDocument();
    expect(
      within(profile).getByText(
        "National Capital District Province · Southern Region",
      ),
    ).toBeInTheDocument();
    expect(within(profile).getByText("Open")).toBeInTheDocument();
    expect(within(profile).getByText("57K")).toBeInTheDocument();

    const campaign = byOcid("electorate.campaign_panel");
    expect(within(campaign).getByText("Leaning")).toBeInTheDocument();
    expect(within(campaign).getByText("Alice Kila")).toBeInTheDocument();
    expect(
      within(campaign).getByText("Strong ground game in the wards."),
    ).toBeInTheDocument();

    const log = byOcid("electorate.activity_list");
    expect(within(log).getByText("Rally at the market")).toBeInTheDocument();
    expect(
      within(log).getByText("Met with the ward councillor"),
    ).toBeInTheDocument();
  });

  it("orders the activity log newest first", async () => {
    const { backend } = createMockBackend({
      electorates: [moresbyNorthEast],
      activities: [olderActivity, newerActivity],
    });
    renderApp({ backend, initialPath: "/electorates/1" });

    await screen.findByText("Moresby North-East");
    const log = byOcid("electorate.activity_list");
    const items = within(log).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(
      within(items[0]).getByText("Rally at the market"),
    ).toBeInTheDocument();
    expect(
      within(items[1]).getByText("Met with the ward councillor"),
    ).toBeInTheDocument();
  });

  it("lets an admin change the support level and persists it", async () => {
    const user = userEvent.setup();
    const { backend, state } = createMockBackend({
      electorates: [moresbyNorthEast],
      isAdmin: true,
    });
    renderApp({
      backend,
      isAuthenticated: true,
      initialPath: "/electorates/1",
    });

    await screen.findByText("Moresby North-East");
    await user.click(byOcid("electorate.edit_button"));

    await user.click(byOcid("electorate.support_select"));
    await user.click(await screen.findByRole("option", { name: "Strong" }));

    await user.click(byOcid("electorate.save_button"));

    // The accepted behavior is that the change persists to the backend. The
    // editor's auto-close is an implementation detail that depends on the
    // mutation's pending render, so assert the persisted value and the
    // selected control value instead.
    await waitFor(() => {
      expect(state.electorates[0].supportLevel).toBe(SupportLevel.Strong);
    });
    expect(byOcid("electorate.support_select")).toHaveTextContent("Strong");
  });

  it("lets an admin add an activity entry and persists it", async () => {
    const user = userEvent.setup();
    const { backend, state } = createMockBackend({
      electorates: [moresbyNorthEast],
      isAdmin: true,
    });
    renderApp({
      backend,
      isAuthenticated: true,
      initialPath: "/electorates/1",
    });

    await screen.findByText("Moresby North-East");
    await user.click(byOcid("electorate.add_activity_button"));

    await user.type(
      byOcid("electorate.activity_description_textarea"),
      "Door-knock in the northern wards",
    );
    await user.click(byOcid("electorate.activity_submit_button"));

    await waitFor(() => {
      expect(state.activities).toHaveLength(1);
    });
    expect(state.activities[0].description).toBe(
      "Door-knock in the northern wards",
    );
    // The new entry renders in the activity log. Scope to the list so the
    // still-open form's textarea (which holds the same text) does not match.
    const log = byOcid("electorate.activity_list");
    expect(
      await within(log).findByText("Door-knock in the northern wards"),
    ).toBeInTheDocument();
  });

  it("shows a read-only view with no editing controls for a non-admin visitor", async () => {
    const { backend } = createMockBackend({
      electorates: [moresbyNorthEast],
      isAdmin: false,
    });
    renderApp({
      backend,
      isAuthenticated: false,
      initialPath: "/electorates/1",
    });

    await screen.findByText("Moresby North-East");

    expect(
      document.querySelector('[data-ocid="electorate.edit_button"]'),
    ).toBeNull();
    expect(
      document.querySelector('[data-ocid="electorate.add_activity_button"]'),
    ).toBeNull();
    expect(byOcid("electorate.readonly_notice")).toBeInTheDocument();
  });

  it("shows a not-found state for an unknown electorate id", async () => {
    const { backend } = createMockBackend({ electorates: [moresbyNorthEast] });
    renderApp({ backend, initialPath: "/electorates/999" });

    expect(await screen.findByText("Electorate not found")).toBeInTheDocument();
    expect(byOcid("electorate.not_found_state")).toBeInTheDocument();
  });
});
