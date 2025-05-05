const getLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  return null;
};

const setLocalStorage = (key: string, value: unknown) => {
  // window.localStorage.setItem(key, JSON.stringify(value));
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
export { getLocalStorage, setLocalStorage };
