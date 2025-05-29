import React from 'react';
import { useState } from 'react';


export default function TodoPage() {
  const [lists, setLists] = useState([
    { name: 'This Week', items: ['Task A', 'Task B'] },
    { name: 'Shopping', items: ['Item 1', 'Item 2'] }
  ])

  const addNewList = () => {
    const name = prompt('Enter list name:')
    if (name) {
      setLists([...lists, { name, items: [] }])
    }
  }
  
  function AddNewListButton() {
  return (
      <button
      onClick={addNewList}
      className="
      p-4 rounded-lg w-64 text-3xl
      box-border bg-white border-4 border-black 
      flex flex-row justify-center items-center h-full flex-shrink-0
      hover:bg-black hover:text-white transition-colors duration-300
    "
      >+ Add List</button>
  )}

  return (
  <ul className="flex justify-start items-start p-4 overflow-x-auto w-full h-full gap-4">
    {/* Add button box */}
    {lists.map((list, index) => (
      <TodoListBox key={index}>
        <TodoList name={list.name} items={list.items} />
      </TodoListBox>
    ))}
    <AddNewListButton />
  </ul>
  )}

 

export function TodoListBox({ children, className = ''}) {
  //TODO: Add functionality to add new items to the list
  //TODO: make lists checkboxes with strikethrough functionality
  return (
    <div className="p-4 rounded-lg w-64 
    box-border bg-white border-4 border-black 
    flex flex-col h-full flex-shrink-0">
      <div className={`${className}`}>
        {children}
      </div>
    </div>
  );
}

export function TodoList({ name, items }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">{name}</h2>

      <ul className="overflow-y-auto flex-1 pl-2">
        {items.map((item, index) => (
          <TodoItem key={index} item={item} />
        ))}
      </ul>
    </div>
  );
}

export function TodoItem({ item }) {
  return (
    <li className="flex justify-start items-center mb-1 text-xl">
      <input type="checkbox" className="mr-2" />
      <span>{item}</span>
    </li>
  );
}

