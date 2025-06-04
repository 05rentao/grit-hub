import { useState, useEffect, useMemo } from 'react';
import useJournal from '../hooks/useJournal.ts';
import { BrushCleaning, PenLine, Trash2 } from 'lucide-react';

export default function JournalBlock() {
  const {title, setTitle, content, setContent, 
    entries, saveEntry, updateEntry, deleteEntry} = useJournal();
    
  const [selectedEntryID, setSelectedEntryID] = useState<string | null>(null);
  const selectedEntry = useMemo(() => {
    return entries.find(entry => entry.id === selectedEntryID) ?? null;
  }, [entries, selectedEntryID]);

  useEffect(() => {
    if (selectedEntry) {
      setTitle(selectedEntry.title);
      setContent(selectedEntry.content);
    } else {
      if (selectedEntryID !== null) {
        console.log(`Entry with ID ${selectedEntryID} not found`);
        setSelectedEntryID(null); // clear selection if entry not found
      }
      setTitle(''); // clear title input
      setContent(''); // clear content input
    }}, [selectedEntryID, entries]);

  const useSave = () => {
    if (selectedEntryID) {
      const selectedEntry = entries.find(entry => entry.id === selectedEntryID);
      if (selectedEntry) {
          const updatedEntry = {
            id: selectedEntryID,
            title: title.trim(),
            content,
            timestamp: selectedEntry.timestamp
          };
          updateEntry(updatedEntry);
          setSelectedEntryID(null); // clear selection after update
      }
    } else {
      saveEntry();
    }
  }

  return (
  <div className="flex justify-center items-start w-full h-full p-4 ">
    <div className="w-full h-full flex flex-col items-start m-4">
      <h2 className="text-6xl font-bold mb-8">Journal</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-2xl p-4 mb-2 border-4 border-black rounded focus"
      />
      <textarea
        placeholder="Write your entry here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full text-2xl p-4 mb-2 border-4 border-black rounded 
        flex flex-1 resize-none"
      />
      <button
        onClick={useSave}
        className="w-full bg-black text-white p-4 mb-4 border-4 border-black rounded hover:bg-white hover:text-black  transition-colors duration-300 font-bold text-2xl "
      >
        Save Entry
      </button>
    </div>

    <div className="w-full h-full flex flex-col items-start overflow-scroll m-4 px-4">
      <div className="flex flex-col w-full">
        {entries.map((entry) => (
          <div key={entry.id} 
            className="w-full text-2xl p-4 mb-2 border-4 border-black rounded
            flex flex-row justify-between items-start">
            <div className = "flex flex-1 flex-col">

              <h3 className="font-bold">{entry.title}</h3>
              <p className="line-clamp-2">{entry.content}</p>
              <small>{new Date(entry.timestamp).toLocaleString()}</small>
              
            </div>
            <div>
              <button
                onClick={() => setSelectedEntryID(entry.id)}
                className="text-blue-500 hover:underline"
              >
                <PenLine />
              </button>
              <button
                onClick={() => deleteEntry(entry.id)}
                className="text-red-500 hover:underline ml-4"
              >
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    <ResetButton />
  </div>
  )}

  export function ResetButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => {
          localStorage.removeItem('journal-entries');
          window.location.reload();
        }}
        className="flex flex-col items-center group"
      >
        <BrushCleaning
          size={48}
          className="p-2 rounded-lg m-2
            bg-red-500 text-white
            hover:bg-red-700
            transition-colors duration-300 cursor-pointer"
        />
        <span className="text-xs -mt-1.5 opacity-0 group-hover:opacity-100 transition">
          Reset storage
        </span>
      </button>
    </div>
  );
}
