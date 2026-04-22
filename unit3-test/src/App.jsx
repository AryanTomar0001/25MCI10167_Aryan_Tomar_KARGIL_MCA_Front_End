import React, { useState } from "react";
import NoteInput from "./components/NoteInput";
import NoteList from "./components/NoteList";

function App() {
  const [notes, setNotes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Notes App</h2>

      <NoteInput
        notes={notes}
        setNotes={setNotes}
        editIndex={editIndex}
        setEditIndex={setEditIndex}
      />

      <NoteList
        notes={notes}
        setNotes={setNotes}
        setEditIndex={setEditIndex}
      />
    </div>
  );
}

export default App;