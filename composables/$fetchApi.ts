import type { Response } from "~/types/response.type";

type UseFetchParam<T> = Parameters<typeof $fetch<T>>;

export default <T>(url: UseFetchParam<Response<T>>[0], opts?: UseFetchParam<Response<T>>[1]) => {
  const config = useRuntimeConfig();
  const baseUrl = 'abc' // config.public.apiUrl;

  return $fetch<Response<T>>(url, {
    ...opts,
    baseURL: baseUrl
  });
}
