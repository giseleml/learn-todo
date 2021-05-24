import { Router } from "express";
import { middleware as query } from "querymen";
import { middleware as body } from "bodymen";
import { master, token } from "../../services/passport";

import {
  getAllTodos,
  getSingleTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./controller";

import { schema } from "./model";
export Todo, { schema } from "./model";

const router = new Router();
const { title, content } = schema.tree;

router.get(
  "/",
  token({ required: true, roles: ["admin"] }),
  query(),
  getAllTodos
);

router.get("/:id", getSingleTodo);

router.post("/", body({ title, content }), createTodo);

router.put(
  "/:id",
  token({ required: true }),
  body({ title, content }),
  updateTodo
);

router.delete("/:id", token({ required: true, roles: ["admin"] }), deleteTodo);

export default router;
