import request from "supertest";
import { apiRoot } from "../../config";
import { signSync } from "../../services/jwt";
import express from "../../services/express";
import mongoose from "../../services/mongoose";
import routes, { Todo } from ".";
import { User } from "../user";

const app = () => express(apiRoot, routes);

let user1, user2, session1, session2;

beforeEach(async () => {
  user1 = await User.create({
    name: "user",
    email: "a@a.com",
    password: "123456",
  });
  user2 = await User.create({
    name: "user",
    email: "b@b.com",
    password: "123456",
  });

  session1 = signSync(user1.id);
  session2 = signSync(user2.id);
});

test("GET /todo 200 ", async () => {
  const { status, body } = await request(app())
    .get(apiRoot)
    .query({ access_token: session1 });
  expect(status).toBe(200);
  expect(Array.isArray(body)).toBe(true);
});

test("GET /todo 401 with invalid token", async () => {
  const { status } = await request(app())
    .get(apiRoot)
    .query({ access_token: 123 });
  expect(status).toBe(401);
});

test("GET /todo/:id 200", async () => {
  const task = await Todo.create({
    content: "Finish english essay",
    user: user1,
  });

  const { status, body } = await request(app())
    .get(`${apiRoot}/${task._id}`)
    .query({ access_token: session1 });

  expect(status).toBe(200);
  expect(typeof body).toBe("object");
  expect(body._id).toEqual(task._id.toString());
  expect(body.content).toEqual(task.content.toString());
  expect(body.completed).toEqual(task.completed);
});

test("GET /todo/:id 401", async () => {
  const { status } = await request(app()).get(
    apiRoot + "/123456789098765432123456"
  );
  expect(status).toBe(401);
});

test("GET /todo/:id 401 for not being the author", async () => {
  const task = await Todo.create({
    content: "Finish english essay",
    user: user1,
  });

  const { status, body } = await request(app())
    .get(`${apiRoot}/${task._id}`)
    .query({ access_token: session2 });

  expect(status).toBe(401);
});

test("POST /todo 201", async () => {
  const { status, body } = await request(app()).post(apiRoot).send({
    access_token: session2,
    title: "College",
    content: "Finish essay by tomorrow",
  });

  expect(status).toBe(201);
  expect(typeof body).toBe("object");
  expect(body.title).toBe("College");
  expect(body.content).toBe("Finish essay by tomorrow");
});

test("POST /todo 400 without content field", async () => {
  const errorMessage = {
    message: "content is required",
    name: "required",
    param: "content",
    required: true,
    valid: false,
  };

  const { status, body } = await request(app())
    .post(apiRoot)
    .send({ access_token: session1, title: "Work" });
  expect(status).toBe(400);
  expect(typeof body).toBe("object");
  expect(body).toEqual(errorMessage);
});

test("PUT /todo/:id 200", async () => {
  const task = await Todo.create({
    content: "Finish english essay",
    user: user1,
  });

  const { status, body } = await request(app())
    .put(`${apiRoot}/${task._id}`)
    .send({ access_token: session1, content: "Buy groceries" });
  expect(status).toBe(200);
  expect(typeof body).toBe("object");
  expect(body._id).toBe(task._id.toString());
  expect(body.content).toBe("Buy groceries");
});

test("PUT /todo/:id 401 for not being the author", async () => {
  const task = await Todo.create({
    content: "Finish english essay",
    user: user1,
  });

  const { status } = await request(app())
    .put(`${apiRoot}/${task._id}`)
    .send({ access_token: session2, content: "Buy groceries" });
  expect(status).toBe(401);
});

test("PUT /todo/:id 404", async () => {
  const { status } = await request(app())
    .put(apiRoot + "/123456789098765432123456")
    .send({ access_token: session1, content: "Put the trash outside" });
  expect(status).toBe(404);
});

test("PUT /todo/:id 500 with invalid id", async () => {
  const { status } = await request(app())
    .put(apiRoot + "/123")
    .send({ access_token: session1, content: "Put the trash outside" });
  expect(status).toBe(500);
});

test("DELETE /todo/:id 204", async () => {
  const task = await Todo.create({ content: "Finish english essay", user: user1 });

  const { status } = await request(app())
    .delete(`${apiRoot}/${task._id}`)
    .send({ access_token: session1 });
  expect(status).toBe(200);
});

test("DELETE /todo/:id 401 for not being the author", async () => {
  const task = await Todo.create({ content: "Finish english essay", user: user1 });

  const { status } = await request(app())
    .delete(`${apiRoot}/${task._id}`)
    .send({ access_token: session2 });
  expect(status).toBe(401);
});

test("DELETE /users/:id 404", async () => {
  const { status } = await request(app())
    .delete(apiRoot + "/123456789098765432123456")
    .send({ access_token: session1 });
  expect(status).toBe(404);
});

test("POST /todo/:id/done 200", async () => {
  const task = await Todo.create({ content: "Finish english essay", user: user2 });

  const { status, body } = await request(app())
    .post(`${apiRoot}/${task._id}/done`)
    .send({
      access_token: session2,
    });

  expect(status).toBe(200);
  expect(body.completed).toBe(true);
  expect(body.content).toBe("Finish english essay");
});

test("POST /todo/:id/done 401 for not being the author", async () => {
  const task = await Todo.create({
    content: "Finish english essay",
    user: user2,
  });

  const { status, body } = await request(app())
    .post(`${apiRoot}/${task._id}/done`)
    .send({
      access_token: session1,
    });

  expect(status).toBe(401);
});

test("POST /todo/:id/done 500 with invalid id", async () => {
  const { status } = await request(app())
    .post(`${apiRoot}/123/done`)
    .send({ access_token: session2 });

  expect(status).toBe(500);
});

test("POST /todo/:id/not-done 200", async () => {
  const task = await Todo.create({ content: "Finish english essay", user: user1 });

  const { status, body } = await request(app())
    .post(`${apiRoot}/${task._id}/not-done`)
    .send({
      access_token: session1,
    });

  expect(status).toBe(200);
  expect(body.completed).toBe(false);
  expect(body.content).toBe("Finish english essay");
});

test("POST /todo/:id/not-done 401 for not being the author", async () => {
  const task = await Todo.create({
    content: "Finish english essay",
    user: user2,
  });

  const { status, body } = await request(app())
    .post(`${apiRoot}/${task._id}/not-done`)
    .send({
      access_token: session1,
    });

  expect(status).toBe(401);
});

test("POST /todo/:id/not-done 500 with invalid id", async () => {
  const { status } = await request(app())
    .post(`${apiRoot}/123/not-done`)
    .send({ access_token: session1 });

  expect(status).toBe(500);
}); 
