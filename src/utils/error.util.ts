export const throwException = (ex: any) => {
  const error = ex as Error;
  //console.log(error);
  throw new Error(error.message);
}