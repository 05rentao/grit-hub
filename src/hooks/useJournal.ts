import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  timestamp: string;
};

export default function useJournal() {
    const [entries, setEntries] = useLocalStorage('journal-entries', [{
        id: uuidv4(),
        title: 'First Entry',
        content: 'This is my first journal entry.',
        timestamp: new Date().toISOString()
    }]);
    const [title, setTitle] = useState('') // current entry title
    const [content, setContent] = useState('')

    const saveEntry = () => {
        const newEntry = {
            id: uuidv4(),
            title: title.trim(),
            content,
            timestamp: new Date().toISOString()
        };

        const updated = [newEntry, ...entries];
        setEntries(updated);
        console.log('Updated entries after save:', updated);
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