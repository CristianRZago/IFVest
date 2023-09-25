        // Variável global para armazenar o tempo desejado em segundos
        let tempoDesejado = 600; // 10 minutos

        // Função para atualizar o contador de tempo restante em minutos e segundos
        function atualizarTempoRestante(tempo) {
            const minutos = Math.floor(tempo / 60);
            const segundos = tempo % 60;
            document.getElementById("tempo-restante").textContent = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
        }

        // Função para definir o tempo desejado a partir da variável global
        function definirTempoDesejado() {
            const campoTempoPersonalizado = document.getElementById("tempo-personalizado");
            tempoDesejado = parseInt(campoTempoPersonalizado.value) * 60; // Converte para segundos
            atualizarTempoRestante(tempoDesejado);
        }

        // JavaScript para submeter o formulário após o tempo especificado
        atualizarTempoRestante(tempoDesejado);

        const contador = setInterval(function() {
            tempoDesejado--;
            atualizarTempoRestante(tempoDesejado);

            if (tempoDesejado === 0) {
                clearInterval(contador);
                document.getElementById("questionario").submit();
            }
        }, 1000); // 1000 milissegundos = 1 segundo