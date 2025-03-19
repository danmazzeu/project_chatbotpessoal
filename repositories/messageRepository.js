const fs = require('fs');

let isPaused = false;
const ownerNumber = '5516993630686@c.us';  // Número do dono no formato correto

async function handleMessage(sock, msg) {
    const sender = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

    // Verifica se a mensagem foi enviada pelo dono
    if (msg.key.participant !== ownerNumber) {
        return; // Ignora mensagens de outros usuários
    }

    // Se o bot estiver pausado, não faz nada
    if (isPaused) { 
        return; 
    }

    // Menu principal
    const mainMenu = `Olá, decidi me afastar um pouco da tecnologia então desenvolvi algo que me substituísse. Abaixo estão as opções para você saber sobre mim, sem eu precisar estar aqui para responder.
Por favor, digite o número da opção que você deseja:

*[ 1 ]* Sobre
*[ 2 ]* Redes Sociais
*[ 3 ]* Deixar recado
*[ 4 ]* Chave Pix
*[ 5 ]* Emergência`;

    // Exibe o menu principal caso o usuário envie uma mensagem vazia ou qualquer outra coisa
    if (!text) {
        await sock.sendMessage(sender, { text: mainMenu });
        return;
    }

    // Comando para pausar o bot
    if (text === '/stop') {
        if (!isPaused) {
            console.log('Bot pausado por comando /stop');
            isPaused = true;
            await sock.sendMessage(sender, { text: 'O bot foi pausado. Você pode retomar a qualquer momento com o comando /retomar.' });
        } else {
            await sock.sendMessage(sender, { text: 'O bot já está pausado.' });
        }
        return;
    }

    // Comando para retomar o bot
    if (text === '/start') {
        if (isPaused) {
            console.log('Bot retomado por comando /start');
            isPaused = false;
            await sock.sendMessage(sender, { text: 'O bot foi retomado e já pode responder novamente.' });
        } else {
            await sock.sendMessage(sender, { text: 'O bot já está em funcionamento.' });
        }
        return;
    }

    // Exibe submenu de "Sobre Você"
    if (text === '1') {
        const submenuSobreVoce = `Escolha uma opção:

*[ 1.1 ]* Idade
*[ 1.2 ]* Relacionamento
*[ 1.3 ]* Religião
*[ 1.4 ]* Cor favorita
*[ 1.5 ]* Música favorita
*[ 1.6 ]* Livro favorito
*[ 1.7 ]* Filme favorito
*[ 1.8 ]* Política
*[ 1.9 ]* Comida favorita

Opção selecionada: *1* - Sobre`;
        await sock.sendMessage(sender, { text: submenuSobreVoce });
        return;
    }

    // Exibe submenu de "Redes Sociais"
    if (text === '2') {
        const submenuRedesSociais = `Escolha uma das redes sociais:

*[ 2.1 ]* Instagram

Opção selecionada: *2 - Redes Sociais*`;
        await sock.sendMessage(sender, { text: submenuRedesSociais });
        return;
    }

    // Exibe submenu de "Deixar recado"
    if (text === '3') {
        await sock.sendMessage(sender, { text: 'Opção selecionada: *3 - Deixar recado*.\n\nEscreva sua mensagem, te retornarei assim que possível.\n\n*_A funcionalidade da automatização irá retornar em 3 minutos._*' });

        isPaused = true;
        setTimeout(() => {
            isPaused = false;
            sock.sendMessage(sender, { text: mainMenu });
        }, 180000); // 3 minutos = 180000 milissegundos

        return;
    }

    // Exibe submenu de "Chave Pix"
    if (text === '4') {
        await sock.sendMessage(sender, { text: 'Opção selecionada: *4 - Chave Pix*' });
        await sock.sendMessage(sender, { text: 'Depois eu coloco...' });
        return;
    }

    // Exibe submenu de "Emergência"
    if (text === '5') {
        await sock.sendMessage(sender, { text: 'Opção selecionada: *5 - Emergência*\n\nUm e-mail foi enviado para Daniel seguido de um SMS, já entrarei em contato contigo!' });
        return;
    }

    // Respostas baseadas nas escolhas do submenu
    switch (text.trim()) {
        case '1.1':
            await sock.sendMessage(sender, { text: 'Opção selecionada - *Idade*\n\nTenho 34 anos.\nSigno de câncer.' });
            break;
        case '1.2':
            await sock.sendMessage(sender, { text: 'Opção selecionada - *Relacionamento*\n\nOptei por seguir o caminho da solitude, pois foi nela que encontrei a verdadeira liberdade e o autoconhecimento. Talvez essa escolha mude com o tempo, mas até agora, não conheci alguém capaz de despertar algo tão profundo em mim, a ponto de me fazer desejar alterar esse caminho.' });
            break;
        case '1.3':
            await sock.sendMessage(sender, { text: 'Opção selecionada - *Religião*\n\nSou uma fusão de várias crenças, pois cada uma possui suas particularidades. No entanto, sei que, no fim das contas, nossa responsabilidade é para com uma única unidade universal, que chamamos de Deus. À medida que evoluo em conhecimento, percebo que há uma grande possibilidade de o teorema do demônio de Laplace ser verdadeiro, levando-nos à ideia de que, um dia, tudo poderá ser calculado. Mas, certamente, não por nós, simples e limitados humanos.' });
            break;
        case '1.4':
            await sock.sendMessage(sender, { text: 'Opção selecionada - *Cor favorita*\n\nMinha cor favorita é o laranja, mas, pela praticidade, prefiro usar apenas branco e preto no dia a dia. As cores ficam reservadas para projetos, ideias e decorações. Algo que eu possa expressar minha criatividade.' });
            break;
        case '1.5':
            await sock.sendMessage(sender, { text: 'Opção selecionada - *Música favorita*\n\nNão tenho uma música favorita. Antigamente, costumava ouvir muitas, mas decidi parar. A música desperta sentimentos, e esses sentimentos acabam gerando reflexões, algo que estou evitando no momento. Estou tentando fugir de mim, mas, onde quer que eu vá, acabo me encontrando.\n\nNo entanto, posso deixar uma dica de uma música que gosto bastante:\n*Sleep Token - Take Me Back To Eden*.' });
            break;
        case '1.6':
            await sock.sendMessage(sender, { text: 'Opção selecionada - *Livro favorito*\n\nMeu livro preferido é a Bíblia, pois nela está tudo o que a humanidade precisa para alcançar a perfeição. O problema é que isso exige um grande esforço coletivo, e o resultado máximo só poderia ser conquistado com a união de todos. Infelizmente, falhamos, miseravelmente.' });
            break;
        case '1.7':
            await sock.sendMessage(sender, { text: 'Opção selecionada - *Filme favorito*\n\nNunca fui muito de assistir filmes, mas o único que me fez repetir inúmeras vezes foi John Wick, 1, 2, 3 e 4. Esses filmes revelam segredos e valores morais de um homem de bem, que valoriza o que é realmente importante até o último segundo, mesmo que isso custe sua própria vida.\n\nhttps://www.youtube.com/watch?v=ROFnIg4_Uio' });
            break;
        case '1.8':
            await sock.sendMessage(sender, { text: 'Opção selecionada - *Política*\n\nA política muitas vezes se mostra uma perda de tempo. Ela favorece apenas aqueles que estão no poder, enquanto o povo é frequentemente negligenciado. Independentemente do partido, os políticos, em sua maioria, são os piores tipos de seres humanos. Aqueles que deveriam guiar a população com sabedoria e compaixão, usando seu conhecimento para o bem comum, acabam abusando da confiança das pessoas. Na política, a virtude parece inexistir. Se você torce para algum político, nem me mande mensagem.' });
            break;
        case '1.9':
            await sock.sendMessage(sender, { text: 'Opção selecionada - *Comida favorita*\n\nComo de tudo, sem frescura.\nNão sou fã de doce apenas.' });
            break;
        case '2.1':
            await sock.sendMessage(sender, { text: 'Opção selecionada - *Instagram*\n\nAqui está o meu Instagram: https://www.instagram.com/mazzeudaniel' });
            break;
        default:
            await sock.sendMessage(sender, { text: mainMenu });
            break;
    }
}

module.exports = { handleMessage };
