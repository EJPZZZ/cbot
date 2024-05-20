import { MemoryDB, addKeyword, createBot, createFlow, createProvider } from '@bot-whatsapp/bot';
import { BaileysProvider } from '@bot-whatsapp/provider-baileys';

// Función para determinar si es de día o de tarde
function getSaludo() {
    const horaActual = new Date().getHours();
    if (horaActual >= 6 && horaActual < 12) {
        return 'Buenos días';
    } else if (horaActual >= 12 && horaActual < 18) {
        return 'Buenas tardes';
    } else {
        return 'Buenas noches';
    }
}

// Flujos para cada carrera
const respuestasCarreras: { [key: string]: string } = {
    
    //Mensaje de informatica
    'informatica': 'La carrera de informática trata de computadoras.',
    'informática': 'La carrera de informática trata de computadoras.',
    //Mensaje de agronomia
    'agronomia': 'Para conocer mas detalles acerca de la carrera de Ing. En Agronomia visita el siguiente enlace: \n https://www.facebook.com/TecNMRegionS/posts/pfbid026PNZ7yZkT1QLxmZAr5JrAhtsDX5YauBWM1XDL55zorPhont8m1wyMF7yM3mxn98hl',
    'agronomía': 'Para conocer mas detalles acerca de la carrera de Ing. En Agronomia visita el siguiente enlace: \n https://www.facebook.com/TecNMRegionS/posts/pfbid026PNZ7yZkT1QLxmZAr5JrAhtsDX5YauBWM1XDL55zorPhont8m1wyMF7yM3mxn98hl',
    //Mensaje de industrial
    'industrial': 'Para conocer mas detalles acerca de la carrera de Ing. Industrial visital el siguiente enlace: \n https://www.facebook.com/TecNMRegionS/posts/pfbid0PtGCzbDXDcpNxkKer14zvXk6yixePxLxNKS9E8pRQXcBHQhDKHwvPmHv3zaEQf1Ql',
    //Mensaje de renovables
    'energias renovables': 'Para conocer mas detalles acerca de la carrera de Ing. en Energias Renovables visital el siguiente enlace: \n https://www.facebook.com/TecNMRegionS/posts/pfbid02zePZUpUkRA3xsmSqfYAJ6dWotyXRnzxrthjKgoHKFraWYbvVDBNtJiDA8ej3D33zl',
    'energías renovables': 'Para conocer mas detalles acerca de la carrera de Ing. en Energias Renovables visital el siguiente enlace: \n https://www.facebook.com/TecNMRegionS/posts/pfbid02zePZUpUkRA3xsmSqfYAJ6dWotyXRnzxrthjKgoHKFraWYbvVDBNtJiDA8ej3D33zl',
    //Mensaje de bioquimica
    'bioquimica': 'Para conocer mas detalles acerca de la carrera en Ing. Bioquimica visita el siguiente enlace: \n https://www.facebook.com/TecNMRegionS/posts/pfbid0dFsd7Az2Lf6GmKswqZZoT7qNmoVTzasbLJKEoGyhRJqfPNQS6zywQ2P9jTvTtwifl',
    'bioquímica': 'Para conocer mas detalles acerca de la carrera en Ing. Bioquimica visita el siguiente enlace: \n https://www.facebook.com/TecNMRegionS/posts/pfbid0dFsd7Az2Lf6GmKswqZZoT7qNmoVTzasbLJKEoGyhRJqfPNQS6zywQ2P9jTvTtwifl',
    //Mensaje de electro
    'electromecanica': 'Para conocer mas detalles acerca de la carrera de Ing. Electromecanica visita el siguiente enlace: \n https://www.facebook.com/TecNMRegionS/posts/pfbid035zmLr35LghswfvR19tsWkW6AxpLEXkWVhoQy5Bd3Bf3YMyEudPpkLHdsiEo2hq2Ll',
    'electromecánica': 'Para conocer mas detalles acerca de la carrera de Ing. Electromecanica visita el siguiente enlace: \n https://www.facebook.com/TecNMRegionS/posts/pfbid035zmLr35LghswfvR19tsWkW6AxpLEXkWVhoQy5Bd3Bf3YMyEudPpkLHdsiEo2hq2Ll',
    //Mensaje de admi
    'administracion': 'Para conocer mas detalles acerca de la carrera de Ing. En Administracion de Empresas visita el siguiente enlace: \n https://www.facebook.com/TecNMRegionS/posts/pfbid021VD2VsPGfuENaNUgsR51oxp5oauLATC4TCvoDWbH2QeJxzyLsepQbdq4gmMxxSKul',
    'administración': 'Para conocer mas detalles acerca de la carrera de Ing. En Administracion de Empresas visita el siguiente enlace: \n https://www.facebook.com/TecNMRegionS/posts/pfbid021VD2VsPGfuENaNUgsR51oxp5oauLATC4TCvoDWbH2QeJxzyLsepQbdq4gmMxxSKul'
};

// Flujos para talleres
const respuestasTalleres: { [key: string]: string } = {
    'ajedrez': 'Mensaje personalizado para el taller de ajedrez.',
    'basquet': 'Mensaje personalizado para el taller de basquet.',
    'futbol': 'Mensaje personalizado para el taller de futbol.',
    'fútbol': 'Mensaje personalizado para el taller de futbol.',
    'taekwondo': 'Mensaje personalizado para el taller de taekwondo.'
};

