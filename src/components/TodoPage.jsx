import React from 'react';
import { useState } from 'react';
import useTodoManager from '../hooks/useTodoManager.js';
import { X, Minus } from 'lucide-react';


export default function TodoPage() {

  const defaultLists = 
  [
    { 
      name: 'Shopping', 
      items: [{ text: 'Mouse Trap', done: false }, { text: 'Cheese', done: false }] 
    },
    { 
      name: 'This Week', 
      items: [{ text: 'Eat Cheese', done: false }, { text: "Don't get caught anymore", done: false }]
    }
  ];
  
  const { lists, addNewList, addItemToList, deleteList, deleteItem, toggleItemDone } = useTodoManager( defaultLists );

  console.log("lists", lists);

  const AddNewListButton = () => {
    return (
        <button
          onClick={addNewList}
          className="
            p-4 rounded-lg w-64 text-3xl
            box-border bg-white border-4 border-black 
            flex flex-row justify-center items-center h-full flex-shrink-0
            hover:bg-black hover:text-white transition-colors duration-300"
        >
          + Add List
        </button>
    );
  };

  return ( 
  <ul className="flex justify-start items-start p-4 overflow-x-auto w-full h-full gap-4">
    {/* Add button box */}
    {lists.map((list, i) => (
      <TodoListBox key={i}>
        <TodoList 
          name={list.name} 
          items={list.items} 
          onAddItem={(text) => addItemToList(i, text)}
          onDeleteList={() => {deleteList(i)}} // pass down delete list logic
          onToggleItem={(j) => toggleItemDone(i, j)} 
          onDeleteItem={(j) => deleteItem(i, j)}
        />
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

export function TodoList({ name, items, onAddItem, onDeleteList, onToggleItem, onDeleteItem }) {
  const [newText, setNewText] = useState('');
  // newText is the text that user inputs in the input box
  // newText is a state

  return (
    <div>
      {/* List title */}
      <div className="flex justify-start items-center m-2 mb-8">
        <h2 className="flex flex-1 text-xl font-bold">{name}</h2>
        <button 
          onClick={() => onDeleteList()}
          className="text-gray-500 hover:text-white hover:bg-black rounded-sm transition-colors duration-300 "
          >
          <Minus size={20} />
          </button>
      </div>

       {/* list of all items in this list */}
      <ul className="overflow-y-auto flex-1 pl-2">
        {items.map((item, j) => (
          <TodoItem 
            key={j} 
            item={item}
            onToggle={() => onToggleItem(j)} // pass down toggle logic
            onDelete={() => onDeleteItem(j)} // pass down delete logic
          />
        ))}
      </ul>
      <form // this is an actual box for user to imput text
        onSubmit={(e) => {
          e.preventDefault(); // prevent user from refreshing page
          if (newText.trim()) {
            onAddItem(newText);
            setNewText(''); // clear input field
          }
        }}
        className="flex mt-2"
      >
        <input 
          type="text" 
          value={newText} 
          onChange={(e) => setNewText(e.target.value)} 
          placeholder="Add new item" 
          className="flex-1 p-2 border border-gray-300 rounded-l-lg"
        />

      </form>
    </div>
  );
}

export function TodoItem({ item, onToggle, onDelete}) {
  return (
    <div className="w-full flex justify-start items-start mb-1 text-xl">
      <input 
        type="checkbox" 
        checked={item.done} 
        onChange={onToggle} 
        className="mr-2 mt-2" />

      <div className="flex flex-1 justify-start flex-wrap p-0">
        <span className={item.done ? "line-through text-gray-400" : ""}>
          {item.text}
        </span>
      </div>

      <button
        onClick={onDelete}
        className="mx-2 mt-1 hover:text-white hover:bg-black rounded-sm transition-colors duration-300 text-gray-500"
        >
        <X size={20} />
      </button>
      
    </div>
  );
}

