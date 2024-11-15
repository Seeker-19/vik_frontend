import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ser, server } from "../main.jsx";
import toast from "react-hot-toast";
import { uploadFile } from "../UploadFile.js";
import { ColorRing } from "react-loader-spinner";

const PhotosUploader = ({
  loading,
  setLoading,
  photoLink,
  setPhotoLink,
  addedPhotos,
  setAddedPhotos,
}) => {
  const [uploading, setUploading] = useState(false);
  const isValidImageUrl = (url) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)(\?.*)?$/i.test(url);
  };
  const addPhotoLink = async (e) => {
    e.preventDefault();

    if (!isValidImageUrl(photoLink)) {
      toast.error("Invalid photo link! Please enter a valid image URL.");
      return;
    }

    try {
      setLoading(true);

      let link = photoLink;
      // const { data } = await axios.post(
      //   `${server}/users/upload-by-link`,
      //   {
      //     link: photoLink,
      //   },
      //   { withCredentials: true }
      // );

      setLoading(false);

      setAddedPhotos((prev) => {
        if (prev.includes(link)) {
          return prev;
        } else {
          return [...prev, link];
        }
      });

      setPhotoLink("");
      if (!addedPhotos.includes(link)) {
        toast.success("Uploaded successfully");
      }
    } catch (error) {
      toast.error("Not uploaded");
      console.log(error);
    }
  };

  const uploadPhoto = async (e) => {
    e.preventDefault();

    const files = e.target.files;
    // const data = new FormData();
    setUploading(true);

    try {
      const fileUrls = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadedUrl = await uploadFile(file);
        fileUrls.push(uploadedUrl?.secure_url);
      }

      console.log("Uploaded URLs:", fileUrls);

      setAddedPhotos((prev) => [...prev, ...fileUrls]);
      setUploading(false);
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("File upload Error");
      setUploading(false);
    }

    // for (let i = 0; i < files.length; i++) {
    //   data.append("photos", files[i]);
    // }

    // console.log(data);

    // await axios
    //   .post(`${server}/users/upload`, data, {
    //     headers: {
    //       "Content-type": "multipart/form-data",
    //     },
    //     withCredentials: true,
    //   })
    //   .then((response) => {
    //     const { files } = response.data;

    //     //console.log(files);
    //     const fileUrls = files.map((file) => `${ser}/${file}`);

    //     setAddedPhotos((prev) => {
    //       return [...prev, ...fileUrls];
    //     });
    //   })
    //   .catch((error) => console.log(error));
  };

  const removePhoto = (filename, event) => {
    event.preventDefault();

    setAddedPhotos((obj) => {
      return [...obj.filter((photo) => photo != filename)];
    });
  };

  const selectPhoto = (filename, e) => {
    e.preventDefault();

    setAddedPhotos([
      filename,
      ...addedPhotos.filter((photo) => photo != filename),
    ]);
  };

  //relative absolute

  useEffect(() => {
    console.log(addedPhotos);
  }, [addedPhotos]);

  return (
    <>
      <div className="flex gap-2">
        <input
          type="text"
          name="link"
          id="link"
          value={photoLink}
          placeholder="Add using a link ...jpg"
          onChange={(e) => setPhotoLink(e.target.value)}
        />
        <button
          onClick={addPhotoLink}
          disabled={loading || !photoLink}
          className="bg-gray-200 px-4 rounded-2xl font-bold"
        >
          Add&nbsp;photo
        </button>
      </div>

      <div className="mt-2 gap-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {(addedPhotos ?? []).length > 0 &&
          addedPhotos.map((link, index) => (
            <div key={index} className="h-32 flex relative">
              <img className="rounded-2xl object-cover w-full" src={link} />
              <button
                onClick={(event) => removePhoto(link, event)}
                className="cursor-pointer absolute bottom-2 right-2 text-white bg-black p-1 px-2 py-2 rounded-xl bg-opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => selectPhoto(link, e)}
                className="cursor-pointer absolute bottom-2 left-2 text-white bg-black p-1 px-2 py-2 rounded-xl bg-opacity-50"
              >
                {link === addedPhotos[0] && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {link !== addedPhotos[0] && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>
                )}
              </button>
            </div>
          ))}

        {uploading && (
          <div className="flex items-center justify-center">
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          </div>
        )}
        <label className="h-32 cursor-pointer flex gap-1 items-center justify-center bg-transparent border rounded-2xl p-8 text-gray-600 text-2xl">
          <input
            type="file"
            multiple
            onChange={uploadPhoto}
            className="hidden"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
          >
            <path
              fillRule="evenodd"
              d="M10.5 3.75a6 6 0 0 0-5.98 6.496A5.25 5.25 0 0 0 6.75 20.25H18a4.5 4.5 0 0 0 2.206-8.423 3.75 3.75 0 0 0-4.133-4.303A6.001 6.001 0 0 0 10.5 3.75Zm2.03 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v4.94a.75.75 0 0 0 1.5 0v-4.94l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
              clipRule="evenodd"
            />
          </svg>
          Upload
        </label>
      </div>
    </>
  );
};

export default PhotosUploader;
