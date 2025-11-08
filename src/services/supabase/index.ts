type SupabaseClientLike = Record<string, unknown>;

let cachedClient: SupabaseClientLike | null = null;

export const initializeSupabaseClient = (client: SupabaseClientLike) => {
  cachedClient = client;
};

export const getSupabaseClient = () => cachedClient;

