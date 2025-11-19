import { doc, setDoc } from 'firebase/firestore';
import React, { useRef, useState } from 'react';
import { auth, db } from '../firebase/firebase'
import { collection, addDoc } from 'firebase/firestore';
const AddBook = () => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [image, setImage] = useState(null);
  const [condition, setCondition] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const formRef = useRef();

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");
    setSuccess("")
    if (!title) return setError("Title Cant be Empty")
    if (!author) return setError("Author cant be empty")
    if (!image) return setError("Image cant be empty")
    if (!condition) return setError("select a condition")
    const maxSize = 1 * 1024 * 1024;
    if (image.size > maxSize) {
      return setError("Image is too large. Maximum size allowed is 1 MB.");
    }
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return setError("You must be logged in to add book")
      }
      const uid = currentUser.uid;

      const base64Image = await convertToBase64(image);

      await addDoc(collection(db, "books"), {
        title,
        author,
        condition,
        image: base64Image,
        uid,
        createdAt: new Date(),
        status:"available"
      })
      setSuccess("Added SuccessFully");
      formRef.current.reset();
      setTitle("");
      setAuthor("");
      setImage(null);
      setCondition("");
    }
    catch (error) {
      setError("Failed to add book. Try again.");
    }


  }
  return (
    <div className='add-book-page'>
      <form onSubmit={handleSubmit} ref={formRef}>
        <h2>Add Book</h2>
        <div className="book-title">
          <input type='text' placeholder='enter book name' value={title} onChange={(e) => setTitle(e.target.value)}></input>
        </div>

        <div className="book-author">
          <input type='text' placeholder='enter author' value={author} onChange={(e) => setAuthor(e.target.value)}></input>
        </div>

        <div className="book-image">
          <label htmlFor='img-book'>
            Upload Image
          </label>
          <input type='file' id='img-book' onChange={(e) => setImage(e.target.files[0])}></input>
        </div>

        <div className="book-condition">
          <label htmlFor='cond'>
            Select Condition
          </label><br></br>
          <select value={condition} onChange={(e) => setCondition(e.target.value)} id='cond'>
            <option value="">--select--</option>
            <option value="Good">Good</option>
            <option value="Bad">Bad</option>
            <option value="Poor">Poor</option>
          </select>
        </div>
        {error && <p className='errors'>{error}</p>}
        {success && <p className='success'>{success}</p>}
        <div className="add-book">
          <button type='submit'>Add Book</button>
        </div>

      </form>
    </div>
  );
}

export default AddBook;
