import React from 'react';
import './TodoList.css';

interface TodoListProps {
    items: {id: string, text: string} [];
    onTodoRemove: (todoId: string) => void;
}
const TodoList: React.FC<TodoListProps> = (props) => {
    return (
        <ul>
            {
                props.items.map((todoItem) => {
                    return(
                        <li key={todoItem.id}>
                            <span>{todoItem.text}</span>
                            <button onClick={props.onTodoRemove.bind(null, todoItem.id)}>DELETE</button>
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default TodoList;
