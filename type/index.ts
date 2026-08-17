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

export interface DiscussionItem {
  id: number;
  title: string;
  participants: UserItem[];
  created_at: string;
  last_message: MessageItem | null;
  messages_count: number;
}

export interface MessageItem {
  id: number;
  user: UserItem;
  discussion: number;
  content: string;
  created_at: string;
}

export interface IncidentDetailItem {
  id: number;
  numero_ticket: string;
  title: string;
  description: string;
  author: UserItem;
  technician: UserItem | null;
  category: { id: number; name: string } | null;
  priority: { id: number; name: string } | null;
  status: { id: number; name: string } | null;
  comments: { id: number; author: UserItem; content: string; created_at: string }[];
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  closed_at: string | null;
}
