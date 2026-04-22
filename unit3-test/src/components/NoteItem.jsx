function NoteItem({ note, index, notes, setNotes, setEditIndex }) {
  
  const handleDelete = () => {
    const filtered = notes.filter((_, i) => i !== index);
    setNotes(filtered);
  };

  const handleEdit = () => {
    setEditIndex(index);
  };

  return (
    <li>
      {note}
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default NoteItem;