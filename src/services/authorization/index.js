export const checkAuthor = (res, user, userField) => (entity) => {
  const errorMessage = {
    message: "You are not authorized to access this content.",
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
