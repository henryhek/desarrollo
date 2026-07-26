const ruleta = document.querySelector('#ruleta');
const btnRuleta = document.querySelector('#btnRuleta');

btnRuleta.addEventListener('click', girar);
ruleta.addEventListener('click', girar);
let giros = 0;

function girar() {
  if (giros < 99999) {
    let rand = Math.random() * 10800; // Ajustado para 30 opciones
    calcular(rand);
    giros++;
    var sonido = document.querySelector('#audio');
    sonido.setAttribute('src', 'sonido/ruleta.mp3');
  } else {
    Swal.fire({
      icon: 'success',
      title: 'VUELVA PRONTO EL JUEGO TERMINO!!',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    }).then((result) => {
      if (result.value == true) {
        giros = 0;
      }
    })
  }

  function premio(premios) {
    document.querySelector('.elije').innerHTML = premios;
    $('#Modal').modal('show'); // abrir   
  }

  function calcular(rand) {
    let valor = rand / 360;
    valor = (valor - parseInt(valor.toString().split(".")[0])) * 360;

    ruleta.style.transform = "rotate(" + rand + "deg)";
    var image = document.getElementById("modal-imagen");
    var valido = document.getElementById("modal-valido");

    setTimeout(() => {
      switch (true) {
        // Ajuste de casos para 30 opciones
        case valor > 348 || valor <= 12:
          label = "Pregunta 1";
          premio("Si pudieras tener cualquier superpoder, pero solo durante un día, ¿cuál elegirías y por qué?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 12 && valor <= 24:
          label = "Pregunta 2";
          premio("¿Cuál es el peor peinado que has tenido en tu vida y tienes una foto para mostrarnos?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 24 && valor <= 36:
          label = "Pregunta 3";
          premio("Si fueras un personaje de caricatura, ¿quién serías y por qué?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 36 && valor <= 48:
          label = "Pregunta 4";
          premio("¿Cuál es la comida más rara o extraña que has probado y qué te pareció?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 48 && valor <= 60:
          label = "Pregunta 5";
          premio("Si fueras a una isla desierta y solo pudieras llevar tres cosas, ¿qué llevarías?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 60 && valor <= 72:
          label = "Pregunta 6";
          premio("¿Cuál es tu talento oculto más extraño o inesperado?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 72 && valor <= 84:
          label = "Pregunta 7";
          premio("Si pudieras intercambiar vidas con cualquier persona por una semana, ¿quién sería y por qué?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 84 && valor <= 96:
          label = "Pregunta 8";
          premio("¿Qué es lo más vergonzoso que te ha pasado en una cita?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 96 && valor <= 108:
          label = "Pregunta 9";
          premio("Si tu vida fuera una película, ¿qué género sería y quién te interpretaría?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 108 && valor <= 120:
          label = "Pregunta 10";
          premio("Si tuvieras que cantar en un karaoke ahora mismo, ¿qué canción elegirías?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 120 && valor <= 132:
          label = "Pregunta 11";
          premio("¿Cuál es el apodo más gracioso que te han puesto y quién te lo puso?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 132 && valor <= 144:
          label = "Pregunta 12";
          premio("Si pudieras inventar una nueva festividad, ¿cómo se llamaría y cómo se celebraría?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 144 && valor <= 156:
          label = "Pregunta 13";
          premio("¿Cuál es el regalo más raro o inusual que has recibido?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 156 && valor <= 168:
          label = "Pregunta 14";
          premio("Si fueras un animal, ¿cuál serías y por qué?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 168 && valor <= 180:
          label = "Pregunta 15";
          premio("¿Qué es lo más loco que has hecho por amor o amistad?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 180 && valor <= 192:
          label = "Pregunta 16";
          premio("Si pudieras viajar en el tiempo, ¿a qué época irías y qué harías allí?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 192 && valor <= 204:
          label = "Pregunta 17";
          premio("¿Cuál es la mentira más absurda que has dicho para salir de una situación incómoda?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 204 && valor <= 216:
          label = "Pregunta 18";
          premio("Si fueras una bebida, ¿qué serías y por qué?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 216 && valor <= 228:
          label = "Pregunta 19";
          premio("¿Qué objeto o accesorio ridículo tienes en tu casa que nunca mostrarías a nadie?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 228 && valor <= 240:
          label = "Pregunta 20";
          premio("Si tuvieras que pasar un día entero disfrazada, ¿qué disfraz elegirías?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 240 && valor <= 252:
          label = "Pregunta 21";
          premio("¿Cuál es el sueño más raro o absurdo que has tenido recientemente?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 252 && valor <= 264:
          label = "Pregunta 22";
          premio("Si pudieras ser una mosca en la pared, ¿en qué lugar te gustaría estar y por qué?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 264 && valor <= 276:
          label = "Pregunta 23";
          premio("¿Qué personaje de ficción crees que se parecería más a tu jefe o jefa?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 276 && valor <= 288:
          label = "Pregunta 24";
          premio("¿Cuál es tu placer culposo más inusual?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 288 && valor <= 300:
          label = "Pregunta 25";
          premio("Si pudieras elegir cualquier habilidad instantánea, como tocar un instrumento o hablar un idioma, ¿cuál sería?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 300 && valor <= 312:
          label = "Pregunta 26";
          premio("¿Qué es lo más atrevido que has hecho en un lugar público?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 312 && valor <= 324:
          label = "Pregunta 27";
          premio("¿Cuál es tu recuerdo más gracioso de la infancia?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 324 && valor <= 336:
          label = "Pregunta 28";
          premio("Si fueras a escribir un libro sobre tu vida, ¿qué título le pondrías?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 336 && valor <= 348:
          label = "Pregunta 29";
          premio("¿Qué aplicación en tu teléfono te da más vergüenza admitir que usas?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
        case valor > 348 || valor <= 360:
          label = "Pregunta 30";
          premio("Si pudieras organizar una fiesta temática sin restricciones, ¿qué tema elegirías y por qué?");
          image.classList.add("gana");
          image.classList.remove("gira", "pierde");
          valido.classList.add("mostrar");
          break;
      }

      dataLayer.push({
        'event': 'EventLanding4',
        'EventoCategoria': '6. Ruleta',
        'EventoTipo': 'Interaccion',
        'EventoEtiqueta': '6.4 Redimir descuento ' + label,
        'EventoLanding': '4218 - Ruleta'
      });

    }, 5000);
  }
}
