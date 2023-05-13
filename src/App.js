import { useState } from "react";
import Modal from "./components/Modal";

function App() {
  const [images, setImages] = useState(null);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const surpriseOptions = [
    "Cristiano Ronaldo is sitting on a throne while Messi is bowing his head to him",
    "Real Madrid have won the champions league title in season 22/23 for the 15th time in history",
    "Vinicius Junior receives a ballon dor for 2023",
  ];

  const getImages = async () => {
    if (value == null) {
      setError("ERROR! Must have a search term!");
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/images", options);
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const surpriseMe = async () => {
    setImages(null);
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const uploadImage = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    setModalOpen(true);
    setSelectedImage(e.target.files[0]);
    e.target.value = null;

    try {
      const options = {
        method: "POST",
        body: formData,
      };
      const response = await fetch("http://localhost:8000/upload", options);
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  const generateVariations = async () => {
    setImages(null);
    if (selectedImage === null) {
      setError("Select an image first!");
      setModalOpen(false);
      return;
    }
    try {
      const options = {
        method: "POST",
      };
      const response = await fetch("http://localhost:8000/variations", options);
      const data = await response.json();
      setImages(data);
      setError(null);
      setModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <section className="search-section">
        <p>
          Start with a detailed description
          <span className="surprise" onClick={surpriseMe}>
            Surprise me
          </span>
        </p>
        <div className="input-container">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Real Madrid have been named the best football club of 21st century"
          />
          <button onClick={getImages}>Generate</button>
        </div>
        <p className="extra-info">
          Or{" "}
          <span>
            <label htmlFor="files">upload an image </label>
            <input
              onChange={uploadImage}
              id="files"
              accept="image/*"
              type="file"
              hidden
            />
            to edit.
          </span>
        </p>
        {error && <p>{error}</p>}
        {modalOpen && (
          <div className="overlay">
            <Modal
              setModalOpen={setModalOpen}
              setSelectedImage={setSelectedImage}
              selectedImage={selectedImage}
              generateVariations={generateVariations}
            />
          </div>
        )}
      </section>
      <section className="image-section">
        {images?.map((image, idx) => (
          <img key={idx} src={image.url} alt={value}></img>
        ))}
      </section>
    </div>
  );
}

export default App;
