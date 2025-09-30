import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Header from './components/Header';
import StepIndicator from './components/StepIndicator';
import PackageCard from './components/PackageCard';
import CustomizationFieldInput from './components/CustomizationFieldInput';
import SaveWebsitePrompt from './components/SaveWebsitePrompt';
import { PackageName, CustomizationType, Addon } from './types';
import type { Order, CustomizationField } from './types';
import { PACKAGES, PRICES, ADDON_PRICE, WHATSAPP_NUMBER, FABRIC_COLORS, CUSTOMIZATION_COLORS } from './constants';

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [order, setOrder] = useState<Order>({
    packageName: null,
    customizationType: CustomizationType.Print,
    addons: [],
    fields: [],
    robeColor: '',
    capColor: '',
    sashColor: '',
    customizationColor: '',
    customerName: '',
    phone: '',
    address: '',
    totalPrice: 0,
  });
  const [showSavePrompt, setShowSavePrompt] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('savePromptDismissed');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (!dismissed && !isStandalone) {
      const timer = setTimeout(() => {
        setShowSavePrompt(true);
      }, 3000); // 3-second delay
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseSavePrompt = () => {
    localStorage.setItem('savePromptDismissed', 'true');
    setShowSavePrompt(false);
  };

  const selectedPackage = useMemo(() => {
    return PACKAGES.find(p => p.name === order.packageName);
  }, [order.packageName]);

  // Effect to synchronize the fields based on selected package and addons
  useEffect(() => {
    if (!selectedPackage) {
      // No package selected, clear fields if they exist
      if (order.fields.length > 0) {
        setOrder(prev => ({...prev, fields: []}));
      }
      return;
    }

    const ADDON_FIELD_ID_MAP: Record<Addon, string> = {
      [Addon.CapFront]: 'addon_cap_front',
      [Addon.Sleeve]: 'addon_sleeve'
    };

    let desiredFields: CustomizationField[] = JSON.parse(JSON.stringify(selectedPackage.fields));

    // Rule 1: Change tassel label if CapFront addon is selected
    if (order.addons.includes(Addon.CapFront)) {
      const tasselFieldIdRegex = /_tassel$/;
      desiredFields = desiredFields.map(field => {
        if (tasselFieldIdRegex.test(field.id)) {
          return { ...field, label: 'ظهر القبعة' };
        }
        return field;
      });
    }

    // Rule 2: Add fields for each selected addon
    const addonFields = order.addons.map(addon => ({
      id: ADDON_FIELD_ID_MAP[addon],
      label: addon,
      image: null,
      description: ''
    }));

    desiredFields.push(...addonFields);

    // Merge desired fields with existing fields to preserve user input
    setOrder(prev => {
      const mergedFields = desiredFields.map(desiredField => {
        const existingField = prev.fields.find(f => f.id === desiredField.id);
        return {
          ...desiredField,
          image: existingField?.image || null,
          description: existingField?.description || ''
        };
      });
      // Avoid infinite loops by checking if fields actually changed
      if (JSON.stringify(mergedFields.map(f => ({id: f.id, label: f.label}))) !== JSON.stringify(prev.fields.map(f => ({id: f.id, label: f.label})))) {
        return { ...prev, fields: mergedFields };
      }
      return prev;
    });

  }, [selectedPackage, order.addons]);

  const isStep2Valid = useMemo(() => {
    return order.robeColor.trim() !== '' &&
           order.capColor.trim() !== '' &&
           order.sashColor.trim() !== '' &&
           order.customizationColor.trim() !== '';
  }, [order.robeColor, order.capColor, order.sashColor, order.customizationColor]);

  const isStep3Valid = useMemo(() => {
    if (order.fields.length === 0) return true;
    return order.fields.some(field => field.description.trim() !== '' || field.image !== null);
  }, [order.fields]);
  
  const isStep4Valid = useMemo(() => {
      return order.customerName.trim() !== '' &&
             order.address.trim() !== '' &&
             order.phone.trim().length === 11 &&
             /^\d{11}$/.test(order.phone.trim());
  }, [order.customerName, order.address, order.phone]);

  const handlePackageSelect = (packageName: PackageName) => {
    setOrder(prev => ({
      ...prev,
      packageName,
      fields: [], // Reset fields to let the effect repopulate them cleanly
    }));
    setStep(2);
  };

  const handleCustomizationTypeChange = (type: CustomizationType) => {
    setOrder(prev => ({ ...prev, customizationType: type }));
  };
  
  const handleColorChange = (field: keyof Order, value: string) => {
    setOrder(prev => ({ ...prev, [field]: value }));
  };

  const handleAddonToggle = (addon: Addon) => {
    // Just update the addons array. The useEffect will handle field changes.
    setOrder(prev => {
      const newAddons = prev.addons.includes(addon)
        ? prev.addons.filter(a => a !== addon)
        : [...prev.addons, addon];
      return { ...prev, addons: newAddons };
    });
  };

  const handleFieldImageChange = (fieldId: string, file: File | null) => {
    setOrder(prev => ({
        ...prev,
        fields: prev.fields.map(f => f.id === fieldId ? {...f, image: file} : f)
    }));
  };
  
  const handleFieldDescriptionChange = (fieldId: string, description: string) => {
    setOrder(prev => ({
        ...prev,
        fields: prev.fields.map(f => f.id === fieldId ? {...f, description} : f)
    }));
  };

  const totalPrice = useMemo(() => {
    if (!order.packageName) return 0;
    const basePrice = PRICES[order.packageName][order.customizationType] || 0;
    const addonsPrice = order.addons.length * ADDON_PRICE;
    const total = basePrice + addonsPrice;
    
    // This is a side-effect, but it's okay here as it's memoized with the calculation.
    if (order.totalPrice !== total) {
      setOrder(prev => ({ ...prev, totalPrice: total }));
    }

    return total;
  }, [order.packageName, order.customizationType, order.addons]);
  
  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setOrder(prev => ({ ...prev, [name]: value }));
  };

  const goToStep = (stepNumber: number) => {
    if (stepNumber < step) {
        setStep(stepNumber);
    }
  };

  const handleSubmit = () => {
      if (!isStep4Valid) {
          alert('يرجى التأكد من ملء جميع الحقول بشكل صحيح. يجب أن يتكون رقم الهاتف من 11 رقمًا.');
          return;
      }

      const {
          packageName, customizationType, addons, fields,
          customerName, phone, address, totalPrice,
          robeColor, capColor, sashColor, customizationColor
      } = order;

      let message = `
*طلب جديد من موقع SOI* 🎉
-------------------------
*👤 بيانات الزبون:*
الاسم: ${customerName}
رقم الهاتف: ${phone}
العنوان: ${address}
-------------------------
*📦 تفاصيل الطلب:*
البكج: *${packageName}*
النوع: *${customizationType}*
-------------------------
*🎨 ألوان القماش والتصميم:*
- لون الروب: *${robeColor || 'لم يحدد'}*
- لون القبعة: *${capColor || 'لم يحدد'}*
- لون الوشاح: *${sashColor || 'لم يحدد'}*
- لون ${customizationType}: *${customizationColor || 'لم يحدد'}*
-------------------------
`;

      if (addons.length > 0) {
          message += `*✨ إضافات:*
${addons.map(addon => `- ${addon}`).join('\n')}
-------------------------
`;
      }

      message += `*🎨 تفاصيل التصميم:*
`;

      const fieldsWithImages: string[] = [];
      fields.forEach(field => {
          if (field.image || field.description) {
              message += `\n*${field.label}:*\n`;
              if (field.image) {
                  message += `  - تم رفع صورة: ${field.image.name}\n`;
                  fieldsWithImages.push(field.label);
              }
              if (field.description) {
                  message += `  - الوصف: ${field.description}\n`;
              }
          }
      });
      
      if(fieldsWithImages.length > 0) {
          message += `\n*ملاحظة هامة: يرجى من الزبون الآن إرسال الصور الخاصة بالتصاميم التالية:*\n`
          message += fieldsWithImages.map(label => `- ${label}`).join('\n');
      }

      message += `
-------------------------
*💰 السعر الإجمالي: ${totalPrice.toLocaleString()} دينار عراقي*
`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
  };
  
  const renderColorPicker = (
    label: string, 
    field: 'robeColor' | 'capColor' | 'sashColor', 
    stepNumber: number
  ) => {
    const selectedColor = order[field];
    return (
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">{stepNumber}. اختر {label}</h3>
        <div className="flex flex-wrap gap-3">
          {FABRIC_COLORS.map(color => (
            <button
              key={color.hex}
              type="button"
              onClick={() => handleColorChange(field, color.name)}
              className={`w-10 h-10 rounded-full border-2 border-gray-300 transition-transform transform hover:scale-110 focus:outline-none ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-amber-500' : ''}`}
              style={{ backgroundColor: color.hex }}
              aria-label={color.name}
            />
          ))}
        </div>
        <div className="mt-4">
          <label htmlFor={`other-${field}`} className="block text-sm font-medium text-gray-700">
            لون آخر (اكتبه هنا)
          </label>
          <input
            type="text"
            id={`other-${field}`}
            placeholder="مثال: فيروزي"
            value={FABRIC_COLORS.some(c => c.name === selectedColor) ? '' : selectedColor}
            onChange={(e) => handleColorChange(field, e.target.value)}
            className="mt-1 block w-full md:w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>
    );
  };


  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="bg-white p-8 rounded-lg shadow-xl animate-fade-in-up">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">الخطوة 1: اختيار البكج</h2>
              <p className="text-center text-gray-600 mb-8">مرحباً بكم في موقع SOI! تم تصميم هذا الموقع لتسهيل عملية اختيار البكجات وحجزها بسرعة وسهولة.</p>
              <div className="flex overflow-x-auto space-x-8 pb-4 -mx-8 px-8">
                  {PACKAGES.map(pkg => (
                      <PackageCard key={pkg.name} pkg={pkg} onSelect={handlePackageSelect} />
                  ))}
              </div>
          </div>
        );
      case 2:
        if (!order.packageName) return null;
        return (
          <div className="bg-white p-8 rounded-lg shadow-xl animate-fade-in-up">
             <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">الخطوة 2: اختيار الألوان</h2>
             
             {/* Customization Type */}
             <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">1. اختر النوعية (طباعة أو تطريز)</h3>
                <div className="flex gap-4">
                  {[CustomizationType.Print, CustomizationType.Embroidery].map(type => (
                    <button key={type} onClick={() => handleCustomizationTypeChange(type)} className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${order.customizationType === type ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                      {type}
                    </button>
                  ))}
                </div>
             </div>
             
             {/* Fabric Colors */}
             {renderColorPicker('لون الروب', 'robeColor', 2)}
             {renderColorPicker('لون القبعة', 'capColor', 3)}
             {renderColorPicker('لون الوشاح', 'sashColor', 4)}
             
             
             {/* Customization Color */}
             <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">5. اختر لون {order.customizationType}</h3>
                <div className="flex flex-wrap gap-3">
                    {CUSTOMIZATION_COLORS.map(color => (
                        <button
                            key={color.hex}
                            type="button"
                            onClick={() => handleColorChange('customizationColor', color.name)}
                            className={`w-10 h-10 rounded-full border-2 border-gray-300 transition-transform transform hover:scale-110 focus:outline-none ${order.customizationColor === color.name ? 'ring-2 ring-offset-2 ring-amber-500' : ''}`}
                            style={{ backgroundColor: color.hex }}
                            aria-label={color.name}
                        />
                    ))}
                </div>
                <div className="mt-4">
                    <label htmlFor="otherCustomizationColor" className="block text-sm font-medium text-gray-700">
                        لون آخر (اكتبه هنا)
                    </label>
                    <input
                        type="text"
                        id="otherCustomizationColor"
                        placeholder="مثال: أزرق سماوي"
                        value={CUSTOMIZATION_COLORS.some(c => c.name === order.customizationColor) ? '' : order.customizationColor}
                        onChange={(e) => handleColorChange('customizationColor', e.target.value)}
                        className="mt-1 block w-full md:w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    />
                </div>
             </div>

             <div className="flex flex-col items-end mt-8">
                <div className="flex justify-between w-full">
                    <button onClick={() => goToStep(1)} className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">السابق</button>
                    <button
                        onClick={() => setStep(3)}
                        disabled={!isStep2Valid}
                        className={`text-white font-bold py-2 px-6 rounded-lg transition-colors ${
                            isStep2Valid ? 'bg-amber-500 hover:bg-amber-600' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        التالي
                    </button>
                </div>
                {!isStep2Valid && (
                    <p className="text-red-500 text-sm mt-2">
                        يرجى اختيار جميع الألوان قبل المتابعة.
                    </p>
                )}
            </div>
          </div>
        );
      case 3:
        if (!order.packageName) return null;
        return (
           <div className="bg-white p-8 rounded-lg shadow-xl animate-fade-in-up">
             <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">الخطوة 3: تفاصيل التصميم والإضافات</h2>
            
             {/* Addons */}
             <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">1. خيارات إضافية (5,000 دينار لكل إضافة)</h3>
                <div className="space-y-2">
                  {[Addon.CapFront, Addon.Sleeve].map(addon => (
                    <label key={addon} className="flex items-center p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                      <input type="checkbox" checked={order.addons.includes(addon)} onChange={() => handleAddonToggle(addon)} className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                      <span className="mr-3 text-gray-800">{addon}</span>
                    </label>
                  ))}
                </div>
             </div>
             
             {/* Custom Fields */}
             <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">2. أدخل تفاصيل التصميم لكل قطعة</h3>
                {order.fields.map(field => (
                  <CustomizationFieldInput key={field.id} field={field} onImageChange={handleFieldImageChange} onDescriptionChange={handleFieldDescriptionChange} />
                ))}
             </div>

             <div className="mt-8 text-center text-2xl font-bold text-green-600 bg-green-50 p-4 rounded-lg">
                السعر الحالي: {totalPrice.toLocaleString()} دينار عراقي
             </div>
             
             <div className="flex flex-col items-end mt-8">
                <div className="flex justify-between w-full">
                    <button onClick={() => goToStep(2)} className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">السابق</button>
                    <button
                        onClick={() => setStep(4)}
                        disabled={!isStep3Valid}
                        className={`text-white font-bold py-2 px-6 rounded-lg transition-colors ${
                            isStep3Valid ? 'bg-amber-500 hover:bg-amber-600' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        التالي
                    </button>
                </div>
                {!isStep3Valid && (
                    <p className="text-red-500 text-sm mt-2">
                        يرجى إدخال تفاصيل تصميم واحدة على الأقل (صورة أو وصف).
                    </p>
                )}
            </div>
          </div>
        );
      case 4:
        return (
            <div className="bg-white p-8 rounded-lg shadow-xl animate-fade-in-up">
                 <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">الخطوة 4: بيانات الزبون وتأكيد الطلب</h2>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Customer Info Form */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">أدخل بياناتك</h3>
                        <div>
                            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">اسم الزبون <span className="text-red-500">*</span></label>
                            <input type="text" name="customerName" id="customerName" required value={order.customerName} onChange={handleCustomerInfoChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"/>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">رقم الهاتف <span className="text-red-500">*</span></label>
                            <input type="tel" name="phone" id="phone" required value={order.phone} onChange={handleCustomerInfoChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"/>
                             {order.phone && order.phone.length !== 11 && (
                                <p className="text-red-500 text-xs mt-1">يجب أن يتكون الرقم من 11 مرتبة.</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">العنوان <span className="text-red-500">*</span></label>
                            <input type="text" name="address" id="address" required value={order.address} onChange={handleCustomerInfoChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"/>
                        </div>
                    </div>
                    
                    {/* Order Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3">ملخص الطلب</h3>
                        <div className="space-y-2 text-gray-700">
                           <p><strong>البكج:</strong> {order.packageName}</p>
                           <p><strong>النوع:</strong> {order.customizationType}</p>
                           <p><strong>لون الروب:</strong> {order.robeColor || 'لم يحدد'}</p>
                           <p><strong>لون القبعة:</strong> {order.capColor || 'لم يحدد'}</p>
                           <p><strong>لون الوشاح:</strong> {order.sashColor || 'لم يحدد'}</p>
                           <p><strong>لون {order.customizationType}:</strong> {order.customizationColor || 'لم يحدد'}</p>
                           {order.addons.length > 0 && <p><strong>الإضافات:</strong> {order.addons.join(', ')}</p>}
                           <hr className="my-2"/>
                           <p className="text-lg font-bold">السعر النهائي:</p>
                           <p className="text-2xl font-bold text-green-600">{totalPrice.toLocaleString()} دينار</p>
                        </div>
                    </div>
                 </div>

                 <div className="mt-8">
                     <button 
                        onClick={handleSubmit} 
                        disabled={!isStep4Valid}
                        className={`w-full text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg ${
                            isStep4Valid 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                      >
                        تأكيد وإرسال الطلب عبر واتساب
                     </button>
                     {!isStep4Valid && (
                        <p className="text-red-500 text-sm mt-2 text-center">
                            يرجى ملء جميع الحقول المطلوبة (*) والتأكد من صحة رقم الهاتف.
                        </p>
                    )}
                 </div>
                 <div className="flex justify-start mt-4">
                     <button onClick={() => goToStep(3)} className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">السابق</button>
                 </div>
            </div>
        );
      default:
        return <div>خطأ</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <StepIndicator currentStep={step} totalSteps={4} stepLabels={['اختيار البكج', 'اختيار الألوان', 'تفاصيل التصميم', 'التأكيد']} />
        <div className="mt-8">
          {renderStep()}
        </div>
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} SOI. جميع الحقوق محفوظة.</p>
      </footer>
      {showSavePrompt && <SaveWebsitePrompt onClose={handleCloseSavePrompt} />}
    </div>
  );
};

export default App;