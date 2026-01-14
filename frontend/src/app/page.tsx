'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface FormData {
  type: 'damper' | 'dorse' | '';
  brand: string;
  model: string;
  cargoType: string;
  thickness: string;
  volumeM3: string;
  companyName: string;
  contactPhone: string;
  email: string;
  contactPerson: string;
  heardFrom: string;
}

const initialFormData: FormData = {
  type: '',
  brand: '',
  model: '',
  cargoType: '',
  thickness: '',
  volumeM3: '',
  companyName: '',
  contactPhone: '',
  email: '',
  contactPerson: '',
  heardFrom: '',
};

export default function Home() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTypeSelect = (type: 'damper' | 'dorse') => {
    setFormData({ ...initialFormData, type });
  };

  const handleBack = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3001/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setIsSuccess(true);
      } else {
        alert(data.message || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setIsSuccess(false);
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Step validation
  const step1DamperComplete = formData.brand !== '' && formData.model !== '';
  const step2DamperComplete = formData.cargoType !== '';
  const step3DamperComplete = formData.volumeM3 !== '' && formData.thickness !== '';

  const step1DorseComplete = formData.volumeM3 !== '';
  const step2DorseComplete = formData.thickness !== '';

  const isContactValid = formData.companyName && formData.contactPhone && formData.email && formData.contactPerson;

  const isDamperValid = formData.type === 'damper' && step1DamperComplete && step2DamperComplete && step3DamperComplete && isContactValid;
  const isDorseValid = formData.type === 'dorse' && step1DorseComplete && step2DorseComplete && isContactValid;
  const isFormValid = isDamperValid || isDorseValid;

  // Auto-sync image with progress
  useEffect(() => {
    if (formData.type === 'damper') {
      if (step2DamperComplete) setCurrentImageIndex(2);
      else if (step1DamperComplete) setCurrentImageIndex(1);
      else setCurrentImageIndex(0);
    } else if (formData.type === 'dorse') {
      if (step2DorseComplete) setCurrentImageIndex(2);
      else if (step1DorseComplete) setCurrentImageIndex(1);
      else setCurrentImageIndex(0);
    }
  }, [formData.type, step1DamperComplete, step2DamperComplete, step1DorseComplete, step2DorseComplete]);

  const getCurrentImageSrc = () => {
    if (formData.type === 'damper') {
      if (currentImageIndex === 2) return '/damper-step-3.jpg';
      if (currentImageIndex === 1) return '/damper-step-2.jpg';
      return '/damper.jpg';
    } else {
      if (currentImageIndex === 2) return '/dorse-step-3.jpg';
      if (currentImageIndex === 1) return '/dorse-step-2.jpg';
      return '/dorse.jpg';
    }
  };

  // ==================== SIMPLE INITIAL SELECTION ====================
  if (!formData.type) {
    return (
      <div className="initial-selection-container">
        <h1 className="initial-title">Teklif Almak İstediğiniz Ürünü Seçin</h1>

        <div className="selection-cards">
          {/* Damper Card */}
          <div className="simple-card" onClick={() => handleTypeSelect('damper')}>
            <h2 className="card-title">Damper</h2>
            <p className="card-desc">Konfigürasyonuna başla ›</p>
          </div>

          {/* Dorse Card */}
          <div className="simple-card" onClick={() => handleTypeSelect('dorse')}>
            <h2 className="card-title">Dorse</h2>
            <p className="card-desc">Konfigürasyonuna başla ›</p>
          </div>
        </div>
      </div>
    );
  }



  // ==================== CONFIGURATOR (SPLIT SCREEN) ====================
  return (
    <div className="split-container">
      {/* Left Side: Sticky Image */}
      <div className="product-showcase">
        <button className="back-button" onClick={handleBack}>
          ‹ Geri Dön
        </button>

        <div className="product-header">
          <h2 className="product-title">{formData.type === 'damper' ? 'Damper' : 'Dorse'}</h2>
          <p className="product-subtitle">Özünlü Damper & Dorse</p>
        </div>

        <Image
          src={getCurrentImageSrc()}
          alt={formData.type}
          width={600}
          height={400}
          priority
          className="product-image"
        />

        {/* Navigation Dots */}
        <div className="image-dots">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              className={`dot ${currentImageIndex === idx ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(idx)}
              aria-label={`View image step ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Right Side: Scrollable Form */}
      <div className="form-panel">

        {isSuccess ? (
          <div className="success-content" style={{ textAlign: 'center', padding: '100px 0' }}>
            <div className="success-icon" style={{ margin: '0 auto 20px', width: '80px', height: '80px', background: '#34c759', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>✓</div>
            <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>Teşekkürler!</h2>
            <p style={{ color: '#6e6e73', marginBottom: '30px' }}>Teklifiniz alındı, en kısa sürede dönüş yapacağız.</p>
            <button className="btn-link" onClick={handleReset} style={{ color: '#0071e3', background: 'none', border: 'none', fontSize: '17px', cursor: 'pointer' }}>
              Yeni Form Oluştur
            </button>
          </div>
        ) : (
          <>
            <div className="form-intro">
              <h1>Ürün Özelliklerini Belirleyin</h1>
              <p>İhtiyacınıza en uygun çözümü sunmamız için lütfen detayları doldurun.</p>
            </div>

            {/* DAMPER FORM */}
            {formData.type === 'damper' && (
              <>
                <div className="step-section">
                  <div className="step-header">
                    <h2>Marka ve Model</h2>
                    <span className="step-description">hangi araç üzerine uygulanacak?</span>
                  </div>
                  <div className="input-row">
                    <div className="input-group">
                      <label className="input-label">Araç Markası</label>
                      <input type="text" className="input-field" placeholder="Örn: Mercedes, Ford..." value={formData.brand} onChange={(e) => handleInputChange('brand', e.target.value)} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Araç Modeli</label>
                      <input type="text" className="input-field" placeholder="Örn: 4140, Cargo..." value={formData.model} onChange={(e) => handleInputChange('model', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className={`step-section ${!step1DamperComplete ? 'locked' : ''}`}>
                  <div className="step-header">
                    <h2>Taşınacak Yük</h2>
                    <span className="step-description">araç ne taşıyacak?</span>
                  </div>
                  <div className="input-group">
                    <input type="text" className="input-field" placeholder="Örn: Hafriyat, Kum, Asfalt..." value={formData.cargoType} onChange={(e) => handleInputChange('cargoType', e.target.value)} disabled={!step1DamperComplete} />
                  </div>
                </div>

                <div className={`step-section ${!step2DamperComplete ? 'locked' : ''}`}>
                  <div className="step-header">
                    <h2>Kasa Ölçüleri</h2>
                    <span className="step-description">hacim ve kalınlık</span>
                  </div>
                  <div className="input-row">
                    <div className="input-group">
                      <label className="input-label">Hacim (m³)</label>
                      <input type="text" className="input-field" placeholder="Örn: 24" value={formData.volumeM3} onChange={(e) => handleInputChange('volumeM3', e.target.value)} disabled={!step2DamperComplete} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Taban/Yan (mm)</label>
                      <input type="text" className="input-field" placeholder="Örn: 8mm / 6mm" value={formData.thickness} onChange={(e) => handleInputChange('thickness', e.target.value)} disabled={!step2DamperComplete} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* DORSE FORM */}
            {formData.type === 'dorse' && (
              <>
                <div className="step-section">
                  <div className="step-header">
                    <h2>Dorse Hacmi</h2>
                    <span className="step-description">istenen hacim</span>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Hacim (m³)</label>
                    <input type="text" className="input-field" placeholder="Örn: 30" value={formData.volumeM3} onChange={(e) => handleInputChange('volumeM3', e.target.value)} />
                  </div>
                </div>

                <div className={`step-section ${!step1DorseComplete ? 'locked' : ''}`}>
                  <div className="step-header">
                    <h2>Dorse Kalınlığı</h2>
                    <span className="step-description">taban ve yan duvar kalınlığı</span>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Taban/Yan (mm)</label>
                    <input type="text" className="input-field" placeholder="Örn: 5mm / 4mm" value={formData.thickness} onChange={(e) => handleInputChange('thickness', e.target.value)} disabled={!step1DorseComplete} />
                  </div>
                </div>
              </>
            )}

            {/* CONTACT INFO (Shared) */}
            <div className={`step-section ${((formData.type === 'damper' && !step3DamperComplete) || (formData.type === 'dorse' && !step1DorseComplete)) ? 'locked' : ''}`}>
              <div className="step-header">
                <h2>İletişim Bilgileri</h2>
                <span className="step-description">size ulaşmamız için</span>
              </div>
              <div className="contact-grid">
                <div className="input-group">
                  <label className="input-label">Firma Adı</label>
                  <input type="text" className="input-field" placeholder="Firma Ünvanı" value={formData.companyName} onChange={(e) => handleInputChange('companyName', e.target.value)} disabled={(formData.type === 'damper' && !step3DamperComplete) || (formData.type === 'dorse' && !step2DorseComplete)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Yetkili Ad Soyad</label>
                  <input type="text" className="input-field" placeholder="İsim Soyisim" value={formData.contactPerson} onChange={(e) => handleInputChange('contactPerson', e.target.value)} disabled={(formData.type === 'damper' && !step3DamperComplete) || (formData.type === 'dorse' && !step2DorseComplete)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Telefon</label>
                  <input type="tel" className="input-field" placeholder="05XX..." value={formData.contactPhone} onChange={(e) => handleInputChange('contactPhone', e.target.value)} disabled={(formData.type === 'damper' && !step3DamperComplete) || (formData.type === 'dorse' && !step2DorseComplete)} />
                </div>
                <div className="input-group">
                  <label className="input-label">E-posta</label>
                  <input type="email" className="input-field" placeholder="mail@ornek.com" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} disabled={(formData.type === 'damper' && !step3DamperComplete) || (formData.type === 'dorse' && !step2DorseComplete)} />
                </div>
                <div className="input-group full-width">
                  <label className="input-label">Bizi Nereden Duydunuz?</label>
                  <input type="text" className="input-field" placeholder="Google, Referans..." value={formData.heardFrom} onChange={(e) => handleInputChange('heardFrom', e.target.value)} disabled={(formData.type === 'damper' && !step3DamperComplete) || (formData.type === 'dorse' && !step2DorseComplete)} />
                </div>
              </div>

              {/* Submit Section */}
              <div className="submit-section">
                <div className="submit-summary">
                  Seçiminiz: <strong>{formData.type === 'damper' ? 'Damper' : 'Dorse'}</strong>
                  {formData.volumeM3 && <> • <strong>{formData.volumeM3} m³</strong></>}
                </div>
                <button
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Teklif Al'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
