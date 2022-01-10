import React from 'react';
import { useRef } from 'react';
import './NewTodo.css';

interface NewTodoprops {
    onTodoAdd: (todoText: string) => void;   
}

const NewTodo: React.FC<NewTodoprops> = (props) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const todoSubmitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        const enteredText = inputRef.current!.value;
        props.onTodoAdd(enteredText);
        inputRef.current!.value = '';
    }
    return (
        <form onSubmit={todoSubmitHandler}>
            <div className='form-control'>
                <label htmlFor="to-d-text">To do text</label>
                <input type="text" ref={inputRef} id="to-d-text"></input>
            </div>
            <button type='submit'>Add Todo</button>
        </form>
    )
}

export default NewTodo;
