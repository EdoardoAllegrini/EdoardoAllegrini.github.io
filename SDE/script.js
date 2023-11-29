"use strict";

var sde_sel = document.getElementById("Stock");

const l = ["empty","Arithmetic","Geometric","Ornstein","Vasicek","Hull","Cox","Black","Heston","Chen","any-sde"];
const tl = ["nothing selected", "Arithmetic Brownian", "Geometric Brownian (BlackS-choles)", "Ornstein-Uhlenbeck (mean-reverting)", "Vasicek", "Hull-White", "Cox-Ingersoll-Ross", "Black-Karasinski", "Heston", "Chen model", "any other SDE"];

function initial() {
for (let i in l) {
  var tmp = document.createElement('option');
  tmp.value = l[i];
  tmp.textContent = tl[i];
  sde_sel.appendChild(tmp);
}
}

initial()

const FCIV = "FCI";
const SCIV = "SCI";
const it_iscv = document.getElementById("it_iscv");
const it_ifcv = document.getElementById("it_ifcv");
const FCI = document.getElementById("FCI");
const SCI = document.getElementById("SCI");
const ctx = FCI.getContext("2d");
const ctx2 = SCI.getContext("2d");
let rea = 0;
let what_shu = [];


function initializeGraph(labelGraph) {
  ctx.clearRect(0, 0, FCIV.width, FCIV.height);

  const myChart = new Chart(FCIV, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: labelGraph,
          data: [],
          borderColor: "#91192A",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: "Euler method",
      },
      elements: {
        line: {
          tension: 0.1,
        },
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });

  what_shu.push(myChart);
}

function clicketto(context) {

  var em_set = document.getElementById("RK").checked;
  
  destroyCanvas();
  if (context == "any-sde") {
    stochasticEulerMethod();
    stochasticRungeKuttaMethod();
    return
  }


  for (let i = 0; i<2;i++) {
    if (em_set == false && i == 1) {
      break;
    }
    switch (context) {
      case "Arithmetic":
        ArithmeticBrownianMotion(i);
        break;
      case "Geometric":
        GeometricBrownianMotion(i);
        break;
      case "Ornstein":
        OU(i);
        break;
      case "Vasicek":
        Vasicek(i);
        break;
      case "Hull":
        HullWhite(i);
        break;
      case "Cox":
        CoxIngersollRoss(i);
        break;
      case "Black":
        BlackKarasinski(i);
        break;
      case "Heston":
        Heston(i);
        break;
      case "Chen":
        Chen(i);
        break;
    }
  }

}


function destroyCanvas() {
  for (let c of what_shu) c.destroy();
  what_shu.shift();
}
document.getElementById("Stock").addEventListener("change", function () {
  destroyCanvas();
  let selectedAlg = this.value;
  let inputForms = document.getElementsByClassName("input-form");
  for (let i = 0; i < inputForms.length; i++) {
    inputForms[i].style.display = "none";
  }

  switch (selectedAlg) {
    case "empty":
      it_iscv.style.display = "none";
      it_ifcv.style.display = "none";
      break;
    case "Arithmetic":
    case "Geometric":
    case "Ornstein":
    case "Vasicek":
    case "Hull":
    case "Cox":
    case "Black":
    case "Heston":
    case "Chen":
    case "any-sde":
      document.getElementById(`${selectedAlg}I`).style.display = "block";
      it_iscv.style.display = "none";
      it_ifcv.style.display = "none";
      break;
  }
});

function getRandomRGBAColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const a = Math.random();
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function ArithmeticBrownianMotion(paramRK) {
  rea = parseInt(document.getElementById("ABinstances").value);

  const numSteps = parseInt(document.getElementById("ABnumSteps").value);
  const xValues = Array.from({ length: numSteps }, (_, i) => i);
  const labelGraph = "Arithmetic Brownian Motion";
  if (paramRK == 0) {
    initializeGraph(labelGraph);
    it_iscv.style.display = "block";
  } else if (paramRK == 1) {
    initializeGraph2(labelGraph);
    it_ifcv.style.display = "block";
  }
  const mu = parseFloat(document.getElementById("ABmu").value);
  const sigma = parseFloat(document.getElementById("ABsigma").value);
  const X0 = parseInt(document.getElementById("ABX0").value);
  const dt = parseFloat(document.getElementById("ABdt").value);
  let yValues = [X0];
  let newValue = 0;

  for (let j = 0; j < rea; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW = Math.sqrt(dt) * normalDistribution();
      if (paramRK == 0) {
        newValue = mu * dt + sigma * dW;
      } else if (paramRK == 1) {
        const k = mu * dt + sigma * dW;
        newValue = mu * dt * k + sigma * dW;
      }
      yValues.push(yValues[i] + newValue);
      newValue = 0;
    }
    addLine(xValues, yValues, paramRK);
    yValues = [X0];
  }
}

