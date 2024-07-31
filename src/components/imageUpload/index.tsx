import { delete_star_image, uploadImage } from '@/API';
import { GetAlertMessage } from '@/utils';
import React, { useState, useRef } from 'react';
import { FaUpload, FaTimes } from 'react-icons/fa';

const ImageUpload = ({ code, _files, _setFiles, currentFile, setmedia, media, hide }: { code: string | null, _files: number, _setFiles: any, currentFile?: any, setmedia?: any, media?: any, hide: boolean }) => {
  const [mediaPreview, setMediaPreview] = useState<{ id: string | null, type: string, src: string } | null>(null);
  const [mediaPreviewId, setMediaPreviewId] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview({
          id: null,
          type: file.type.startsWith('video') ? 'video' : 'image',
          src: reader.result as string
        });
        setUploading(true);
        setUploadProgress(0);
        setUploadError(false);
        uploadFile(file);
      };
      reader.readAsDataURL(file);
    }
  };
  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('code', code != null ? code : "");
      formData.append('id', mediaPreviewId);
      formData.append('type', file.type.startsWith('video') ? 'video' : 'image');

      await uploadImage(formData, setUploadProgress, setUploading, setUploadError, setMediaPreviewId, _files, _setFiles);
    } catch (error) {
      setUploading(false);
      setUploadError(true);
    }
  };
  const handleRetry = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const handleCancel = () => {
    if (currentFile) {
      (async () => {

        await delete_star_image(currentFile?.id).then(x => {

          if (x && x?.isSuccess == true) {

            setmedia([...media.filter((x: any) => x.id != currentFile?.id)])

          }
          else {


          }

        }).catch((e: any) => {

        })
      })()
    }
    else {
      setMediaPreviewId("");
      setMediaPreview(null);
      setUploadProgress(0);
      setUploading(false);
      setUploadError(false);
    }

  };

  React.useEffect(() => {
    if (currentFile && currentFile?.id) {
      setMediaPreviewId(currentFile?.id);
      setMediaPreview({
        id: currentFile?.id,
        src: process.env.NEXT_PUBLIC_BASE_IMAGE_URL + "/" + currentFile?.image,
        type: currentFile?.type
      });
    }
  }, [])

  return (
    <div className="image-upload-container">
      {mediaPreview ? (
        <div className="image-preview">
          {mediaPreview.type === 'image' ? (
            <img src={mediaPreview.src} alt="Preview" />
          ) : (
            <video autoPlay={false} controls src={mediaPreview.src} />
          )}
          {
            hide == false ? <>  {uploading && (
              <div className="progress-circle img-svg">
                <svg viewBox="0 0 36 36">
                  <path
                    className="circle-bg"
                    d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="circle"
                    strokeDasharray={`${uploadProgress}, 100`}
                    d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <p>{uploadProgress} %</p>
              </div>
            )}
              {uploadError && (
                <button className="retry-button" onClick={handleRetry}>
                  Error while uploding file
                </button>
              )}
              <button className="cancel-button" onClick={handleCancel}>
                <FaTimes />
              </button></> : <></>
          }
        </div>
      ) : (
        <></>
      )}
      {
        hide == false ? <div className={`upload-icon ${(mediaPreviewId !== "" || mediaPreview != null) ? "re-upload" : ""}`} onClick={() => inputRef.current?.click()}>
          <FaUpload />
          <input
            type="file"
            accept="image/*,video/*"
            ref={inputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div> : <></>
      }
    </div>
  );
};

export default ImageUpload;
