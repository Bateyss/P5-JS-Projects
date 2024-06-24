
let WINDOW_WIDTH = 800;
let WINDOW_HEIGHT = 500;
let XX = WINDOW_WIDTH / 4;
let YY = (7 * WINDOW_HEIGHT) / 16;
let FPS = 60;
let desvGt = (FPS / 4) + 1;
let desvLt = FPS - desvGt;
let MODULO = FPS / 1000;
let system;
let FRECUENCIA = 1;
let AMPLITUD = 31; // Altura de la onda
let LONGITUD = 1;
let PRESION_REFERENCIA = 20;
let INTENSIDAD_REFERENCIA = 1;
let imgBocina;
let imgPlay;
let imgStop;
let startPlay = 0;
let paragFrecuencia;
let paragAmplitud;
let paragLongitud;
let paragPresionReferencia;
let paragIntensidadReferencia;
let sliderFrecuencia;
let sliderAmplitud;
let sliderLongitud;
let sliderPresionReferencia;
let sliderIntensidadReferencia;

let xspacing = 16; // Distancia entre posiciones horizontales
let w; // Ancho de la onda entera
let theta = 0.0; // Ángulo inicial en  0
let period = WINDOW_WIDTH - (WINDOW_WIDTH / 6); // Cantidad de pixeles antes de que la onda se repita
let dx; // Valor de incremento en eje x
let yvalues; // Uso de un arreglo para guardar los valores de altura de la onda
let vw = 0; // velocidad angular

let parag1;
let parag2;
let parag3;
let parag4;

function asignarValores() {
  //w = width + 16;
  w = WINDOW_WIDTH - (WINDOW_WIDTH / 6);
  //dx = ((TWO_PI / period) * (xspacing + LONGITUD));
  dx = ((TWO_PI / period) * (100 - LONGITUD));
  yvalues = new Array(floor(w / xspacing));
}

function calcWave() {
  // velocidad angular
  vw = 2 * PI * (FRECUENCIA / WINDOW_WIDTH)

  // Incrementar theta (prueba valores distintos de
  // 'velocidad angular' aquí
  //theta += 1;
  theta += vw;

  // Por cada valor de x, calcula un valor de y con la función sin()
  let x = theta;
  for (let i = 0; i < yvalues.length; i++) {
    yvalues[i] = sin(x) * AMPLITUD;
    // orientacion del movimiento
    // -= es movimiendo a la derecha
    // += es movimiendo a la izquierda
    x -= dx;
  }
}

function renderWave() {
  noStroke();
  fill(255);
  // Una manera simple de dibujar la onda con una elipse en cada punto
  for (let x = 0; x < yvalues.length; x++) {
    ellipse(x * xspacing, yvalues[x], 16, 16);
  }
}

function isOnFps() {
  var date = new Date();
  // obtenemos el nivel de modulo 1000 milisegundos
  // sobre la cantidad de fps
  // obtenemos el residuo modulo
  var residuals = date.getMilliseconds() % MODULO;
  if ((residuals > 0 && residuals < desvGt) || (residuals < 0 && residuals > desvLt)) {
    return true;
  } else {
    return false;
  }
}


function setup() {
  createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
  noStroke();
  // Dibuja todos los rectángulos desde su centro, en vez de
  // la esquina superior izquierda, que es la forma por defecto.
  //rectMode(CENTER);
  // inicia la creacion de hondas
  system = new ParticleSystem();
  let intervalo = 2000;
  setInterval(() => {
    if (startPlay)
      system.addParticle();
  }, intervalo);
  // cargar imagenes
  imgBocina = loadImage('image/speaker.png');
  imgPlay = loadImage('image/play.png');
  imgStop = loadImage('image/stop.png');

  paragIntensidadReferencia = createP('Intensidad de referencia: ' + INTENSIDAD_REFERENCIA + '*10^-12 w / m^2');
  paragIntensidadReferencia.position(30, 100);
  sliderIntensidadReferencia = createSlider(1, 100, INTENSIDAD_REFERENCIA, 1);
  sliderIntensidadReferencia.position(30 + paragIntensidadReferencia.elt.clientWidth, paragIntensidadReferencia.elt.offsetTop);
  sliderIntensidadReferencia.input(() => {
    INTENSIDAD_REFERENCIA = sliderIntensidadReferencia.value();
    paragIntensidadReferencia.elt.innerText = 'Intensidad de referencia: ' + INTENSIDAD_REFERENCIA + '*10^-12 w / m^2';
    sliderIntensidadReferencia.position(30 + paragIntensidadReferencia.elt.clientWidth, paragIntensidadReferencia.elt.offsetTop);
  });

  paragFrecuencia = createP('Frecuencia: ' + FRECUENCIA + ' Hz');
  paragFrecuencia.position(30, 20);
  sliderFrecuencia = createSlider(0.1, 10, FRECUENCIA, 0.1);
  sliderFrecuencia.position(30 + paragIntensidadReferencia.elt.clientWidth, paragFrecuencia.elt.offsetTop);
  sliderFrecuencia.input(() => {
    FRECUENCIA = sliderFrecuencia.value();
    paragFrecuencia.elt.innerText = 'Frecuencia: ' + FRECUENCIA + ' Hz';
    sliderFrecuencia.position(30 + paragIntensidadReferencia.elt.clientWidth, paragFrecuencia.elt.offsetTop);
  });


  paragAmplitud = createP('Amplitud: ' + AMPLITUD + ' m');
  paragAmplitud.position(30, 40);
  sliderAmplitud = createSlider(0, 100, AMPLITUD, 1);
  sliderAmplitud.position(30 + paragIntensidadReferencia.elt.clientWidth, paragAmplitud.elt.offsetTop);
  sliderAmplitud.input(() => {
    AMPLITUD = sliderAmplitud.value();
    paragAmplitud.elt.innerText = 'Amplitud: ' + AMPLITUD + ' m';
    sliderAmplitud.position(30 + paragIntensidadReferencia.elt.clientWidth, paragAmplitud.elt.offsetTop);
  });

  paragLongitud = createP('Longitud: ' + LONGITUD + ' m');
  paragLongitud.position(30, 60);
  sliderLongitud = createSlider(0, 100, LONGITUD, 1);
  sliderLongitud.position(30 + paragIntensidadReferencia.elt.clientWidth, paragLongitud.elt.offsetTop);
  sliderLongitud.input(() => {
    LONGITUD = sliderLongitud.value();
    paragLongitud.elt.innerText = 'Longitud: ' + LONGITUD + ' m';
    sliderLongitud.position(30 + paragIntensidadReferencia.elt.clientWidth, paragLongitud.elt.offsetTop);
    asignarValores();
  });

  paragPresionReferencia = createP('Presion de Referencia: ' + PRESION_REFERENCIA + ' μPa');
  paragPresionReferencia.position(30, 80);
  sliderPresionReferencia = createSlider(1, 100, PRESION_REFERENCIA, 1);
  sliderPresionReferencia.position(30 + paragIntensidadReferencia.elt.clientWidth, paragPresionReferencia.elt.offsetTop);
  sliderPresionReferencia.input(() => {
    PRESION_REFERENCIA = sliderPresionReferencia.value();
    paragPresionReferencia.elt.innerText = 'Presion de referencia: ' + PRESION_REFERENCIA + ' μPa';
    sliderPresionReferencia.position(30 + paragIntensidadReferencia.elt.clientWidth, paragPresionReferencia.elt.offsetTop);
  });
  asignarValores();
}

function mousePressed() {

  let vexBtnStart = [(6 * (WINDOW_WIDTH / 8)), 1 * (WINDOW_HEIGHT / 8), (6 * (WINDOW_WIDTH / 8)) + imgPlay.width, 1 * (WINDOW_HEIGHT / 8) + imgPlay.height];
  let vexBtnStop = [(7 * (WINDOW_WIDTH / 8)), 1 * (WINDOW_HEIGHT / 8), (7 * (WINDOW_WIDTH / 8)) + imgPlay.width, 1 * (WINDOW_HEIGHT / 8) + imgPlay.height];

  if (mouseX > vexBtnStart[0] && mouseX < vexBtnStart[2] && mouseY > vexBtnStart[1] && mouseY < vexBtnStart[3]) {
    startPlay = 1;
  }

  if (mouseX > vexBtnStop[0] && mouseX < vexBtnStop[2] && mouseY > vexBtnStop[1] && mouseY < vexBtnStop[3]) {
    startPlay = 0;
    system.clear();
  }

}


function draw() {
  background('skyblue');
  // suabisar y rellenar
  noStroke();
  // colorear 255 es blanco
  fill(0);
  //text('Frecuencia (Hz):', 30, 20);


  //text('Amplitud (m): ', 30, 40);

  //image(img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight], [fit], [xAlign], [yAlign])
  image(imgPlay, (6 * (WINDOW_WIDTH / 8)), 1 * (WINDOW_HEIGHT / 8));
  image(imgStop, (7 * (WINDOW_WIDTH / 8)), 1 * (WINDOW_HEIGHT / 8));





  // Dibuja relativo al centro
  //translate(width / 6, (3 * height) / 4);
  translate(width / 6, height / 2);
  // dibujar circulo
  system.run();

  //cargar imagen de bocina
  imgBocina.width = 70;
  imgBocina.height = 70;
  image(imgBocina, -1 * (imgBocina.width / 2), -1 * (imgBocina.height / 2))

  if (startPlay) calcWave();
  renderWave();
  calcularImprimir();
}

function calcularImprimir() {
  // calculos

  // presion sonora
  // presion maxima es la misma amplitud sobre raiz de 2
  let presionMaxina = AMPLITUD;
  // velocidad angular es 2*PI * frecuencia
  let velocidadAngular = vw;
  // eliminaremos el tiempo, utilizando 1 segundo como referencia
  let tiempo = 1;

  // presion angular 
  // es la amplitud por el seno de la velocidad angular en el tiempo;
  let presion = presionMaxina * sin(tiempo * velocidadAngular);

  // presion de Referencia
  // utilizaremos la del aire 20μPa
  let presionReferencia = PRESION_REFERENCIA * pow(10, -6);

  // nivel de presion sonora
  // 20 logaritmo base 10 de presion sobre amplitud
  let nivelPresionSonodaDB = 20 * log((presion / presionReferencia));

  // Intensidad sonora
  let intensidadSonora = presion / AMPLITUD;

  // presion sonora eficaz
  let presionSonoraEficaz = presionMaxina / sqrt(2);

  // intensidad sonora de referencia
  let intensidadSonoraReferencia = INTENSIDAD_REFERENCIA * pow(10, -12);

  // nivel de intensidad sonora
  let nivelIntensidadSonora = 10 * log((intensidadSonora / intensidadSonoraReferencia));

  if (parag1) {
    parag1.elt.innerText = 'presion sonora: ' + round(presion, 2) + ' ';
  } else {
    parag1 = createP('presion sonora: ' + presion + ' ');
    parag1.position(30, WINDOW_HEIGHT - 160);
  }

  if (parag2) {
    parag2.elt.innerText = 'nivel de presion sonora: ' + round(nivelPresionSonodaDB, 2) + ' dB';
  } else {
    parag2 = createP('nivel de presion sonora: ' + nivelPresionSonodaDB + ' dB');
    parag2.position(30, WINDOW_HEIGHT - 140);
  }

  if (parag3) {
    parag3.elt.innerText = 'nivel intensidad sonora: ' + round(nivelIntensidadSonora, 2) + ' dB';
  } else {
    parag3 = createP('nivel intensidad sonora: ' + nivelIntensidadSonora + ' dB');
    parag3.position(30, WINDOW_HEIGHT - 120);
  }

  if (parag4) {
    parag4.elt.innerText = 'presion sonora: ' + round(presion, 2) + ' ';
  } else {
    parag4 = createP('presion sonora: ' + presion + ' ');
    parag4.position(30, WINDOW_HEIGHT - 100);
  }
}

// Una clase simple de partícula (Particle)
class Particle {
  constructor() {
    this.frecuencia = 0;
    this.amplitud = 0;
    this.longitud = 0;
    this.velocity = 0;
    this.diametro = 0;
    this.circle = [];
    this.morph = [];
    this.vector = null;
  };

  // funcion para movimiento de particula
  run() {
    if (isOnFps()) {
      this.update();
    }
    this.display();
  };

  // Método para refrescar posición
  update() {
    this.circle = [];
    this.morph = [];
    this.diametro = this.diametro + 10;

    for (let angle = 0; angle < 360; angle += 9) {
      // Ten en cuenta que no estamos empezando desde 0 para que coincida con
      // la trayectoria de un círculo.
      this.vector = p5.Vector.fromAngle(radians(angle - 135));
      // colocar diametro
      this.vector.mult(this.diametro);
      this.circle.push(this.vector);
      // Llenemos el ArrayList de transformación con PVectores en blanco mientras estamos en ello.
      this.morph.push(createVector());
    }

    for (let i = 0; i < this.circle.length; i++) {
      // Consigue el vértice que dibujaremos
      // Transiciona hacia el objetivo...
      this.morph[i].lerp(this.circle[i], 0.1);
    }
  };

  // Método para mostrar en lienzo
  display() {
    strokeWeight(4);
    // Dibuja un polígono compuesto de todos los vértices
    beginShape();
    noFill();
    stroke(255);
    this.morph.forEach(v => {
      vertex(v.x, v.y);
    });
    endShape(CLOSE);

  };

  isDead() {
    if (this.diametro < 9000) {
      return false;
    } else {
      return true;
    }
  };

  getCapacidad() {
    return this.diametro;
  }
}


class ParticleSystem {
  constructor() {
    this.particles = [];
  };

  addParticle() {
    this.particles.push(new Particle());
  };

  run() {
    if (startPlay) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        let p = this.particles[i];
        p.run();
        if (p.isDead()) {
          this.particles.splice(i, 1);
        }
      }
    }
  }

  clear() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      this.particles.splice(i, 1);
    }
  }
}






