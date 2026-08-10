import axios, { type AxiosResponse } from "axios";
import {
  Alerte_INCIDENTItem,
  NotificationItem,
  AuditItem,
  StatusItem,
  PriorityItem,
  UserCountItem,
  StatistiqueItem,
} from "@/type";

/**
 * Le backend Django REST est accessible via NEXT_PUBLIC_API_URL.
 */
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

export async function getAlerte_INCIDENTItems(): Promise<Alerte_INCIDENTItem[]> {
  try {
    const rep: AxiosResponse<ListResponse<Alerte_INCIDENTItem>> = await api.get(`/api/incidents/`);
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

export async function getUserCount(): Promise<UserCountItem[]> {
  try {
    const rep: AxiosResponse<ListResponse<UserCountItem>> = await api.get(`/api/users/`);
    return rep.status === 200 ? parseListResponse(rep.data) : [];
  } catch (error) {
    return handleAxiosError(error);
  }
}

export async function getStatistiqueItems(): Promise<StatistiqueItem[]> {
  throw new Error(
    "Le backend n'expose pas de route /api/statistiques/. Ajoutez `statistique.urls` au routeur Django ou supprimez cet appel.",
  );
}
