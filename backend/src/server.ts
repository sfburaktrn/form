import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// In-memory storage (Temporary, as DB is skipped for now)
interface Quote {
    id: number;
    type: 'damper' | 'dorse';
    brand?: string | null;
    model?: string | null;
    cargoType?: string | null;
    thickness: string;
    volumeM3: string;
    companyName: string;
    contactPhone: string;
    email: string;
    contactPerson: string;
    paymentMethod: string;
    heardFrom?: string;
    createdAt: string;
}

const quotes: Quote[] = [];

// Type interfaces for Request Body
interface QuoteRequest {
    type: 'damper' | 'dorse';
    brand?: string;
    model?: string;
    cargoType?: string;
    thickness: string;
    volumeM3: string;
    companyName: string;
    contactPhone: string;
    email: string;
    contactPerson: string;
    paymentMethod: string;
    heardFrom?: string;
}

// Routes

// POST - Create new quote
app.post('/api/quote', (req: Request<{}, {}, QuoteRequest>, res: Response) => {
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
            paymentMethod,
            heardFrom
        } = req.body;

        // Validation
        if (!type || !companyName || !contactPhone || !email || !contactPerson) {
            res.status(400).json({
                success: false,
                message: 'Lütfen tüm zorunlu alanları doldurun.'
            });
            return;
        }

        // Create new quote object
        const newQuote: Quote = {
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
            paymentMethod: paymentMethod || 'Belirtilmedi',
            heardFrom,
            createdAt: new Date().toISOString()
        };

        // Save to in-memory array
        quotes.push(newQuote);

        console.log('Yeni teklif alındı (In-Memory):', newQuote);

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

// GET - Get all quotes (admin demo)
app.get('/api/quotes', (req: Request, res: Response) => {
    res.json({
        success: true,
        data: quotes
    });
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend sunucusu (TypeScript/In-Memory) http://localhost:${PORT} adresinde çalışıyor`);
});
