
import React from 'react';

interface SaveWebsitePromptProps {
  onClose: () => void;
}

const SaveWebsitePrompt: React.FC<SaveWebsitePromptProps> = ({ onClose }) => {
  // Fix: Cast window to any to access non-standard MSStream property for iOS detection.
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  const isAndroid = /Android/.test(navigator.userAgent);

  const getInstructions = () => {
    if (isIOS) {
      return (
        <p>
          <span className="font-bold">لحفظ الموقع على جهازك (iOS):</span><br />
          1. اضغط على أيقونة المشاركة <svg className="inline h-5 w-5 mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg> في متصفح سفاري.<br />
          2. مرر للأسفل واختر "إضافة إلى الشاشة الرئيسية".
        </p>
      );
    }
    if (isAndroid) {
       return (
        <p>
          <span className="font-bold">لحفظ الموقع على جهازك (Android):</span><br />
          1. اضغط على قائمة الخيارات (الثلاث نقاط الرأسية <span className="font-bold text-xl align-middle">⋮</span>) في متصفح كروم.<br />
          2. اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".
        </p>
      );
    }
    return (
      <p>
        يمكنك إضافة هذا الموقع إلى شاشتك الرئيسية للوصول السريع إليه لاحقًا. ابحث عن خيار "إضافة إلى الشاشة الرئيسية" أو "تثبيت التطبيق" في إعدادات متصفحك.
      </p>
    );
  };

  return (
    <div className="fixed bottom-4 left-4 max-w-sm bg-white p-5 rounded-lg shadow-2xl border border-gray-200 z-50 animate-fade-in-up">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
        aria-label="إغلاق"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-1">
           <svg className="h-8 w-8 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
           </svg>
        </div>
        <div className="mr-4">
          <h4 className="text-lg font-bold text-gray-800 mb-2">
            احفظ الموقع لسهولة الوصول!
          </h4>
          <div className="text-sm text-gray-600 space-y-2">
            {getInstructions()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveWebsitePrompt;
