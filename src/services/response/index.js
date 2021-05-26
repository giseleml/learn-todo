export const success = (res, status) => (entity) => {
  if (entity) {
    res.status(status || 200).json(entity);
  }

  return null;
};

export const notFound = (res) => (entity) => {
  const errorMessage = {
    message: "The requested resource could not be found.",
  };

  if (entity) {
    return entity;
  }

  res.status(404).send(errorMessage);

  return null;
};