// Flujo para preguntar sobre la carrera deseada
const flowInformacionCarreras = addKeyword(['1', 'Informacion', 'Información'])
    .addAnswer('Contamos con 7 carreras:\n1. Informática\n2. Agronomía\n3. Industrial\n4. Energías renovables\n5. Bioquímica\n6. Electromecánica\n7. Administración de empresas\n¿De qué carrera te gustaría información?')
    .addAnswer('Por favor, escribe el nombre de la carrera.', { capture: true }, async (ctx, { provider }) => {
        const respuesta = ctx.body.toLowerCase().trim();
        const respuestaCarrera = respuestasCarreras[respuesta];

        if (respuestaCarrera) {
            await provider.sendText(ctx.from + '@s.whatsapp.net', respuestaCarrera);
        } else {
            await provider.sendText(ctx.from + '@s.whatsapp.net', 'Lo siento, no entendí tu respuesta. Por favor, elige una de las opciones proporcionadas.');
        }
    });

// Flujo para talleres
const flowInformacionTalleres = addKeyword(['2', 'Talleres', 'talleres'])
    .addAnswer('El ITSS ofrece los siguientes talleres:\n1. Ajedrez\n2. Basquet\n3. Futbol\n4. Taekwondo\n¿De qué taller te gustaría más información? Por favor, escribe el nombre del taller.', { capture: true }, async (ctx, { provider }) => {
        const respuesta = ctx.body.toLowerCase().trim();
        const respuestaTaller = respuestasTalleres[respuesta];

        if (respuestaTaller) {
            await provider.sendText(ctx.from + '@s.whatsapp.net', respuestaTaller);
        } else {
            await provider.sendText(ctx.from + '@s.whatsapp.net', 'Lo siento, no entendí tu respuesta. Por favor, elige uno de los talleres proporcionados.');
        }
    });

// Flujo de ubicación
const flowUbicacion = addKeyword(['4', 'Ubicacion', 'Ubicación'])
    .addAnswer('Nos encontramos ubicados en📍: \nCarret. Teapa-Tacotalpa Km 4.5 Ej. Fco Javier Mina 86801 Teapa, Tabasco, Mexico');

// Flujo de inscripciones
const flowInscripciones = addKeyword(['5', 'Inscripciones', 'inscripciones'])
    .addAnswer('Para conocer mas informacion hacerca del proceso de inscripcion visita el siguiente enlace: \n https://www.facebook.com/TecNMRegionS/posts/pfbid05wGmXzisqevdd3FqvZziuLJQdXp6aL1X7KyowKrd8h3JhY4MaG96HJMYcZbjHfu3l');

// Flujo de saludo inicial
//const flowSaludoInicial = addKeyword('SaludoInicial')
   // .addAnswer(`${getSaludo()}, bienvenido al menú principal. Por favor elige una opción:\n1. Información sobre nuestras ingenierias\n2. Talleres\n3. Contáctanos\n4. Ubicación\n5. Inscripciones\nEscribe el número de la opción deseada.`);

// Flujo del menú principal
//const flowMenu = addKeyword(['Menu', 'Menú', 'menú', 'menu'])
   // .addAnswer('Hola, soy el chat-bot del ITSS 🤖 Bienvenido al menú principal. Por favor elige una opción:\n1. Información sobre nuestras ingenierias\n2. Talleres\n3. Contáctanos\n4. Ubicación\n5. Inscripciones\nEscribe el número de la opción deseada.');

// Flujos para las otras opciones del menú
const flowContacto = addKeyword(['3', 'Contacto', 'Contactanos', 'contactanos'])
    .addAnswer('Para contactarnos puedes visitarnos en nuestras redes sociales📱 \nFacebook: \nInstagram: \nX: \nTECNM- Región Sierra');

// Flujos adicionales
const flowBienvenida = addKeyword(['Hola', 'hola', '.', 'buenos dias', 'Buenos dias', 'buenas tardes', 'Buenas tardes', 'buenas noches', 'Buenas noches'])
    .addAnswer(`${getSaludo()}, Hola, soy el chat-bot del ITSS 🤖 Bienvenido al menú principal. Por favor elige una opción:\n1. Información sobre nuestras ingenierias\n2. Talleres\n3. Contáctanos\n4. Ubicación\n5. Proceso de inscripcion\nEscribe el número de la opción deseada.`);

const flowAdios = addKeyword(['Adios', 'adios', 'adiós', 'Adiós'])
    .addAnswer('Hasta luego, que tengas un buen día.\nPara ver el menú principal en cualquier momento, escribe "Menu".');

// Combinar todos los flujos en un flujo principal
const mainFlow = createFlow([
    flowInformacionCarreras,
    flowInformacionTalleres,
   // flowSaludoInicial,
    //flowMenu,
    flowContacto,
    flowUbicacion,
    flowInscripciones,
    flowBienvenida,
    flowAdios
]);

// Función principal para inicializar el bot
const main = async () => {
    const provider = createProvider(BaileysProvider);
    provider.initHttpServer(3002);

    const database = new MemoryDB();
    const bot = await createBot({
        flow: mainFlow,
        database,
        provider
    });

    const userTimeouts: { [key: string]: NodeJS.Timeout } = {};

    // Configurar el flujo del bot para manejar mensajes
    bot.on('message', async (ctx) => {
        const userId = ctx.from;
        
        // Limpiar el temporizador existente, si lo hay
        if (userTimeouts[userId]) {
            clearTimeout(userTimeouts[userId]);
        }

        // Establecer un nuevo temporizador
        userTimeouts[userId] = setTimeout(async () => {
            await provider.sendText(userId + '@s.whatsapp.net', 'Hasta luego, que tengas un buen día.\nPara ver el menú principal en cualquier momento, escribe "Menu".');
        }, 60000); // 60000ms = 1 minuto
    });
};

// Ejecutar la función principal
main();
