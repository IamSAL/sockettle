export const safeParseJSON = (message) => {
  try {
    return JSON.parse(message);
  } catch (error) {
    return null;
  }
};
