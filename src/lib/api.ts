import { API_BASE_URL } from "../config/api";

export interface ApiResponse<T> {
  message: string;
  data?: T;
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public data?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface LoginRequest {
  credential: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: any; // UserResource from Laravel
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface RequestPasswordResetPayload {
  email: string;
}

const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
};

const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
};

const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
};

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const defaultHeaders: HeadersInit = {
    Accept: "application/json",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || `HTTP error! status: ${response.status}`,
        response.status,
        data,
      );
    }

    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiRequest<LoginResponse>("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      setAuthToken(response.token);
    }

    return response;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await apiRequest<{ message: string }>("/logout", {
      method: "POST",
    });

    removeAuthToken();
    return response;
  },

  createUser: async (userData: CreateUserRequest): Promise<any> => {
    return apiRequest("/estudiante/create-user", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  getCurrentUser: async (): Promise<any> => {
    return apiRequest("/estudiante/user");
  },

  resetPassword: async (
    payload: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> => {
    return apiRequest<ResetPasswordResponse>("/password/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  requestPasswordReset: async (
    payload: RequestPasswordResetPayload,
  ): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>("/password/reset-link", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

export const aspiranteApi = {
  create: async (
    payload: any,
  ): Promise<{ message: string; download_url: string }> => {
    const url = `${API_BASE_URL}/aspirante`;

    const config: RequestInit = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || `HTTP error! status: ${response.status}`,
          response.status,
          data,
        );
      }

      return data;
    } catch (error) {
      console.error(`API request failed for aspirante:`, error);
      throw error;
    }
  },
};

export const apiUtils = {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
};
