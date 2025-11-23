console.log("=== Mini Calculatrice ===");

function main() {
  const a = 5;
  const b = 3;

  console.log("Addition :", add(a, b));
  console.log("Soustraction :", subtract(a, b));
  console.log("Multiplication :", multiply(a, b));
  console.log("Division :", divide(a, b));
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) throw new Error("Division par zéro interdite !");
  return a / b;
}

main();