function GeometricBrownianMotion(paramRK) {
  const numSteps = parseInt(document.getElementById("GBnumSteps").value, 10);
  const rea = parseInt(document.getElementById("GBinstances").value, 10);
  const xValues = Array.from({ length: numSteps }, (_, i) => i);
  const labelGraph = "Geometric Brownian Motion";

  if (paramRK === 0) {
    initializeGraph(labelGraph);
    document.getElementById("it_iscv").style.display = "block";
  } else if (paramRK === 1) {
    initializeGraph2(labelGraph);
    document.getElementById("it_ifcv").style.display = "block";
  }

  const mu = parseFloat(document.getElementById("GBmu").value);
  const sigma = parseFloat(document.getElementById("GBsigma").value);
  const dt = parseFloat(document.getElementById("GBdt").value);
  const S0 = parseInt(document.getElementById("GBS0").value, 10);

  let yValues = [S0];
  let newValue = 0;

  for (let j = 0; j < rea; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW = Math.sqrt(dt) * normalDistribution();

      if (paramRK === 0) {
        newValue = mu * yValues[i] * dt + sigma * yValues[i] * dW;
      } else if (paramRK === 1) {
        const k = mu * yValues[i] * dt + sigma * yValues[i] * dW;
        newValue = mu * yValues[i] * dt * k + sigma * yValues[i] * dW;
      }

      yValues.push(yValues[i] + newValue);
      newValue = 0;
    }
    addLine(xValues, yValues);
    yValues = [S0];
  }
}



function OU(paramRK) {
  rea = parseInt(document.getElementById("OUinstances").value);
  let numSteps = parseInt(document.getElementById("OUnumSteps").value);
  const xValues = Array.from({ length: numSteps }, (_, i) => i);

  if (paramRK == 0) {
    initializeGraph("Ornstein-Uhlenbeck");
    it_iscv.style.display = "block";
  } else if (paramRK == 1) {
    initializeGraph2("Ornstein-Uhlenbeck");
    it_ifcv.style.display = "block";
  }
  const theta = parseInt(document.getElementById("OUtheta").value);
  const sigma = parseFloat(document.getElementById("OUsigma").value); 
  const X0 = parseInt(document.getElementById("OUX0").value);
  const mu = parseInt(document.getElementById("OUmu").value);
  const dt = parseFloat(document.getElementById("OUdt").value);
  let yValues = [X0];
  let newValue = 0;

  for (let j = 0; j < rea; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW = Math.sqrt(dt) * normalDistribution();
      const k = theta * (mu - yValues[i]) * dt + sigma * dW;
      if (paramRK == 0) {
        newValue = theta * (mu - yValues[i]) * dt + sigma * dW;
      } else if (paramRK == 1) {
        const k = theta * (mu - yValues[i]) * dt + sigma * dW;
        newValue = theta * (mu - yValues[i] * k) * dt + sigma * dW;
      }
      yValues.push(yValues[i] + newValue);
      newValue = 0;
    }
    addLine(xValues, yValues);
    yValues = [X0];
  }
}

function Vasicek(paramRK) {
  rea = parseInt(document.getElementById("Vinstances").value);
  let numSteps = parseInt(document.getElementById("VnumSteps").value);
  const xValues = Array.from({ length: numSteps }, (_, i) => i);

  if (paramRK == 0) {
    initializeGraph("Vasicek");
    it_iscv.style.display = "block";
  } else if (paramRK == 1) {
    initializeGraph2("Vasicek");
    it_ifcv.style.display = "block";
  }
  const k = parseFloat(document.getElementById("Vk").value);
  const theta = parseFloat(document.getElementById("Vtheta").value);
  const sigma = parseFloat(document.getElementById("Vsigma").value);
  const R0 = parseInt(document.getElementById("VR0").value);
  const dt = parseFloat(document.getElementById("Vdt").value);
  let yValues = [R0];
  let rt = 0;
  for (let j = 0; j < rea; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW = Math.sqrt(dt) * normalDistribution();
      if (paramRK == 0) {
        rt = k * (theta - yValues[i]) * dt + sigma * Math.sqrt(dt) * dW;
      } else if (paramRK == 1) {
        let val = k * (theta - yValues[i]) * dt + sigma * Math.sqrt(dt) * dW;
        rt = k * (theta - yValues[i] * val) * dt + sigma * Math.sqrt(dt) * dW;
      }
      yValues.push(yValues[i] + rt);
    }
    addLine(xValues, yValues);
    yValues = [R0];
  }
}

