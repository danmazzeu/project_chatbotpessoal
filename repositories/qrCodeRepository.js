const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');

const qrCodeFolderPath = path.resolve(__dirname, '..', 'qrcode');
console.log(qrCodeFolderPath);

function createQRCodeFolder() {
    if (fs.existsSync(qrCodeFolderPath)) {
        fs.rmSync(qrCodeFolderPath, { recursive: true, force: true });
    }
    fs.mkdirSync(qrCodeFolderPath, { recursive: true });
    console.log('Pasta qrcode criada!');
}

async function generateQRCode(qrCode) {
    try {
        await qrcode.toFile(path.join(qrCodeFolderPath, 'qrcode.jpg'), qrCode);
        console.log('QR Code gerado com sucesso!');
    } catch (err) {
        console.error('Erro ao gerar QR Code:', err);
    }
}

module.exports = { createQRCodeFolder, generateQRCode };
