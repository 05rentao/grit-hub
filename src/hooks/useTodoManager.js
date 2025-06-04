import { useLocalStorage } from './useLocalStorage';


export default function useTodoManager(initialLists) {
  const [lists, setLists] = useLocalStorage('todo-lists', initialLists);
    
  const addNewList = () => {
    const name = prompt('Enter list name:')
    if (name) {
      setLists([...lists, { name, items: []}])
    }
  }

  const deleteList = (listIndex) => {
    const newLists = [...lists]
    newLists.splice(listIndex, 1)
    setLists(newLists)
  }

  const addItemToList = ( listIndex, itemText ) => {
    const newLists = [...lists]
      newLists[listIndex].items.push({ text: itemText, done: false })
      setLists(newLists)
  }

  const toggleItemDone = (listIndex, itemIndex) => {
    const newLists = [...lists]
    newLists[listIndex].items[itemIndex].done = !newLists[listIndex].items[itemIndex].done
    setLists(newLists)
  }

  const deleteItem = (listIndex, itemIndex) => {
    const newLists = [...lists]
    newLists[listIndex].items.splice(itemIndex, 1)
    setLists(newLists)
  }

  return { lists, addNewList, addItemToList, deleteList, deleteItem, toggleItemDone };
}