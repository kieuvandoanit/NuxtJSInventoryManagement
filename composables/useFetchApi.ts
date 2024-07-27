import type { Response } from "~/types/response.type";

type UseFetchParam<T> = Parameters<typeof useFetch<T>>;

export default <T>(url: UseFetchParam<Response<T>>[0], opts?: UseFetchParam<Response<T>>[1]) => {
  const config = useRuntimeConfig();
  // const baseUrl = config.public.apiUrl;
  const baseUrl = '';

  return useFetch<Response<T>>(url, {
    ...opts,
    baseURL: baseUrl,
  });
}

