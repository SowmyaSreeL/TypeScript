import React, {useState} from 'react';
import TodoList from './components/TodoList';
import NewTodo from './components/NewTodo';
import  { Todo } from './components/todoModal';

const App: React.FC = () => {
  const [todosArray, setTodosArray] = useState<Todo[]>([]);

  const todoAddHandler = (text: string) => {
    setTodosArray((prevTodos) => {
        return [
          ...prevTodos,
          { id: Math.random().toString(), text: text }
        ]
    })
  }

  const removeTodoHandler = (todoId: string) => {
    setTodosArray(prevState => {
      return prevState.filter(todo => todo.id !== todoId); 
    })
  }
  return (
    <div className="App">
      <NewTodo onTodoAdd={todoAddHandler} />
      <TodoList items = {todosArray} onTodoRemove={removeTodoHandler}  />
    </div>
  );
}

export default App;
