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
    'informatica': 'La carrera de informática trata de computadoras.',
    'informática': 'La carrera de informática trata de computadoras.',
    'agronomia': 'Mensaje personalizado para Agronomía.',
    'agronomía': 'Mensaje personalizado para Agronomía.',
    'industrial': 'Mensaje personalizado para Industrial.',
    'energias renovables': 'Mensaje personalizado para Energías Renovables.',
    'energías renovables': 'Mensaje personalizado para Energías Renovables.',
    'bioquimica': 'Mensaje personalizado para Bioquímica.',
    'bioquímica': 'Mensaje personalizado para Bioquímica.',
    'electromecanica': 'Mensaje personalizado para Electromecánica.',
    'electromecánica': 'Mensaje personalizado para Electromecánica.',
    'administracion': 'Mensaje personalizado para Administración.',
    'administración': 'Mensaje personalizado para Administración.'
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

// Flujo de saludo inicial
const flowSaludoInicial = addKeyword('SaludoInicial')
    .addAnswer(`${getSaludo()}, bienvenido al menú principal. Por favor elige una opción:\n1. Información sobre nuestras ingenierias\n2. Talleres\n3. Contáctanos\nEscribe el número de la opción deseada.`);

// Flujo del menú principal
const flowMenu = addKeyword(['Menu', 'Menú', 'menú', 'menu'])
    .addAnswer(' Hola, soy el chat-bot del ITSS 🤖 Bienvenido al menú principal. Por favor elige una opción:\n1. Información sobre nuestras ingenierias\n2. Talleres\n3. Contáctanos\nEscribe el número de la opción deseada.');

// Flujos para las otras opciones del menú
const flowContacto = addKeyword(['3', 'Contacto', 'Contactanos', 'contactanos'])
    .addAnswer('Puedes contactarnos por correo en soporte@ejemplo.com o llamarnos al 123-456-7890.');

// Flujos adicionales
const flowBienvenida = addKeyword('')
    .addAnswer(`${getSaludo()}, Hola, soy el chat-bot del ITSS 🤖 Bienvenido al menú principal. Por favor elige una opción:\n1. Información sobre nuestras ingenierias\n2. Talleres\n3. Contáctanos\nEscribe el número de la opción deseada.`);

const flowAdios = addKeyword(['Adios', 'adios', 'adiós', 'Adiós'])
    .addAnswer('Hasta luego, que tengas un buen día.\nPara ver el menú principal en cualquier momento, escribe "Menu".');

// Combinar todos los flujos en un flujo principal
const mainFlow = createFlow([
    flowInformacionCarreras,
    flowInformacionTalleres,
    flowSaludoInicial,
    flowMenu,
    flowContacto,
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
