const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Geçici veri deposu (veritabanı aktif edilince kaldırılacak)
const quotes = [];

// Routes
// POST - Yeni teklif oluştur
app.post('/api/quote', (req, res) => {
  try {
    const {
      type,
      brand,
      model,
      cargoType,
      thickness,
      volumeM3,
      companyName,
      contactPhone,
      email,
      contactPerson,
      heardFrom
    } = req.body;

    // Validasyon
    if (!type || !companyName || !contactPhone || !email || !contactPerson) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen tüm zorunlu alanları doldurun.'
      });
    }

    // Yeni teklif objesi
    const newQuote = {
      id: Date.now(),
      type,
      brand: type === 'damper' ? brand : null,
      model: type === 'damper' ? model : null,
      cargoType: type === 'damper' ? cargoType : null,
      thickness,
      volumeM3,
      companyName,
      contactPhone,
      email,
      contactPerson,
      heardFrom,
      createdAt: new Date().toISOString()
    };

    // Geçici depoya ekle (ileride PostgreSQL'e kaydedilecek)
    quotes.push(newQuote);

    console.log('Yeni teklif alındı:', newQuote);

    res.status(201).json({
      success: true,
      message: 'Teklif talebiniz başarıyla alındı!',
      data: newQuote
    });
  } catch (error) {
    console.error('Teklif kaydedilirken hata:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası. Lütfen tekrar deneyin.'
    });
  }
});

// GET - Tüm teklifleri getir (admin için)
app.get('/api/quotes', (req, res) => {
  res.json({
    success: true,
    data: quotes
  });
});

// GET - Tek bir teklifi getir
app.get('/api/quote/:id', (req, res) => {
  const quote = quotes.find(q => q.id === parseInt(req.params.id));
  
  if (!quote) {
    return res.status(404).json({
      success: false,
      message: 'Teklif bulunamadı.'
    });
  }

  res.json({
    success: true,
    data: quote
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend sunucusu http://localhost:${PORT} adresinde çalışıyor`);
});
