const express = require('express');
const makeWASocket = require('@whiskeysockets/baileys').default;
const { createAuthState } = require('./repositories/authRepository');
const { handleMessage } = require('./repositories/messageRepository');
const qrcode = require('qrcode');  // Usando a biblioteca qrcode diretamente para gerar o QR Code
const fs = require('fs');
const path = require('path');

// Caminho da pasta 'qrcode' onde o QR Code será salvo
const qrCodeFolderPath = path.resolve(__dirname, 'qrcode');
console.log('Caminho da pasta qrcode:', qrCodeFolderPath);

// Verificar se a pasta 'qrcode' existe, se não, criar
if (!fs.existsSync(qrCodeFolderPath)) {
    fs.mkdirSync(qrCodeFolderPath, { recursive: true });
    console.log('Pasta qrcode criada!');
}

const app = express();
app.use(express.static('qrcode'));

app.get('/', async (req, res) => {
    try {
        console.log('Acessando URL, iniciando o bot...');
        const { state, saveCreds } = await createAuthState();
        const sock = makeWASocket({ auth: state });

        sock.ev.on('connection.update', async (update) => {
            console.log('Atualização de conexão:', update);
            if (update.qr) {
                console.log('QR Code gerado:', update.qr);
                const qrFilePath = path.join(qrCodeFolderPath, 'qrcode.png');
                await qrcode.toFile(qrFilePath, update.qr);
                console.log('QR Code salvo em:', qrFilePath);

                res.send(`
                    <html>
                        <body>
                            <h1>Escaneie o QR Code para conectar o bot</h1>
                            <img src="/qrcode.png" alt="QR Code">
                        </body>
                    </html>
                `);
            }
            if (update.connection === 'close') {
                console.error('Conexão fechada. Tentando reiniciar...');
            }
            if (update.connection === 'open') {
                console.log('Bot conectado com sucesso!');
            }
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('messages.upsert', async ({ messages }) => {
            const msg = messages[0];
            if (!msg.message || msg.key.fromMe) return;

            await handleMessage(sock, msg);
        });

    } catch (error) {
        console.error('Erro ao iniciar o bot:', error);
        res.status(500).send('Erro ao iniciar o bot');
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
