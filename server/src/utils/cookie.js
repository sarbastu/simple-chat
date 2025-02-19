const defaultOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV !== 'development',
};

export const setCookie = (res, name, value, options = {}) => {
  const finalOptions = { ...defaultOptions, ...options };

  res.cookie(name, value, finalOptions);
};

export const clearCookie = (res, name) => {
  res.clearCookie(name, { ...defaultOptions, maxAge: 0 });
};