function HullWhite(paramRK) {
  rea = parseInt(document.getElementById("HWinstances").value);
  const numSteps = parseInt(document.getElementById("hwNumSteps").value);
  const xValues = Array.from({ length: numSteps }, (_, i) => i);

  const theta1 = parseFloat(document.getElementById("hwTheta1").value);
  const theta2 = parseFloat(document.getElementById("hwTheta2").value);
  const a = parseFloat(document.getElementById("hwA").value);
  const sigma = parseFloat(document.getElementById("hwSigma").value);
  const R0 = parseFloat(document.getElementById("hwR0").value);
  const dt = parseFloat(document.getElementById("hwDt").value);
  let yValues = [R0];
  let newValue = 0;
  if (paramRK == 0) {
    initializeGraph("Hull-White");
    it_iscv.style.display = "block";
  } else if (paramRK == 1) {
    initializeGraph2("Hull-White");
    it_ifcv.style.display = "block";
  }
  for (let j = 0; j < rea; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW = Math.sqrt(dt) * normalDistribution();
      if (paramRK == 0) {
        newValue = (theta1 + theta2 * i - a * yValues[i]) * dt + sigma * dW;
      } else if (paramRK == 1) {
        const k = (theta1 + theta2 * i - a * yValues[i]) * dt + sigma * dW;
        newValue = (theta1 + theta2 * i * k - a * yValues[i]) * dt + sigma * dW;
      }
      yValues.push(yValues[i] + newValue);
      newValue = 0;
    }
    addLine(xValues, yValues);
    yValues = [R0];
  }
}

function CoxIngersollRoss(paramRK) {
  rea = parseInt(document.getElementById("CIRinstances").value);
  const numSteps = parseInt(document.getElementById("CIRNumSteps").value);
  const xValues = Array.from({ length: numSteps }, (_, i) => i);

  if (paramRK == 0) {
    initializeGraph("Cox-Ingersoll-Ross");
    it_iscv.style.display = "block";
  } else if (paramRK == 1) {
    initializeGraph2("Cox-Ingersoll-Ross");
    it_ifcv.style.display = "block";
  }
  const k = parseFloat(document.getElementById("CIRK").value);
  const theta = parseFloat(document.getElementById("CIRTheta").value);
  const sigma = parseFloat(document.getElementById("CIRSigma").value);
  const R0 = parseFloat(document.getElementById("CIRR0").value);
  const dt = parseFloat(document.getElementById("CIRdt").value);
  let yValues = [R0];
  let newValue = 0;
  for (let j = 0; j < rea; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW = Math.sqrt(dt) * normalDistribution();

      if (paramRK == 0) {
        newValue =
          k * (theta - yValues[i]) * dt + sigma * Math.sqrt(yValues[i]) * dW;
      } else if (paramRK == 1) {
        let val =
          k * (theta - yValues[i]) * dt + sigma * Math.sqrt(yValues[i]) * dW;
        newValue =
          k * (theta - yValues[i] * val) * dt +
          sigma * Math.sqrt(yValues[i]) * dW;
      }
      yValues.push(yValues[i] + newValue);
      newValue = 0;
    }
    addLine(xValues, yValues);
    yValues = [R0];
  }
}

