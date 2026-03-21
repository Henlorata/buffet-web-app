import React from 'react';
import MyQuestionProps from '@/interfaces/MyQuestion_Interface';

const MyQuestion: React.FC<MyQuestionProps> = ({
  isOpen,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-indigo-900 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all border border-gray-200">
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 mb-4 border">
            <span className="text-white text-xl font-bold">!</span>
          </div>
          <h3 className="text-xl font-bold text-gray-200">{title}</h3>
          <p className="mt-3 text-sm text-gray-100 leading-relaxed">{description}</p>
        </div>

        <div className="px-6 py-4 flex flex-row-reverse gap-3 border-t">
          
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 bg-red-700 border border-gray-300 text-white text-sm font-semibold rounded-xl hover:bg-red-800 transition-colors active:scale-95 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-md active:scale-95 cursor-pointer border"
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-white border border-black-900 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyQuestion;