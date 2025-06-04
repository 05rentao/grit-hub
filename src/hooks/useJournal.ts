import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  timestamp: string;
};

export default function useJournal() {
    const [entries, setEntries] = useState<JournalEntry[]>([])
    const [title, setTitle] = useState('') // current entry title
    const [content, setContent] = useState('')

    useEffect(() => { // on component mount, load saved entries from localStorage
        const saved = localStorage.getItem('journalE-etries');
        if (saved) setEntries(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('journal-entries', JSON.stringify(entries));
    }, [entries]); // syncs to localStorage automatically


    const saveEntry = () => {
        const newEntry = {
            id: uuidv4(),
            title: title.trim(),
            content,
            timestamp: new Date().toISOString()
        };

        const updated = [newEntry, ...entries];
        setEntries(updated);
        setTitle(''); // clear title input
        setContent(''); // clear content input
    }

    const updateEntry = ({ id, title, content, timestamp} : JournalEntry ) => {
        const deleteEntry = entries.filter((entry) => entry.id !== id);
        const updatedEntries = [
            { id, title, content, timestamp }, 
            ...deleteEntry  
        ];
        setEntries(updatedEntries);
    }

    const deleteEntry = (id: string) => {
        const updatedEntries = entries.filter((entry) => entry.id !== id);
        setEntries(updatedEntries);
    }

    return {
    title, setTitle,
    content, setContent,
    entries, setEntries,
    saveEntry, updateEntry, deleteEntry
  };

}