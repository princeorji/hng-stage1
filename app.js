const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

function isPrime(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function isPerfect(n) {
  if (n <= 0) return false;
  let sum = 1; 
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      sum += i;
      if (i !== n / i) {
        sum += n / i;
      }
    }
  }
  return sum === n && n !== 1;
}

function isArmstrong(n) {
  if (n < 0) return false;
  const digits = String(n).split("");
  const power = digits.length;
  const total = digits.reduce(
    (acc, digit) => acc + Math.pow(Number(digit), power),
    0
  );
  return total === n;
}

function digitSum(n) {
  return String(Math.abs(n))
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
}

app.get("api/classify-number", async (req, res) => {
  const numStr = req.query.number;
  const number = parseInt(numStr, 10);

  if (isNaN(number)) {
    return res.status(400).json({ number: numStr, error: true });
  }

  const prime = isPrime(number);
  const perfect = isPerfect(number);
  const armstrong = isArmstrong(number);
  const sumDigits = digitSum(number);

  
  let properties = [];
  if (armstrong) {
    properties.push("armstrong", number % 2 === 0 ? "even" : "odd");
  } else {
    properties.push(number % 2 === 0 ? "even" : "odd");
  }

  let fun_fact = "";
  try {
    const response = await fetch(`http://numbersapi.com/${number}/math?json`, {
      timeout: 5000,
    });
    if (response.ok) {
      const data = await response.json();
      fun_fact = data.text || "Fun fact not available.";
    } else {
      fun_fact = "Fun fact not available.";
    }
  } catch (error) {
    fun_fact = "Fun fact not available.";
  }

  res.json({
    number,
    is_prime: prime,
    is_perfect: perfect,
    properties,
    digit_sum: sumDigits,
    fun_fact,
  });
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