function BlackKarasinski(paramRK) {
  rea = parseInt(document.getElementById("BKinstances").value);
  const numSteps = parseInt(document.getElementById("bkNumSteps").value);
  const xValues = Array.from({ length: numSteps }, (_, i) => i);
  if (paramRK == 0) {
    initializeGraph("Black-Karasinski");
    it_iscv.style.display = "block";
  } else if (paramRK == 1) {
    initializeGraph2("Black-Karasinski");
    it_ifcv.style.display = "block";
  }
  const theta1 = parseFloat(document.getElementById("BKTheta1").value);
  const theta2 = parseFloat(document.getElementById("BKTheta2").value);
  const a = parseFloat(document.getElementById("BKA").value);
  const sigma = parseFloat(document.getElementById("BKSigma").value);
  const R0 = parseFloat(document.getElementById("BKR0").value);
  const dt = parseFloat(document.getElementById("BKDt").value);
  let yValues = [R0];
  let newValue = 0;
  for (let j = 0; j < rea; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW = Math.sqrt(dt) * normalDistribution();
      if (paramRK == 0) {
        newValue =
          (theta1 + theta2 * i - a * Math.log(yValues[i])) * dt +
          sigma * Math.sqrt(yValues[i]) * dW;
      } else if (paramRK == 1) {
        let val =
          (theta1 + theta2 * i - a * Math.log(yValues[i])) * dt +
          sigma * Math.sqrt(yValues[i]) * dW;
        newValue =
          (theta1 + theta2 * i - a * Math.log(yValues[i])) * val * dt +
          sigma * Math.sqrt(yValues[i]) * dW;
      }
      yValues.push(yValues[i] + newValue);
      newValue = 0;
    }
    addLine(xValues, yValues);
    yValues = [R0];
  }
}

function Chen(paramRK) {
  rea = parseInt(document.getElementById("Cinstances").value);
  let numSteps = parseInt(document.getElementById("cNumSteps").value);
  const xValues = Array.from({ length: numSteps }, (_, i) => i);
  if (paramRK == 0) {
    initializeGraph("Chen");
    it_iscv.style.display = "block";
  } else if (paramRK == 1) {
    initializeGraph2("Chen");
    it_ifcv.style.display = "block";
  }
  const R0 = parseFloat(document.getElementById("CR0").value);
  const theta0 = parseFloat(document.getElementById("CTheta0").value);
  const sigma0 = parseFloat(document.getElementById("CSigma0").value);
  const a = parseFloat(document.getElementById("CA").value);
  const b = parseFloat(document.getElementById("CB").value);
  const m = parseFloat(document.getElementById("Chen").value);
  const mu = parseFloat(document.getElementById("CMu").value);
  const v = parseFloat(document.getElementById("CV").value);
  const g = parseFloat(document.getElementById("CG").value);
  const dt = parseFloat(document.getElementById("CDt").value);
  const k = parseFloat(document.getElementById("CK").value);
  let yValues = [R0];
  let theta_t = [theta0];
  let sigma_t = [sigma0];
  let r_t = 0;
  for (let j = 0; j < rea; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW1 = Math.sqrt(dt) * normalDistribution();
      sigma_t.push(
        mu * (b - sigma_t[i]) * dt +
          m * Math.sqrt(sigma_t[i]) * dW1 +
          sigma_t[i]
      );
      const dW2 = Math.sqrt(dt) * normalDistribution();
      theta_t.push(
        theta_t[i] +
          (v * (g - theta_t[i]) * dt + a * Math.sqrt(theta_t[i]) * dW2)
      );
      const dW3 = Math.sqrt(dt) * normalDistribution();
      if (paramRK == 0) {
        r_t =
          k * (theta_t[i] - yValues[i]) * dt +
          Math.sqrt(yValues[i]) * Math.sqrt(sigma_t[i]) * dW3;
      } else if (paramRK == 1) {
        let val =
          k * (theta_t[i] - yValues[i]) * dt +
          Math.sqrt(yValues[i]) * Math.sqrt(sigma_t[i]) * dW3;
        r_t =
          val * k * (theta_t[i] - yValues[i]) * dt +
          Math.sqrt(yValues[i]) * Math.sqrt(sigma_t[i]) * dW3;
      }
      yValues.push(yValues[i] + r_t);
    }
    addLine(xValues, yValues);
    yValues = [R0];
    theta_t = [theta0];
    sigma_t = [sigma0];
    r_t = 0;
  }
}

function stochasticEulerMethod() {
  rea = parseInt(document.getElementById("SDEinstances").value);
  const numSteps = parseInt(document.getElementById("SDENumSteps").value);
  const a = parseFloat(document.getElementById("SDEB").value);
  const b = parseFloat(document.getElementById("SDEB").value);
  const X0 = parseFloat(document.getElementById("SDEX0").value);
  const sigma = parseFloat(document.getElementById("SDESigma").value);
  const dt = parseFloat(document.getElementById("SDEDt").value);
  const xValues = Array.from({ length: numSteps }, (_, i) => i);
  let yValues = [X0];
  initializeGraph("Euler general method");
  it_iscv.style.display = "block";
  for (let j = 0; j < rea; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW = Math.sqrt(dt) * normalDistribution();
      const k = a * (b - yValues[i]) * dt + sigma * dW;
      yValues.push(yValues[i] + k);
    }
    
    addLine(xValues, yValues);
    yValues = [X0];
  }
}

