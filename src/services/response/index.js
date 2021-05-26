export const success = (res, status) => (entity) => {
  if (entity) {
    res.status(status || 200).json(entity);
  }

  return null;
};

export const notFound = (res) => (entity) => {
  const errorMessage = {
    code: 404,
    message: "The requested resource could not be found.",
  };

  if (entity) {
    return entity;
  }

  res.status(404).send(errorMessage);

  return null;
};

export const checkAuthor = (res, user, userField) => (entity) => {
  const errorMessage = {
    code: 401,
    message: "Your are not authorized to access this content.",
  };

  if (entity) {
    const isAuthor = entity[userField] && entity[userField].equals(user.id);

    if (isAuthor) {
      return entity;
    }

    res.status(401).send(errorMessage);
  }
  return null;
};
