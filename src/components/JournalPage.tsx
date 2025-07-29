import { useState, useEffect, useMemo } from 'react';
import useJournal from '../hooks/useJournal.ts';
import { BrushCleaning, PenLine, Trash2 } from 'lucide-react';
import ResetStorageBox from './ResetStorageButton.js';


export default function JournalBlock() {
  const {title, setTitle, content, setContent, 
    entries, saveEntry, updateEntry, deleteEntry} = useJournal();
    
  const [selectedEntryID, setSelectedEntryID] = useState<string | null>(null);
  const selectedEntry = useMemo(() => {
    return entries.find(entry => entry.id === selectedEntryID) ?? null;
  }, [entries, selectedEntryID]);

  const wordCount = (words : String) => { 
    return words.trim().split(/\s+/).length
  }

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
  <div className="flex justify-center items-start w-full h-full p-2 ">
    <div className="w-full h-full flex flex-col items-start">
      <h2 className="text-4xl font-bold mb-4">Journal</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-l p-2 mb-2 border-4 bg-bg text-txt border-border rounded focus"
      />
      <textarea
        placeholder="Write your entry here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full text-l p-2 mb-2 border-4 border-border rounded bg-bg text-txt
        flex flex-1 resize-none"
      />
      <button
        onClick={useSave}
        className="w-full bg-bg-secondary text-txt-secondary p-2 border-4 border-border rounded hover:bg-bg hover:text-txt  transition-colors duration-300 font-bold text-l"
      >
        Save Entry
      </button>
    </div>

    {/* Display existing entries */}
    
    <div className="w-full h-full flex flex-col items-start overflow-y-auto mb-8 px-4">
      <div className="flex flex-col w-full h-full">
        {entries.map((entry) => (
          <div key={entry.id} 
            className="w-full text-m p-3 mb-2 border-4 border-border rounded
            flex flex-row justify-between items-start">
            <div className = "flex flex-1 flex-col">
              <div className = "flex flex-row justify-between items-start" >
                <h3 className="font-bold">{entry.title}</h3>
                <div className = "flex flex-row gap-2 mt-1">
                  <button
                    onClick={() => setSelectedEntryID(entry.id)}
                    className="text-blue-500"
                  >
                    <PenLine size={18}/>
                  </button>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className=""
                  >
                    <Trash2 size={18}/>
                  </button>
                </div>
              </div>
              <p className="line-clamp-2">{entry.content}</p>
              <div className="text-gray-500 text-sm flex flex-row justify-start items-center">
                <small>{new Date(entry.timestamp).toLocaleString()}</small>
                <small className="ml-4">{wordCount(entry.content)} words</small>
              </div>
              
            </div>
            
          </div>
        ))}
      </div>
    </div>

    <ResetStorageBox 
      buttons={[
        { storageKey: 'journal-entries', label: 'Reset Journal' }
      ]} 
      className=''
    />
  </div>
  )}