import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ActivityId = bigint;
export interface CampaignActivity {
    id: ActivityId;
    activityType: ActivityType;
    date: Timestamp;
    createdAt: Timestamp;
    description: string;
    electorateId: ElectorateId;
}
export interface Cell {
    value: Value;
    name: string;
}
export interface Electorate {
    id: ElectorateId;
    region: string;
    province: string;
    name: string;
    updatedAt: Timestamp;
    registeredVoters: bigint;
    supportLevel: SupportLevel;
    notes: string;
    campaignManager: string;
    seatType: SeatType;
}
export type ElectorateId = bigint;
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface NationalSummary {
    totalRegisteredVoters: bigint;
    totalActivities: bigint;
    countsBySupportLevel: Array<SupportLevelCount>;
    countsByProvince: Array<ProvinceCount>;
    totalProvinces: bigint;
    totalElectorates: bigint;
}
export interface NewActivity {
    activityType: ActivityType;
    date: Timestamp;
    description: string;
}
export interface ProvinceCount {
    province: string;
    count: bigint;
}
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface SupportLevelCount {
    count: bigint;
    supportLevel: SupportLevel;
}
export type Timestamp = bigint;
export interface UpdateCampaignDetails {
    supportLevel: SupportLevel;
    notes: string;
    campaignManager: string;
}
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export enum ActivityType {
    contact = "contact",
    note = "note",
    event = "event"
}
export enum SeatType {
    open = "open",
    regional = "regional"
}
export enum SupportLevel {
    Weak = "Weak",
    Strong = "Strong",
    Opposed = "Opposed",
    Undecided = "Undecided",
    Leaning = "Leaning"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addActivity(electorateId: ElectorateId, input: NewActivity): Promise<CampaignActivity | null>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    execute(qJson: string): Promise<Result>;
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    getElectorate(id: ElectorateId): Promise<Electorate | null>;
    getNationalSummary(): Promise<NationalSummary>;
    isCallerAdmin(): Promise<boolean>;
    listActivities(electorateId: ElectorateId): Promise<Array<CampaignActivity>>;
    listElectorates(): Promise<Array<Electorate>>;
    listRecentActivities(limit: bigint): Promise<Array<CampaignActivity>>;
    schema(): Promise<string>;
    updateCampaignDetails(id: ElectorateId, details: UpdateCampaignDetails): Promise<Electorate | null>;
}
