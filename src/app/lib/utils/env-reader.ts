export const getOpenApiKey = () => {
  const key = process.env.OPEN_AI_KEY;
  if (key) return key;
  throw new Error(`OPEN_AI_KEY missing in env`);
};
