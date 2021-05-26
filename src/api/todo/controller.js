import mongoose from "mongoose";
import { success, notFound } from "../../services/response";
import { checkAuthor } from '../../services/authorization'
import { Todo } from ".";

export const getAllTodos = (
  { querymen: { query, select, cursor }, user },
  res,
  next
) => Todo.findAllOwnedByUser(user._id).then(success(res)).catch(next);

export const getSingleTodo = ({ params, user }, res, next) =>
  Todo.findById(params.id)
    .then(notFound(res))
    .then(checkAuthor(res, user, "user"))
    .then(success(res))
    .catch(next);

export const createTodo = ({ bodymen: { body }, user }, res, next) =>
  Todo.create({ ...body, user })
    .then(success(res, 201))
    .catch(next);

export const updateTodo = ({ bodymen: { body }, params, user }, res, next) =>
  Todo.findById(params.id)
    .then(notFound(res))
    .then(checkAuthor(res, user, "user"))
    .then((result) => {
      if (!result) return null;
      return result;
    })
    .then((todo) => (todo ? Object.assign(todo, body).save() : null))
    .then(success(res))
    .catch(next);

export const deleteTodo = ({ params, user }, res, next) =>
  Todo.findById(params.id)
    .then(notFound(res))
    .then(checkAuthor(res, user, "user"))
    .then((todo) => (todo ? todo.remove() : null))
    .then(success(res, 200))
    .catch(next);

export const setTodoAsDone = ({ params, user }, res, next) =>
  Todo.findById(params.id)
    .then(notFound(res))
    .then(checkAuthor(res, user, "user"))
    .then((todo) => todo.complete())
    .then(success(res))
    .catch(next);

export const setTodoAsNotDone = ({ params, user }, res, next) =>
  Todo.findById(params.id)
    .then(notFound(res))
    .then(checkAuthor(res, user, "user"))
    .then((todo) => todo.incomplete())
    .then(success(res))
    .catch(next);
