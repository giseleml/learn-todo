import mongoose from "mongoose";
import { success, notFound } from "../../services/response";
import { Todo } from ".";

export const getAllTodos = (
  { querymen: { query, select, cursor } },
  res,
  next
) =>
  Todo.find(query, select, cursor)
    .then((todos) => todos)
    .then(success(res))
    .catch(next);

export const getSingleTodo = ({ params }, res, next) =>
  Todo.findById(params.id)
    .then((todos) => todos)
    .then(notFound(res))
    .then(success(res))
    .catch(next);

export const createTodo = ({ bodymen: { body } }, res, next) =>
  Todo.create(body)
    .then((todo) => todo)
    .then(success(res, 201))
    .catch(next);

export const updateTodo = ({ bodymen: { body }, params, user }, res, next) =>
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

export const deleteTodo = ({ params }, res, next) =>
  Todo.findById(params.id)
    .then(notFound(res))
    .then((todo) => (todo ? todo.remove() : null))
    .then(success(res, 200))
    .catch(next);

export const completeTodo = ({ params }, res, next) =>
  Todo.findById(params.id)
    .then(notFound(res))
    .then((todo) => {
      todo.completed = true;
      return todo.save();
    })
    .then((todo) => todo)
    .then(success(res))
    .catch(next);

export const incompleteTodo = ({ params }, res, next) =>
  Todo.findById(params.id)
    .then(notFound(res))
    .then((todo) => {
      todo.completed = false;
      return todo.save();
    })
    .then((todo) => todo)
    .then(success(res))
    .catch(next);
