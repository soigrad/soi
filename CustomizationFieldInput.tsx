
import React, { useState, useEffect } from 'react';
import type { CustomizationField } from '../types';

interface CustomizationFieldInputProps {
  field: CustomizationField;
  onImageChange: (fieldId: string, file: File | null) => void;
  onDescriptionChange: (fieldId: string, description: string) => void;
}

const CustomizationFieldInput: React.FC<CustomizationFieldInputProps> = ({
  field,
  onImageChange,
  onDescriptionChange,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // This effect creates a temporary URL for the selected image file
    // and cleans it up when the component unmounts or the file changes.
    if (!field.image) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(field.image);
    setPreviewUrl(objectUrl);

    // Cleanup function: Revoke the object URL to avoid memory leaks.
    return () => URL.revokeObjectURL(objectUrl);
  }, [field.image]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onImageChange(field.id, e.target.files ? e.target.files[0] : null);
  };

  const handleRemoveImage = () => {
    onImageChange(field.id, null);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
      <label className="block text-lg font-semibold text-gray-700 mb-3">{field.label}</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`file-${field.id}`} className="block text-sm font-medium text-gray-600 mb-1">
            رفع صورة للشعار أو العبارة
          </label>
          <input
            type="file"
            id={`file-${field.id}`}
            // By adding a key that depends on the file, we ensure the input is reset
            // when the file is removed, allowing the user to select the same file again.
            key={field.image ? field.image.name : 'empty'}
            onChange={handleFileChange}
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
          />
          {previewUrl && (
            <div className="mt-4 relative w-32 h-32">
              <img src={previewUrl} alt="معاينة" className="rounded-md w-full h-full object-cover border border-gray-200" />
              <button
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md hover:bg-red-600 transition-colors"
                aria-label="إزالة الصورة"
              >
                ✕
              </button>
            </div>
          )}
        </div>
        <div>
          <label htmlFor={`desc-${field.id}`} className="block text-sm font-medium text-gray-600 mb-1">
            وصف مختصر للتصميم
          </label>
          <textarea
            id={`desc-${field.id}`}
            value={field.description}
            onChange={(e) => onDescriptionChange(field.id, e.target.value)}
            rows={3}
            placeholder="اكتب هنا العبارة أو وصف الشعار..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomizationFieldInput;
