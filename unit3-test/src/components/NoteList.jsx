import NoteItem from "./NoteItem";

function NoteList({ notes, setNotes, setEditIndex }) {
  return (
    <ul>
      {notes.map((note, index) => (
        <NoteItem
          key={index}
          note={note}
          index={index}
          notes={notes}
          setNotes={setNotes}
          setEditIndex={setEditIndex}
        />
      ))}
    </ul>
  );
}

export default NoteList;