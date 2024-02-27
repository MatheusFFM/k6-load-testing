import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const streetFighter6 = await prisma.game.upsert({
    where: { title: 'Street Fighter 6' },
    update: {},
    create: {
      title: 'Street Fighter 6',
      price: 279.5,
      description:
        'Jogue com mestres lendários e novos favoritos dos fãs como Ryu, Chun-Li, Luke, Jamie, Kimberly e mais nesta mais nova edição.',
    },
  });

  const eaFc24 = await prisma.game.upsert({
    where: { title: 'EA SPORTS FC™ 24' },
    update: {},
    create: {
      title: 'EA SPORTS FC™ 24',
      price: 358.9,
      description:
        'O EA SPORTS FC™ 24 é uma nova era para o Jogo de Todo Mundo: mais de 19.000 atletas com licença completa, mais de 700 times e mais de 30 ligas, tudo isso na experiência de futebol mais autêntica já criada.',
    },
  });

  const granblueRising = await prisma.game.upsert({
    where: { title: 'Granblue Fantasy Versus: Rising' },
    update: {},
    create: {
      title: 'Granblue Fantasy Versus: Rising',
      price: 264.9,
      description:
        'A versão final da maior imersão nos jogos de luta! O mais novo lançamento da franquia GBVS, com todos os seus elementos melhorados!',
    },
  });

  const persona2Reload = await prisma.game.upsert({
    where: { title: 'Persona 3 Reload' },
    update: {},
    create: {
      title: 'Persona 3 Reload',
      price: 349.9,
      description:
        'Assuma o papel de um estudante transferido que acaba vivendo um destino inesperado ao ingressar na hora "oculta" entre um dia e outro. Desperte um poder incrível, investigue a misteriosa Hora Sombria, lute em nome dos seus amigos e deixe sua marca para sempre nas memórias deles.        ',
    },
  });

  const fortnite = await prisma.game.upsert({
    where: { title: 'Fortnite' },
    update: {},
    create: {
      title: 'Fortnite',
      price: 0,
      description:
        'Seja a última pessoa de pá no Battle Royale e na Construção Zero, explore e sobreviva no LEGO Fortnite, chegue voando à linha de chegada no Rocket Racing ou arranque aplausos num show no Fortnite Festival.',
    },
  });

  const godOfWarRagnarok = await prisma.game.upsert({
    where: { title: 'God of War Ragnarök' },
    update: {},
    create: {
      title: 'God of War Ragnarök',
      price: 329.9,
      description:
        'Junte-se a Kratos e Atreus em uma jornada mítica à procura de respostas na iminência do Ragnarök. Juntos, pai e filho arriscarão tudo viajando por cada um dos Nove Reinos.',
    },
  });

  const finalFantasyVIIRebirth = await prisma.game.upsert({
    where: { title: 'FINAL FANTASY VII REBIRTH' },
    update: {},
    create: {
      title: 'FINAL FANTASY VII REBIRTH',
      price: 358.9,
      description:
        'Cloud e amigos escapam da distópica cidade de Midgar e partem em uma aventura pelo planeta. Um mundo vasto e cheio de vida está à sua espera. Monte em um chocobo e explore cenários expansivos.',
    },
  });

  console.log({
    streetFighter6,
    eaFc24,
    granblueRising,
    persona2Reload,
    fortnite,
    godOfWarRagnarok,
    finalFantasyVIIRebirth,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
