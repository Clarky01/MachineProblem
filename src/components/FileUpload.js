import React, { useState } from "react";
import Papa from "papaparse";

const FileUpload = ({ onDataLoaded }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          onDataLoaded(results.data);
        },
      });
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;
