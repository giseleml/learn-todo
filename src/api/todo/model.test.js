import { Todo } from ".";

let todo;

beforeEach(async () => {
  todo = await Todo.create({
    title: "Deadline",
    content: "Study for the test",
  });
});

describe("Todo Schema", () => {
  it("Sets an id, content as false and dates for created_at and edited_at", () => {
    const currentDate = new Date().toDateString();

    expect(todo._id).toBeTruthy();
    expect(todo.completed).toBe(false);
    expect(todo.created_at.toDateString()).toBe(currentDate);
    expect(todo.edited_at.toDateString()).toBe(currentDate);
  });

  it("Expects title and content to be set", () => {
    expect(todo.content).toBe("Study for the test");
    expect(todo.title).toBe("Deadline");
  });

  it("Expects to set to-do's completed as true", () => {
    todo.complete();
    expect(todo.completed).toBe(true);
  });

  it("Expects to set to-do's completed as false", () => {
    todo.incomplete();
    expect(todo.completed).toBe(false);
  });
});
