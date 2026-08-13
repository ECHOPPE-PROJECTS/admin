export interface UserItem {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: { id?: number; name: string } | null;
  department: { id?: number; name: string } | null;
  is_active: boolean;
}

export interface IncidentItem {
  id: number;
  numero_ticket: string;
  title: string;
  status: { id?: number; name: string } | null;
  priority: { id?: number; name: string } | null;
  created_at: string;
}

export interface NotificationItem {
  id: number;
  message: string;
  created_at?: string;
}

export interface AuditItem {
  id: number;
  user: string;
  action: string;
  description: string;
  ip_address: string | null;
  created_at: string;
}

export interface StatusItem {
  id: number;
  name: string;
}

export interface PriorityItem {
  id: number;
  name: string;
}

export interface IncidentStatistic {
  name: string;
  value: number;
}

export interface DashboardStats {
  users: number;
  incidents: number;
  notifications: number;
  activities: number;
}
