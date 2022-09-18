import { useState, useEffect } from "react";
import { storage } from "../firebase";

const useStorage = (file, fileType = "") => {
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const storageRef = storage.ref(file.name);
    if (fileType.localeCompare("vocabImg") === 0) {
      storageRef = storage.ref("vocab/"+file.name)
    }   

    storageRef.put(file).on(
      "state_changed",
      (err) => {
        setError(err);
      },
      async () => {
        const url = await storageRef.getDownloadURL();
        setUrl(url);
      }
    );
  }, [file]);

  return { url, error };
};

export default useStorage;
