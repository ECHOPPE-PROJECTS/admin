export interface Alerte_INCIDENTItem {
    id: number;
    title: string;
    date: string;
}

export interface NotificationItem {
    id: number;
    message: string;
    date: string;
}

export interface AuditItem {
    id: number;
    action: string;
    user: string;
    date: string;
}

export interface StatusItem {
    id: number;
    status: string;
}

export interface PriorityItem {
    id: number;
    name: string;
}

export interface UserCountItem {
    id: number;
    username: string;
    count: number;
}

export interface StatistiqueItem {
    id: number;
    user: string;
    period_type: string;
    period_start: string;
    period_end: string;
    incident_count: number;
    update_at: string;
}