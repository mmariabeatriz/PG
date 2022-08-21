const viewportSize = {
  width: Math.max(document.documentElement.clientWidth, window.innerWidth),
  height: Math.max(document.documentElement.clientHeight, window.innerHeight)
}

const canvasSize = {
  width: 900,
  height: 700
};

const targetFrameRate = 60;

function setup() {
  createCanvas(canvasSize.width, canvasSize.height);
  angleMode(DEGREES);
  frameRate(targetFrameRate);

  const initX = -20; //Especificação b): O ponto inicial da trajetória será o ponto (-20,0).
  const semicircleDrawingDuration = 4; //Especificação c): Cada semicírculo deverá ser percorrido num período de 4s.

  axes = new Axes('#7aa714', '#51abef');
  spiral = new Spiral(initX, semicircleDrawingDuration, '#8f6cb6');
}
  
function draw() {
  background('#EEEEEE');
  axes.display();
  spiral.display();
}

let axes, spiral;
class Spiral {
  initX;
  semicircleDrawingDuration;

  constructor(initX, semicircleDrawingDuration, color) {
    this.initX = initX;
    this.semicircleDrawingDuration = semicircleDrawingDuration * targetFrameRate;
    this.color = color;
  }

  display() {
    const arcsToDraw = Math.ceil(frameCount / this.semicircleDrawingDuration); //Quantidade de arcos a desenhar
    const lastAngle = ((frameCount % this.semicircleDrawingDuration) * 180) / this.semicircleDrawingDuration; //Último ângulo a ser desenhado
    
    let rad = this.initX - 0; //Raio inicia com 20 de diâmetro
    let backwards = this.initX > 0; //Faz o primeiro semicírculo começar para baixo

    //Faz a translação do centro da espiral para o meio da tela
    applyMatrix(1, 0, 0,  1, canvasSize.width/2, canvasSize.height/2); //Especificação b): O centro inicial do movimento da partícula será o ponto (0,0).

    for (let drawnArcs = 0; drawnArcs < arcsToDraw; drawnArcs++) {
      //Essa condição desenha os arcos em movimento
      if (drawnArcs === (arcsToDraw - 1) && lastAngle !== 0) {
        this.drawArc(rad, lastAngle, backwards);
      } else {
      //Essa condição desenha os arcos "passados"
        this.drawArc(rad, 180, backwards);
      }

      //Troca o arco de baixo pra cima e de cima pra baixo.
      backwards = !backwards; 

      //Essa lógica translada os semicírculos para os lados para que o início e o fim das espirais se encontrem
      if (backwards) {
        applyMatrix(1, 0, 0,  1, rad, 1);
      } else {
        applyMatrix(1, 0, 0,  1, -rad, 1);        
      }

      rad = rad * 2; //Especificação a): Os raios dobram cada vez que o arco passa pelo eixo OX.
    }
  }

  drawArc(rad, currentAngle, backwards) {
    noFill();
    strokeWeight(3);
    stroke(this.color);
    //Quando o arco estiver para baixo, vai de 360 até 180.
    if (backwards) {
      arc(0, 0, rad*2, rad*2, 360-currentAngle, 0);
    } 
    //Quando o arco estiver para cima, vai de 180 até 0
    else {
      arc(0, 0, rad*2, rad*2, 180-currentAngle, 180);
    }
  }
}

class Axes {
  x;
  y;
  
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  drawLine(x1, y1, x2, y2, color) {
    strokeWeight(1);
    stroke(color);
    line(x1, y1, x2, y2);
  }

  display() {
    this.drawLine(0, canvasSize.height / 2, canvasSize.width, canvasSize.height / 2, this.x);
    this.drawLine(canvasSize.width / 2, 0, canvasSize.width / 2, canvasSize.height, this.y);
  }
}


