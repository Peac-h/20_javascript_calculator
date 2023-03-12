"use strict";

// DOM Selectors
const display = document.getElementById("display");
const numbers = document.querySelectorAll("[data-number]");
const operators = document.querySelectorAll("[data-operator]");
const equal = document.getElementById("equal");
const clear = document.getElementById("clear");
const plusMinus = document.getElementById("plusMinus");
const percent = document.getElementById("percent");

// Code Variables
let currentNumber = 0,
  previousNumber = 0,
  resultNumber,
  operatorSign,
  dot = false;

// Initializing
display.innerText = 0;

//// Event Listeners ////

// Numbers Click Handler
numbers.forEach((number) =>
  number.addEventListener("click", function () {
    // getting numbers
    const enteredNumber = this.getAttribute("data-number");

    numberValidation(enteredNumber);

    clear.innerText = "C";
  })
);

// Operators Click Handler
operators.forEach((operator) =>
  operator.addEventListener("click", function (e) {
    // getting operators
    const enteredOperator = this.getAttribute("data-operator");

    operatorValidation(enteredOperator);
  })
);

// Equal Sign Click Handler
equal.addEventListener("click", function () {
  // making sure there's all 3 operands of equation
  if (!previousNumber || !currentNumber || !operatorSign) return;

  calculate();
});

// Clear Button Click Handler
clear.addEventListener("click", function () {
  clear.innerText = "AC";
  // to clear only the last operand, not entire equation
  if (previousNumber && currentNumber) {
    currentNumber = 0;
    document.querySelector(`[data-operator='${operatorSign}']`).focus();
    display.innerText = currentNumber;
  } // clear entirely
  else {
    restart();
    primaryFont();
    display.style.letterSpacing = "-3px";
    display.innerText = 0;
  }
});

// -/+ Button
plusMinus.addEventListener("click", function () {
  // making a positive number negative and vice versa
  if (Math.sign(currentNumber) === 1) {
    currentNumber = -Math.abs(currentNumber);
  } else if (Math.sign(currentNumber) === -1) {
    currentNumber = Math.abs(currentNumber);
  }
  // displaying
  display.innerText = new Intl.NumberFormat(navigator.language).format(
    currentNumber
  );
});

// Percent Button
percent.addEventListener("click", function () {
  // calculating
  currentNumber /= 100;
  // displaying
  display.innerText = new Intl.NumberFormat(navigator.language).format(
    currentNumber
  );
});

// Keyboard Handler
document.addEventListener("keydown", function (e) {
  // number key implementation
  const validNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
  let pressedKey = "";

  if (validNumbers.includes(e.key)) {
    pressedKey = e.key;

    numberValidation(pressedKey);
  }

  // operator key impelementation
  const validOperators = ["+", "-", "*", "/", "="];
  let pressedOperator = "";

  if (validOperators.includes(e.key)) {
    pressedOperator = e.key;

    operatorValidation(pressedOperator);
  }

  // percent key implementation
  if (e.key === "%") {
    // calculating
    currentNumber /= 100;
    // displaying
    display.innerText = new Intl.NumberFormat(navigator.language).format(
      currentNumber
    );
  }

  // delete key implementation
  if (e.key === "Backspace") {
    restart();
    primaryFont();
    display.innerText = 0;
  }

  // enter key (=) implementation
  if (e.key === "Enter") {
    if (!previousNumber || !currentNumber || !operatorSign) return;

    calculate();
  }
});

//// Functions ////

