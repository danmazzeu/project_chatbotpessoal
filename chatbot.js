const express = require('express');
const global = require('crypto');
const fs = require('fs');
const makeWASocket = require('@whiskeysockets/baileys').default;
const { createAuthState } = require('./repositories/authRepository');
const { createQRCodeFolder, generateQRCode } = require('./repositories/qrCodeRepository');
const { handleMessage } = require('./repositories/messageRepository');

createQRCodeFolder();

let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

const app = express();

app.get('/', async (req, res) => {
    try {
        console.log('Acessando URL, iniciando o bot...');
        const { state, saveCreds } = await createAuthState();
        const sock = makeWASocket({ auth: state });

        sock.ev.on('connection.update', async (update) => {
            console.log('Atualização de conexão:', update);
            if (update.qr) {
                console.log('QR Code gerado:', update.qr);
                await generateQRCode(update.qr);
            }
            if (update.connection === 'close') {
                console.error('Conexão fechada. Tentando reiniciar...');
                if (reconnectAttempts < maxReconnectAttempts) {
                    reconnectAttempts++;
                    console.log(`Tentativa de reconexão #${reconnectAttempts}...`);
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    await startBot();
                } else {
                    console.error('Número máximo de tentativas de reconexão alcançado.');
                }
            }
            if (update.connection === 'open') {
                console.log('Bot conectado com sucesso!');
                reconnectAttempts = 0;
            }
            if (update.connection === 'connecting') {
                console.log('Bot tentando se conectar...');
            }
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('messages.upsert', async ({ messages }) => {
            const msg = messages[0];
            if (!msg.message || msg.key.fromMe) return;

            await handleMessage(sock, msg);
        });

        res.send('Bot iniciado com sucesso!');
    } catch (error) {
        console.error('Erro ao iniciar o bot:', error);
        res.status(500).send('Erro ao iniciar o bot');
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
