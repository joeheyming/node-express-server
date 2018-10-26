export const makeErr = (message, status) => {
  const error = new Error(message);
  error.status = status;
  throw error;
}

export const validationError = (message) => makeErr(message, 422);

export const notFoundError = (message) => makeErr(message, 404);

export const authError = (message) => makeErr(message, 401);

export const loginTimeoutError = (message) => makeErr(message, 440);

export const badRequestError = (message) => makeErr(message, 400);
