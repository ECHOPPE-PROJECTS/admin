import axios, { type AxiosResponse } from "axios";
import type {
  AuditItem,
  DashboardStats,
  IncidentItem,
  IncidentStatistic,
  NotificationItem,
  PriorityItem,
  StatusItem,
  UserItem,
} from "@/type";

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-t8k0.onrender.com";

const api = axios.create({
  baseURL: API_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined" && config.headers) {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

type FailedRequest = {
  resolve: (value?: string | null) => void;
  reject: (error: unknown) => void;
  config: unknown;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    if (!originalRequest) return Promise.reject(error);

    const status = error?.response?.status;
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window === "undefined") return Promise.reject(error);

      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      const refreshEndpoints = [
        "/api/auth/refresh/",
        "/api/auth/token/refresh/",
        "/api/token/refresh/",
      ];

      try {
        let newAccess: string | null = null;
        let refreshError: unknown = null;

        for (const ep of refreshEndpoints) {
          try {
            const resp = await api.post(ep, { refresh: refreshToken });
            newAccess = resp?.data?.access ?? resp?.data?.token ?? null;
            if (newAccess) break;
          } catch (e) {
            refreshError = e;
          }
        }

        if (!newAccess) {
          processQueue(refreshError || error, null);
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(refreshError || error);
        }

        localStorage.setItem("access_token", newAccess);
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
        processQueue(null, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (e) {
        processQueue(e, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;

type ListResponse<T> =
  | {
      count?: number;
      next?: string | null;
      previous?: string | null;
      results?: T[];
    }
  | T[];

const parseListResponse = <T>(data: ListResponse<T>): T[] => {
  if (Array.isArray(data)) {
    return data;
  }
  return data.results ?? [];
};

const handleAxiosError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const message =
      "Axios Error : " +
      (error.response
        ? `${error.response.status} ${error.response.statusText}`
        : error.message);
    throw new Error(message);
  }
  throw error;
};

export async function getIncidentItems(): Promise<IncidentItem[]> {
  try {
    const rep: AxiosResponse<ListResponse<IncidentItem>> = await api.get(`/api/incidents/`);
    return rep.status === 200 ? parseListResponse(rep.data) : [];
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function getNotificationItems(): Promise<NotificationItem[]> {
  try {
    const rep: AxiosResponse<ListResponse<NotificationItem>> = await api.get(`/api/notifications/`);
    return rep.status === 200 ? parseListResponse(rep.data) : [];
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function getAuditItems(): Promise<AuditItem[]> {
  try {
    const rep: AxiosResponse<ListResponse<AuditItem>> = await api.get(`/api/activity-logs/`);
    return rep.status === 200 ? parseListResponse(rep.data) : [];
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function getUsers(): Promise<UserItem[]> {
  try {
    const rep: AxiosResponse<ListResponse<UserItem>> = await api.get(`/api/users/`);
    return rep.status === 200 ? parseListResponse(rep.data) : [];
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function createUser(payload: Record<string, unknown>): Promise<UserItem> {
  const cleanedPayload = Object.fromEntries(
    Object.entries(payload).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  ) as Record<string, unknown>;

  const variants = [
    cleanedPayload,
    { ...cleanedPayload, role: cleanedPayload.role ?? null, department: cleanedPayload.department ?? null },
    {
      ...cleanedPayload,
      role_id: cleanedPayload.role ?? undefined,
      department_id: cleanedPayload.department ?? undefined,
    },
  ];

  const endpoints = ["/api/users/", "/api/users/create/", "/api/auth/register/", "/api/users/register/"];

  let lastError: unknown = null;

  for (const endpoint of endpoints) {
    for (const variation of variants) {
      try {
        const response = await api.post(endpoint, variation);
        return response.data;
      } catch (error) {
        lastError = error;
      }
    }
  }

  if (axios.isAxiosError(lastError)) {
    const detail = lastError.response?.data;
    const message =
      typeof detail === "string"
        ? detail
        : detail && typeof detail === "object"
          ? (detail as { detail?: string; message?: string; error?: string }).detail ||
            (detail as { detail?: string; message?: string; error?: string }).message ||
            (detail as { detail?: string; message?: string; error?: string }).error ||
            "Impossible de créer l’utilisateur."
          : "Impossible de créer l’utilisateur.";
    throw new Error(message);
  }

  throw new Error("Impossible de créer l’utilisateur.");
}

export async function deleteUser(id: number): Promise<void> {
  try {
    await api.delete(`/api/users/${id}/`);
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function getStatus(): Promise<StatusItem[]> {
  try {
    const rep: AxiosResponse<ListResponse<StatusItem>> = await api.get(`/api/statuses/`);
    return rep.status === 200 ? parseListResponse(rep.data) : [];
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function getPriority(): Promise<PriorityItem[]> {
  try {
    const rep: AxiosResponse<ListResponse<PriorityItem>> = await api.get(`/api/priorities/`);
    return rep.status === 200 ? parseListResponse(rep.data) : [];
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function getIncidentStatistics(): Promise<IncidentStatistic[]> {
  try {
    const incidents = await getIncidentItems();
    const counts = new Map<string, number>();
    incidents.forEach((incident) => {
      const name = incident.status?.name || "Sans statut";
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [users, incidents, notifications, activities] = await Promise.all([
      getUsers(),
      getIncidentItems(),
      getNotificationItems(),
      getAuditItems(),
    ]);
    return {
      users: users.length,
      incidents: incidents.length,
      notifications: notifications.length,
      activities: activities.length,
    };
  } catch (error) {
    return handleAxiosError(error);
  }
}
