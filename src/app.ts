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
    // Puedes agregar más talleres y respuestas personalizadas aquí
};

// Flujo para preguntar sobre la carrera deseada
const flowInformacionCarreras = addKeyword(['1', 'Info', 'Informacion', 'Información'])
    .addAnswer('Contamos con 7 carreras:\n1. Informatica\n2. Agronomia\n3. Industrial\n4. Energias renovables\n5. Bioquimica\n6. Electromecanica\n7. Admi\n¿De qué carrera te gustaría información?')
    .addAnswer('Por favor, escribe el nombre de la carrera.', { capture: true }, async (ctx, {provider}) => {
        const respuesta = ctx.body.toLowerCase().trim();
        const respuestaCarrera = respuestasCarreras[respuesta];

        if (respuestaCarrera) {
            await provider.sendText(ctx.from + '@s.whatsapp.net', respuestaCarrera);
        } else {
            await provider.sendText(ctx.from + '@s.whatsapp.net', 'Lo siento, no entendí tu respuesta. Por favor, elige una de las opciones proporcionadas.');
        }
    });

// Flujo para talleres
const flowInformacionTalleres = addKeyword(['2', 'Servicios'])
    .addAnswer('El ITSS ofrece los siguientes talleres:\n1. Ajedrez\n2. Basquet\n3. Futbol\n4. Taekwondo\n¿De qué taller te gustaría más información? Por favor, escribe el nombre del taller.', { capture: true }, async (ctx, {provider}) => {
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
    .addAnswer(`${getSaludo()}, bienvenido al menú principal. Por favor elige una opción:\n1. Información\n2. Servicios\n3. Contacto\nEscribe el número de la opción deseada.`);

// Flujo del menú principal
const flowMenu = addKeyword(['Menu','Menú','menú', 'menu'])
    .addAnswer('Bienvenido al menú principal. Por favor elige una opción:\n1. Información sobre nuestras ingenierias\n2. Talleres\n3. Contactanos\nEscribe el número de la opción deseada.');

// Flujos para las otras opciones del menú
const flowContacto = addKeyword(['3', 'Contacto'])
    .addAnswer('Puedes contactarnos por correo en soporte@ejemplo.com o llamarnos al 123-456-7890.');

// Flujos adicionales
const flowBienvenida = addKeyword(['Hola', 'hola', 'ola', '.'])
    .addAnswer('¡Hola! Soy el chat-bot del ITSS🤖 ¿En qué puedo ayudarte hoy?\nSi necesitas ver el menú principal, escribe "Menú".');

const flowAyuda = addKeyword('Ayuda')
    .addAnswer('Claro, estoy aquí para ayudarte. ¿Qué necesitas saber?\nPara ver el menú principal, escribe "Menu".');

const flowAdios = addKeyword(['Adios','adios', 'adiós', 'Adiós'])
    .addAnswer('Hasta luego, que tengas un buen día.\nPara ver el menú principal en cualquier momento, escribe "Menu".');


// Combinar todos los flujos en un flujo principal
const mainFlow = createFlow([
    flowInformacionCarreras,
    flowInformacionTalleres,
    flowSaludoInicial,
    flowMenu,
    flowContacto,
    flowBienvenida,
    flowAyuda,
    flowAdios
]);

// Función principal para inicializar el bot
const main = async () => {
    const provider = createProvider(BaileysProvider);
    provider.initHttpServer(3002);

    await createBot({
        flow: mainFlow,
        database: new MemoryDB(),
        provider
    });
};

// Ejecutar la función principal
main();
