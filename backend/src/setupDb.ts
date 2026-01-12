import { query } from './db';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    cargo_type VARCHAR(100),
    thickness VARCHAR(50),
    volume_m3 VARCHAR(50),
    company_name VARCHAR(150),
    contact_phone VARCHAR(50),
    email VARCHAR(150),
    contact_person VARCHAR(150),
    heard_from VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

async function setupDatabase() {
    // Önce veritabanının var olup olmadığını kontrol etmemiz lazım ama 
    // pg pool doğrudan veritabanına bağlanır.
    // Basitlik için veritabanının elle oluşturulduğunu varsayıyoruz (DB_NAME=ozunlu_quote_db).
    // Eğer yoksa 'postgres' veritabanına bağlanıp oluşturmak gerekir.

    try {
        console.log('Tablolar oluşturuluyor...');
        await query(createTableQuery); // Tablo oluştur
        console.log('✅ "quotes" tablosu hazır.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Tablo oluşturulurken hata:', err);
        process.exit(1);
    }
}

setupDatabase();
