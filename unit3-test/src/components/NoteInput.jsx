import { useRef ,useEffect} from "react";

function NoteInput({ notes, setNotes, editIndex, setEditIndex }){

    const inputRef = useRef();
      useEffect(() => {

    if (editIndex !== null) {
      inputRef.current.value = notes[editIndex];
    }
  }, [editIndex]);

  const handleSubmit = () => {
    const value = inputRef.current.value.trim();
    if (!value) return;

    if (editIndex !== null) {
      // Update
      const updated = [...notes];
      updated[editIndex] = value;
      setNotes(updated);
      setEditIndex(null);
    } else {
      // Add
      setNotes([...notes, value]);
    }

    inputRef.current.value = "";
  };
    return(
    <div>
      <input ref={inputRef} placeholder="Enter note..." />
      <button onClick={handleSubmit}>
        {editIndex !== null ? "Update" : "Add"}
      </button>
    </div>
    )
}

export default NoteInput;