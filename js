/**
 * KRA iTax Mobile - Backend API Server
 * Framework: Node.js with Express (Simulated)
 * Purpose: Competition Presentation - Backend Logic
 */

const express = require('express'); // Conceptual import
const app = express();
const PORT = 3000;

// --- MOCK DATABASE (Simulating MongoDB or PostgreSQL) ---
const MOCK_DB = {
    citizens: [
        { 
            id_number: "12345678", 
            phone: "0712345678", 
            full_name: "SAMUEL OKOTH OMONDI", 
            kra_pin: "A014567890Z", 
            status: "Employed", 
            employer: "Global Tech Solutions Ltd", 
            tax_due: 12450.00 
        },
        { 
            id_number: "87654321", 
            phone: "0788112233", 
            full_name: "JANE WAMBUI KAMAU", 
            kra_pin: "A099887766X", 
            status: "Self-Employed", 
            employer: "Creative Studio", 
            tax_due: 5200.00 
        }
    ],
    transactions: [] // Stores payment logs
};

// --- API ENDPOINTS ---

/**
 * 1. CITIZEN AUTHENTICATION & LOOKUP
 * Triggered when user enters ID and Phone on the login screen
 */
app.post('/api/v1/auth/lookup', (req, res) => {
    const { idNumber, phoneNumber } = req.body;
    
    // Querying the database
    const citizen = MOCK_DB.citizens.find(c => 
        c.id_number === idNumber && c.phone === phoneNumber
    );

    if (citizen) {
        return res.status(200).json({ 
            success: true, 
            data: citizen 
        });
    } else {
        return res.status(404).json({ 
            success: false, 
            message: "Record not found in National Registry" 
        });
    }
});

/**
 * 2. M-PESA STK PUSH (Safaricom Daraja API Integration)
 * Triggered when user clicks 'PAY VIA M-PESA'
 */
app.post('/api/v1/payments/stk-push', async (req, res) => {
    const { phoneNumber, amount, kraPin } = req.body;

    try {
        // Logic for Safaricom Daraja API:
        // 1. Fetch OAuth Access Token
        // 2. Format Timestamp & Password (Base64)
        // 3. Send POST request to Safaricom Sandbox/Production
        
        console.log(`[Daraja API] STK Push Sent to ${phoneNumber} for KES ${amount}`);

        // Simulate Callback from Safaricom after 3 seconds
        setTimeout(() => {
            MOCK_DB.transactions.push({
                receipt: "QH" + Math.random().toString(36).toUpperCase().substring(2, 10),
                pin: kraPin,
                amount: amount,
                timestamp: new Date().toISOString()
            });
        }, 3000);

        res.status(200).json({ 
            success: true, 
            message: "STK Push initiated successfully" 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Payment Gateway Error" });
    }
});

/**
 * 3. TAX FILING STATUS & QR GENERATOR
 * Triggered after successful payment to update the ledger
 */
app.get('/api/v1/tax/status/:pin', (req, res) => {
    const pin = req.params.pin;
    const payment = MOCK_DB.transactions.find(t => t.pin === pin);

    if (payment) {
        res.status(200).json({
            status: "PAID",
            receipt: payment.receipt,
            qr_data: `KRA-VERIFY-${payment.receipt}-${pin}`
        });
    } else {
        res.status(200).json({ status: "PENDING" });
    }
});

// Start Server
console.log(`Tax Logic Server running on port ${PORT}`);