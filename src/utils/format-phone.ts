export const formatPhone = (code?: string, phone?: string) => {
  if (code && phone) {
    return `${code}${phone}`;
  }
  return "";
};