function stochasticRungeKuttaMethod() {
  rea = parseInt(document.getElementById("SDEinstances").value);
  const numSteps = parseInt(document.getElementById("SDENumSteps").value);
  const a = parseFloat(document.getElementById("SDEB").value);
  const b = parseFloat(document.getElementById("SDEB").value);
  const X0 = parseFloat(document.getElementById("SDEX0").value);
  const sigma = parseFloat(document.getElementById("SDESigma").value);
  const dt = parseFloat(document.getElementById("SDEDt").value);
  let X = [X0];
  initializeGraph2("Runge kutta general method");
  it_ifcv.style.display = "block";
  const xValues = Array.from({ length: numSteps }, (_, i) => i);
  for (let j = 0; j < rea; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW1 = Math.sqrt(dt) * normalDistribution();
      const k1 = a * (b - X[i]) * dt + sigma * dW1;
      const dW2 = Math.sqrt(dt) * normalDistribution();
      const k2 = a * (b - (X[i] + 0.5 * k1)) * dt + sigma * dW2;

      const increment = k2;
      X.push(X[i] + increment);
    }
    addLine(xValues, X);
    X = [X0];
  }
}

function normalDistribution() {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function initializeGraph2(labelGraph) {
  ctx2.clearRect(0, 0, SCIV.width, SCIV.height);

  const myChart2 = new Chart(SCIV, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: labelGraph,
          data: [],
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      responsive: true,
      title: {
        display: true,
        text: "Runge kutta method",
      },
      elements: {
        line: {
          tension: 0.1,
        },
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
  what_shu.push(myChart2);
}

function addLine(xValues, yValues) {
  const color = getRandomRGBAColor();
  let newDataset = {
    fill: false,
    lineTension: 0,
    backgroundColor: color,
    borderColor: color,
    data: yValues,
  };
  what_shu[what_shu.length - 1].data.datasets.push(newDataset);
  what_shu[what_shu.length - 1].data.labels = xValues;
  what_shu[what_shu.length - 1].update();
}

function Heston(paramRK) {
  rea = parseInt(document.getElementById("Hinstances").value);
  let numSteps = parseInt(document.getElementById("hNumSteps").value);
  const xValues = Array.from({ length: numSteps }, (_, i) => i);
  if (paramRK == 0) {
    initializeGraph("Heston");
    it_iscv.style.display = "block";
  } else if (paramRK == 1) {
    initializeGraph2("Heston");
    it_ifcv.style.display = "block";
  }

  const mu = parseFloat(document.getElementById("HMu").value);
  const k = parseFloat(document.getElementById("HK").value);
  const theta = parseFloat(document.getElementById("HTheta").value);
  const sigma = parseFloat(document.getElementById("HSigma").value);
  const S0 = parseInt(document.getElementById("HS0").value);
  const v0 = parseFloat(document.getElementById("HV0").value);
  const dt = parseFloat(document.getElementById("HDt").value);
  let yValues = [S0];
  let v_t = [v0];
  let S_t = 0;
  for (let j = 0; j < rea; j++) {
    for (let i = 0; i < numSteps; i++) {
      const dW1 = Math.sqrt(dt) * normalDistribution();
      v_t.push(
        k * (theta - v_t[i]) * dt + sigma * Math.sqrt(v_t[i]) * dW1 + v_t[i]
      );
      const dW2 = Math.sqrt(dt) * normalDistribution();
      if (paramRK == 0) {
        S_t = mu * yValues[i] * dt + Math.sqrt(v_t[i]) * yValues[i] * dW2;
      } else if (paramRK == 1) {
        let val = (S_t =
          mu * yValues[i] * dt + Math.sqrt(v_t[i]) * yValues[i] * dW2);
        S_t = mu * yValues[i] * dt * val + Math.sqrt(v_t[i]) * yValues[i] * dW2;
      }
      yValues.push(yValues[i] + S_t);
    }
    addLine(xValues, yValues);
    yValues = [S0];
    v_t = [v0];
    S_t = 0;
  }
}