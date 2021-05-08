import { promises as fs } from "fs";
init();

const times = [];

async function init() {
  try{
    const data = JSON.parse(await fs.readFile("2005.json"));

    //inicializar o array de times
    data[0].partidas.forEach(partida => {
      times.push({time: partida.mandante, pontuacao: 0});
      times.push({time: partida.visitante, pontuacao: 0});
    });

    data.forEach(rodada => {
      rodada.partidas.forEach(partida => {
        const timeMandante = times.find(item => item.time === partida.mandante);
        const timeVisitante = times.find(item => item.time === partida.visitante)
        if (partida.placar_mandante > partida.placar_visitante){
          timeMandante.pontuacao += 3;
        } else if (partida.placar_visitante > partida.placar_mandante) {
          timeVisitante.pontuacao += 3;
        } else {
          timeMandante.pontuacao += 1;
          timeVisitante.pontuacao += 1;
        }

      })
    });
    times.sort((a, b) => b.pontuacao - a.pontuacao);

    console.log(times);
    console.log("O campeão foi: " + times[0].time);

    await salvaTimes();
    await salvaG4();

    let timeMaiorNome = "";
    let timeMenorNome = times[0].time;
    times.forEach(item => {
      if (item.time.length > timeMaiorNome.length) {
        timeMaiorNome = item.time;
      }
      if (item.time.length < timeMenorNome.length) {
        timeMenorNome = item.time;
      }
    });

    console.log("Maior nome: " + timeMaiorNome);
    console.log("Menor nome: " + timeMenorNome);

  } catch (err) {
    console.log(err);
  }
  }

async function salvaTimes(){
  await fs.writeFile("times.json", JSON.stringify(times, null, 2));
}

async function salvaG4(){
  await fs.writeFile("g4.json", JSON.stringify(times.slice(0, 3), null, 2));
}

