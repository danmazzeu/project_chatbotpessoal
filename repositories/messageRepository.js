const fs = require('fs');

let userPauseStatus = {};

const responses = {
    "1": `Escolha uma opção:

*[ 1.1 ]* Idade
*[ 1.2 ]* Relacionamento
*[ 1.3 ]* Religião
*[ 1.4 ]* Cor favorita
*[ 1.5 ]* Música favorita
*[ 1.6 ]* Livro favorito
*[ 1.7 ]* Filme favorito
*[ 1.8 ]* Política
*[ 1.9 ]* Comida favorita

Opção selecionada: *1* - Sobre`,

    "2": `Escolha uma das redes sociais:

*[ 2.1 ]* Instagram

Opção selecionada: *2 - Redes Sociais*`,

    "3": `Opção selecionada: *3 - Deixar recado*.\n\nEscreva sua mensagem, te retornarei assim que possível.\n\n*_A funcionalidade da automatização irá retornar em 5 minutos._*`,

    "4": `Opção selecionada: *4 - Chave Pix*\n\nDepois eu coloco...`,

    "5": `Opção selecionada: *5 - Emergência*\n\nUm e-mail foi enviado para Daniel seguido de um SMS, já entrarei em contato contigo!`,

    "6": `Opção selecionada: *6 - Pausar automação*\n\nO sistema ficará em pausa por 10 minutos. Durante esse período, as mensagens não serão respondidas automaticamente.`,

    "7": `Opção selecionada: *7 - Meu portfólio*\n\nAqui está o portflólio: https://danielmazzeu.com.br`,

    "1.1": `Opção selecionada - *Idade*\n\nTenho 34 anos.\nSigno de câncer.`,

    "1.2": `Opção selecionada - *Relacionamento*\n\nOptei por seguir o caminho da solitude, pois foi nela que encontrei a verdadeira liberdade e o autoconhecimento. Talvez essa escolha mude com o tempo, mas até agora, não conheci alguém capaz de despertar algo tão profundo em mim, a ponto de me fazer desejar alterar esse caminho.`,

    "1.3": `Opção selecionada - *Religião*\n\nSou uma fusão de várias crenças, pois cada uma possui suas particularidades. No entanto, sei que, no fim das contas, nossa responsabilidade é para com uma única unidade universal, que chamamos de Deus. À medida que evoluo em conhecimento, percebo que há uma grande possibilidade de o teorema do demônio de Laplace ser verdadeiro, levando-nos à ideia de que, um dia, tudo poderá ser calculado. Mas, certamente, não por nós, simples e limitados humanos.`,

    "1.4": `Opção selecionada - *Cor favorita*\n\nMinha cor favorita é o laranja, mas, pela praticidade, prefiro usar apenas branco e preto no dia-a-dia. As cores ficam reservadas para projetos, ideias e decorações. Algo que eu possa expressar minha criatividade.`,

    "1.5": `Opção selecionada - *Música favorita*\n\nNão tenho uma música favorita. Antigamente, costumava ouvir muitas, mas decidi parar. A música desperta sentimentos, e esses sentimentos acabam gerando reflexões, algo que estou evitando no momento. Estou tentando fugir de mim, mas, onde quer que eu vá, acabo me encontrando.\n\nNo entanto, posso deixar uma dica de uma música que gosto bastante:\n*Sleep Token - Take Me Back To Eden*.\n\nhttps://www.youtube.com/watch?v=vFHBOKa_ZG0`,

    "1.6": `Opção selecionada - *Livro favorito*\n\nMeu livro favorito é a Bíblia, pois nela está contido tudo o que a humanidade precisa para alcançar a verdadeira perfeição. No entanto, essa jornada exige um esforço coletivo imenso, e a realização plena só poderia ser alcançada com a união de todos. Infelizmente, falhamos nesse propósito. Hoje, nossa existência se resume a tentar remendar problemas, enquanto aguardamos ser substituídos pela evolução natural - somos apenas engrenagens que, eventualmente, serão trocadas conforme seu desgaste inevitável.`,

    "1.7": `Opção selecionada - *Filme favorito*\n\nNunca fui muito de assistir filmes, mas o único que me fez repetir inúmeras vezes foi John Wick, 1, 2, 3 e 4. Esses filmes revelam segredos e valores morais de um homem de bem, que valoriza o que é realmente importante até o último segundo, mesmo que isso custe sua própria vida.\n\nhttps://www.youtube.com/watch?v=ROFnIg4_Uio`,

    "1.8": `Opção selecionada - *Política*\n\nA política muitas vezes se mostra uma perda de tempo. Ela favorece apenas aqueles que estão no poder, enquanto o povo é frequentemente negligenciado. Independentemente do partido, os políticos, em sua maioria, são os piores tipos de seres humanos. Aqueles que deveriam guiar a população com sabedoria e compaixão, usando seu conhecimento para o bem comum, acabam abusando da confiança das pessoas. Na política, a virtude parece inexistir. Se você torce para algum político ou, nem me mande mensagem.`,

    "1.9": `Opção selecionada - *Comida favorita*\n\nComo de tudo, sem frescura.\nNão sou fã de doce apenas.`,

    "2.1": `Opção selecionada - *Instagram*\n\nAqui está o meu Instagram: https://www.instagram.com/mazzeudaniel`
};

async function handleMessage(sock, msg) {
    try {
        const sender = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

        console.log(`Mensagem recebida de ${sender}: ${text}`);

        if (userPauseStatus[sender]) return;

        const mainMenu = `Olá, tudo bom? Esse chat é automatizado.
Por favor, digite o número da opção que você deseja:

*[ 1 ]* Sobre
*[ 2 ]* Redes Sociais
*[ 3 ]* Deixar recado
*[ 4 ]* Chave Pix
*[ 7 ]* Meu portfólio
*[ 5 ]* Emergência
*[ 6 ]* Pausar automação por 10 minutos`;

        if (!text || !responses[text.trim()]) {
            await sock.sendMessage(sender, { text: mainMenu });
            return;
        }

        if (text.trim() === "3") {
            userPauseStatus[sender] = true;
            setTimeout(() => {
                delete userPauseStatus[sender];
                sock.sendMessage(sender, { text: mainMenu });
            }, 300000); // 5 minutos
        }

        if (text.trim() === "6") {
            userPauseStatus[sender] = true;
            const pauseDuration = 600000; // 10 minutos (duração total da pausa)
            const countdownInterval = 120000; // 2 minutos (intervalo para a contagem regressiva)
            
            await sock.sendMessage(sender, { text: responses["6"] });
        
            let remainingTime = pauseDuration;
        
            const interval = setInterval(() => {
                remainingTime -= countdownInterval;
        
                if (remainingTime <= 0) {
                    clearInterval(interval);
                    sock.sendMessage(sender, { text: "O tempo de pausa acabou! A automação foi retomada." });
                    delete userPauseStatus[sender];
                    sock.sendMessage(sender, { text: mainMenu });
                } else {
                    const minutesRemaining = Math.ceil(remainingTime / 60000);
                    sock.sendMessage(sender, { text: `Restam *${minutesRemaining} minuto(s)* para a pausa acabar.` });
                }
            }, countdownInterval);
        
            return;
        }        

        await sock.sendMessage(sender, { text: responses[text.trim()] });

        console.log(`Resposta enviada para ${sender}: ${responses[text.trim()]}`);
    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
    }
}

module.exports = { handleMessage };
