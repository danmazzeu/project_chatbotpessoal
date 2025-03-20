global.crypto = require('crypto');
const fs = require('fs');
const makeWASocket = require('@whiskeysockets/baileys').default;
const { createAuthState } = require('./repositories/authRepository');
const { createQRCodeFolder, generateQRCode } = require('./repositories/qrCodeRepository');
const { handleMessage } = require('./repositories/messageRepository');

createQRCodeFolder();

let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 5000; // Aguarda 5 segundos entre tentativas

async function startBot() {
    try {
        const { state, saveCreds } = await createAuthState();
        const sock = makeWASocket({ auth: state });

        sock.ev.on('connection.update', async (update) => {
            try {
                console.log('Atualização de conexão:', update);

                if (update.qr) {
                    console.log('QR Code gerado:', update.qr);
                    await generateQRCode(update.qr);
                }

                switch (update.connection) {
                    case 'open':
                        console.log('Bot conectado com sucesso!');
                        reconnectAttempts = 0;
                        break;
                    
                    case 'close':
                        console.error('Conexão fechada. Tentando reiniciar...');
                        if (reconnectAttempts < maxReconnectAttempts) {
                            reconnectAttempts++;
                            console.log(`Tentativa de reconexão #${reconnectAttempts} em ${reconnectDelay / 1000} segundos...`);
                            await new Promise(resolve => setTimeout(resolve, reconnectDelay));
                            await startBot();
                        } else {
                            console.error('Número máximo de tentativas de reconexão alcançado.');
                        }
                        break;

                    case 'connecting':
                        console.log('Bot tentando se conectar...');
                        break;
                }
            } catch (error) {
                console.error('Erro ao atualizar conexão:', error);
            }
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('messages.upsert', async ({ messages }) => {
            try {
                const msg = messages[0];
                if (!msg.message || msg.key.fromMe) return;

                await handleMessage(sock, msg);
            } catch (error) {
                console.error('Erro ao processar mensagem:', error);
            }
        });

    } catch (error) {
        console.error('Erro ao iniciar o bot:', error);
    }
}

startBot();
