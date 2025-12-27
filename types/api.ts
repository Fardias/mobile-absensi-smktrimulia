export interface ApiHeader {
  access_token?: string;
}

export interface ApiResponse<T = unknown> {
  responseStatus: boolean;
  responseMessage?: string;
  responseHeader?: ApiHeader;
  responseData?: T;
  errors?: any;
}

// Fallback tipe respons mentah (tanpa wrapper)
export type RawResponse<T = unknown> = T;

// Util: ambil payload data terlepas dari bentuk respons
export function getPayload<T>(resp: ApiResponse<T> | RawResponse<T>): T | undefined {
  const anyResp = resp as any;
  if (anyResp && typeof anyResp === 'object' && 'responseStatus' in anyResp) {
    return anyResp.responseData as T;
  }
  return resp as T;
}