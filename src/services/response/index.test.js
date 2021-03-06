import * as response from ".";

let res;

beforeEach(() => {
  res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
    end: jest.fn(() => res),
    send: jest.fn(() => res),
  };
});

describe("success", () => {
  it("responds with passed object and status 200", () => {
    expect(response.success(res)({ prop: "value" })).toBeNull();
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ prop: "value" });
  });

  it("responds with passed object and status 201", () => {
    expect(response.success(res, 201)({ prop: "value" })).toBeNull();
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith({ prop: "value" });
  });

  it("does not send any response when object has not been passed", () => {
    expect(response.success(res, 201)()).toBeNull();
    expect(res.status).not.toBeCalled();
  });
});

describe("notFound", () => {
  it("responds with error object when object has not been passed", () => {
    const errorMessage = {
      message: "The requested resource could not be found.",
    };

    expect(response.notFound(res)()).toEqual(null);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(errorMessage);
  });

  it("returns the passed object and does not send any response", () => {
    expect(response.notFound(res)({ prop: "value" })).toEqual({
      prop: "value",
    });
    expect(res.status).not.toBeCalled();
    expect(res.end).not.toBeCalled();
  });
});

