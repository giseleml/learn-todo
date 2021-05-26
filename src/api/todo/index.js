import { Router } from "express";
import { middleware as query } from "querymen";
import { middleware as body } from "bodymen";
import { token } from "../../services/passport";

import {
  getAllTodos,
  getSingleTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  setTodoAsDone,
  setTodoAsNotDone,
} from "./controller";

import { schema } from "./model";
export Todo, { schema } from "./model";

const router = new Router();
const { title, content } = schema.tree;

/**
 * @api {get} /todo Retrieve to-dos
 * @apiName RetrieveTodo
 * @apiGroup Todo
 * @apiUse listParams
 * @apiSuccess {Object[]} todo List of to-dos.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/", token({ required: true }), query(), getAllTodos);

/**
 * @api {get} /todo/:id Retrieve to-do
 * @apiName RetrieveTodo
 * @apiGroup Todo
 * @apiSuccess {Object} todo To-do's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 To-do not found.
 */
router.get("/:id", token({ required: true }), getSingleTodo);

/**
 * @api {post} /todo Create to-do
 * @apiName CreateTodo
 * @apiGroup Todo
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title to-do's title.
 * @apiParam content to-do's content.
 * @apiParam completed to-do's completion status.
 * @apiSuccess {Object} todo To-do's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 To-do not found.
 * @apiError 401 user access only.
 */
router.post(
  "/",
  token({ required: true }),
  body({ title, content }),
  createTodo
);

/**
 * @api {post} /todo Set to-do as done
 * @apiName SetTodoAsDone
 * @apiGroup Todo
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} todo To-do's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 To-do not found.
 * @apiError 401 user access only.
 */
router.post("/:id/done", token({ required: true }), setTodoAsDone);

/**
 * @api {post} /todo Set to-do as not done
 * @apiName setTodoAsNotDone
 * @apiGroup Todo
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} todo To-do's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 To-do not found.
 * @apiError 401 user access only.
 */
router.post("/:id/not-done", token({ required: true }), setTodoAsNotDone);

/**
 * @api {put} /todo/:id Update to-do
 * @apiName UpdateTodo
 * @apiGroup Todo
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam title to-do's title.
 * @apiParam content to-do's content.
 * @apiSuccess {Object} todo To-do's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 To-do not found.
 * @apiError 401 user access only.
 */
router.put(
  "/:id",
  token({ required: true }),
  body({ title, content }),
  updateTodo
);

/**
 * @api {delete} /todo/:id Delete to-do
 * @apiName DeleteTodo
 * @apiGroup Todo
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 To-do not found.
 * @apiError 401 user access only.
 */
router.delete("/:id", token({ required: true }), deleteTodo);

export default router;
