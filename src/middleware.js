export const onRequest = async (context, next) => {
  console.log(`Request: ${context.request.method} ${context.request.url}`);
  
  return next()
};
