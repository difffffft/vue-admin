// 返回结果是boolean值
export const getBooleanFromEnv = (key: string): boolean => {
  if (import.meta.env[key] === "true") {
    return true;
  }
  return false;
};