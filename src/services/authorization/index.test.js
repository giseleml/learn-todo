import { checkAuthor } from ".";

let res;

beforeEach(() => {
  res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
    end: jest.fn(() => res),
    send: jest.fn(() => res),
  };
});

describe("checkAuthor", () => {
  let user, entity;

  beforeEach(() => {
    user = {
      id: 1,
      role: "user",
    };
    entity = {
      user: {
        id: 1,
        equals(id) {
          return id === this.id;
        },
      },
    };
  });

  it("returns the passed entity when author is the same", () => {
    expect(checkAuthor(res, user, "user")(entity)).toEqual(entity);
  });

  it("responds with status 401 when author is not the same or admin", () => {
    const errorMessage = {
      message: "You are not authorized to access this content.",
    };

    user.id = 2;
    expect(checkAuthor(res, user, "user")(entity)).toBeNull();
    expect(res.status).toBeCalledWith(401);
    expect(res.send).toHaveBeenCalledWith(errorMessage);
  });

  it("returns null without sending response when entity has not been passed", () => {
    expect(checkAuthor(res, user, "user")()).toBeNull();
  });
});