// Calculation Function
function calculate() {
  // converting numbers to number types
  previousNumber = parseFloat(previousNumber);
  currentNumber = parseFloat(currentNumber);

  // making calculation
  if (operatorSign === "+") resultNumber = previousNumber + currentNumber;
  if (operatorSign === "-") resultNumber = previousNumber - currentNumber;
  if (operatorSign === "*") resultNumber = previousNumber * currentNumber;
  if (operatorSign === "/") resultNumber = previousNumber / currentNumber;

  // check the result
  if (
    typeof resultNumber === "number" &&
    resultNumber !== Infinity &&
    resultNumber <= Number.MAX_SAFE_INTEGER &&
    isFinite(resultNumber)
  ) {
    // adjust font
    const fontNum = new Intl.NumberFormat(navigator.language, {
      maximumFractionDigits: 4,
    }).format(resultNumber);
    const fontNums = fontNum.replaceAll(",", "");

    if (String(fontNums).length > 6) {
      adaptFont(fontNums);
    } else {
      primaryFont();
    }
    // display the result
    display.innerText = new Intl.NumberFormat(navigator.language, {
      maximumFractionDigits: 4,
    }).format(resultNumber);
    // & reassign variables
    previousNumber = 0;
    currentNumber = resultNumber;
    dot = false;
  } // if previous conditions failed, display error for user
  else {
    if (resultNumber === Infinity) {
      if (Math.random() > 0.5) {
        display.innerText = `Can't trick me`;
      } else {
        display.innerText = `Stop it!`;
      }
    } else if (resultNumber > Number.MAX_SAFE_INTEGER) {
      if (Math.random() > 0.5) {
        display.innerText = `Can't break me`;
      } else {
        display.innerText = `Can we just talk?`;
      }
    } else {
      // for example, NaN goes here (try 0. / 0)
      display.innerText = `That's an error, my love`;
    }
    // a little text display styling
    adaptFont(`Take the size of it`);
    display.style.letterSpacing = 0;

    // restart variables
    restart();
  }
}

// Numbers Handling Function
function numberValidation(number) {
  // making sure that '.' won't be used twice in a number
  if (number === "." && !dot) dot = true;
  else if (number === "." && dot) return;

  // using number formatter
  const formatNumber = new Intl.NumberFormat(navigator.language, {
    maximumFractionDigits: 8,
  });

  // defining current operand & implementing '0'-s and '.'-s display standards
  if (resultNumber) {
    if (number === ".") {
      currentNumber = "0.";
    } else {
      currentNumber = number;
    }
    resultNumber = "";
    display.innerText = currentNumber;
  } else {
    if (currentNumber > Number.MAX_SAFE_INTEGER) return;
    if (currentNumber === 0 && number === "0") return;
    if (currentNumber.length > 16) return;

    currentNumber += number;

    if (
      currentNumber > 0 &&
      String(currentNumber)[0] === "0" &&
      String(currentNumber)[1] !== "."
    )
      currentNumber = String(currentNumber).slice(1);

    if (number === ".") {
      if (currentNumber === ".") currentNumber = "0.";
      display.innerText = formatNumber.format(currentNumber) + ".";
    } else if (String(currentNumber).includes(".") && number === "0") {
      display.innerText = currentNumber;
    } else {
      display.innerText = formatNumber.format(currentNumber);
    }
  }

  // adjust font
  display.style.letterSpacing = "-3px";
  if (String(currentNumber).length > 6) {
    adaptFont(currentNumber);
  } else {
    primaryFont();
  }
}

// Operators Handling Function
function operatorValidation(operator) {
  // defining current operator
  const enteredOperator = operator;
  // doing calculation if there already is all 3 operands of equation
  if (currentNumber && previousNumber && operatorSign) calculate();
  // or moving on and reassigning variables
  if (currentNumber) {
    previousNumber = currentNumber;
    currentNumber = "";
  }
  operatorSign = enteredOperator;

  // allowing using '.' again
  dot = false;
}

//// Additionals ////

// Restart Function
function restart() {
  currentNumber = 0;
  previousNumber = 0;
  resultNumber;
  operatorSign;
  dot = false;
}

// to remove focus from buttons after click
document.querySelectorAll(".btn").forEach((button) => {
  if (!button.classList.contains("operator")) {
    button.addEventListener("click", function () {
      this.blur();
    });
  }
});

// primary font
function primaryFont() {
  display.style.fontSize = "7rem";
  display.style.justifyContent = "flex-end";
}

// font controller
function adaptFont(object) {
  display.style.fontSize = `${(259 / String(object).length + 1) * 1.6}px`;
  display.style.justifyContent = "center";
}

// mode switch
// light mode
const enableLightMode = function () {
  document.body.classList.add("light-mode");
  localStorage.setItem("light-mode", "enabled");
};
// dark mode
const disableLightMode = function () {
  document.body.classList.remove("light-mode");
  localStorage.setItem("light-mode", null);
};

// toggle button
const lightModeToggle = document.getElementById("mode");

// information from localStorage
let lightMode = localStorage.getItem("light-mode");

// applying the localStorage mode
if (lightMode === "enabled") {
  enableLightMode();
  mode.checked = true;
}

// listen to the toggler click event
lightModeToggle.addEventListener("click", function () {
  lightMode = localStorage.getItem("light-mode");

  if (lightMode !== "enabled") return enableLightMode();

  return disableLightMode();
});
