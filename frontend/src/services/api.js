import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const checkHealth = async () => {
  const response = await API.get("/health");
  return response.data;
};

export const issueCertificate = async (formData) => {
  const response = await API.post("/issue-certificate", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getIssuedCertificates = async () => {
  const response = await API.get("/certificates");
  return response.data;
};

export const verifyCertificate = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await API.post("/verify-file", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const viewerLogin = async (credential) => {
  const response = await API.post("/api/viewer/login", { credential });
  return response.data;
};

export const saveVerificationHistory = async ({ token, certificateHash, fileName, isValid, issuerName, issuedAt }) => {
  const response = await API.post("/api/viewer/history", {
    token, certificateHash, fileName, isValid, issuerName, issuedAt,
  });
  return response.data;
};

export const getVerificationHistory = async (token) => {
  const response = await API.get("/api/viewer/history", { params: { token } });
  return response.data;
};
