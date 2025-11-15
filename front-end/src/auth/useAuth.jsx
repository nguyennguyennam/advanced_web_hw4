import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginApi, logoutApi, meApi } from "../services/api";
import { clearAccessToken, setAccessToken } from "./authStore";

export const useLogin = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);

      qc.setQueryData(["user"], data.user);

      localStorage.setItem("user", JSON.stringify(data.user));
    },
  });
};

export const useLogout = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      qc.clear();
      clearAccessToken();
      localStorage.removeItem("user");
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: meApi,
    retry: false,
  });
};
