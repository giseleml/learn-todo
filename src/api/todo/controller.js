import mongoose from "mongoose";
import { success, notFound, invalidId } from "../../services/response";
import { Todo } from ".";

const isValidId = (id) => mongoose.isValidObjectId(id);

export const getAllTodos = (
  { querymen: { query, select, cursor } },
  res,
  next
) =>
  Todo.find(query, select, cursor)
    .then((todos) => todos)
    .then(success(res))
    .catch(next);

export const getSingleTodo = ({ params }, res, next) => {
  if (isValidId(params.id)) {
    Todo.findById(params.id)
      .then((todos) => todos)
      .then(notFound(res))
      .then(success(res))
      .catch(next);
  } else {
    invalidId(res);
  }
};

export const createTodo = ({ bodymen: { body } }, res, next) =>
  Todo.create(body)
    .then((todo) => todo)
    .then(success(res, 201))
    .catch(next);

export const updateTodo = ({ bodymen: { body }, params, user }, res, next) => {
  if (isValidId(params.id)) {
    Todo.findById(params.id)
      .then(notFound(res))
      .then((result) => {
        if (!result) return null;
        return result;
      })
      .then((todo) => (todo ? Object.assign(todo, body).save() : null))
      .then((todo) => todo)
      .then(success(res))
      .catch(next);
  } else {
    invalidId(res);
  }
};

export const deleteTodo = ({ params }, res, next) =>
  Todo.findById(params.id)
    .then(notFound(res))
    .then((todo) => (todo ? todo.remove() : null))
    .then(success(res, 200))
    .catch(next);
