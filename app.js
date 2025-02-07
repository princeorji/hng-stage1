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
  const absN = Math.abs(n);
  const digits = String(absN).split("");
  const power = digits.length;
  const total = digits.reduce(
    (acc, digit) => acc + Math.pow(Number(digit), power),
    0
  );
  return total === absN;
}

function digitSum(n) {
  return String(Math.abs(n))
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
}

app.get("/api/classify-number", async (req, res) => {
  const { number } = req.query;

  // Validate input
  if (!number || !/^-?\d+$/.test(number)) {
    console.error("Invalid input:", number);
    return res.status(400).json({
      number: number || "",
      error: true,
      message: "Invalid number format",
    });
  }

  const num = parseInt(number, 10);

  let properties = [];
  if (isArmstrong(num)) properties.push("armstrong");
  properties.push(num % 2 === 0 ? "even" : "odd");

  let funFact = "Not available";
  try {
    const response = await fetch(`http://numbersapi.com/${num}/math?json`, {
      timeout: 5000,
    });
    if (response.ok) {
      const data = await response.json();
      funFact = data.text || "Fun fact not available.";
    }
  } catch (error) {
    console.error(`Error fetching fun fact for ${num}: ${error.message}`);
  }

  res.status(200).json({
    number: num,
    is_prime: isPrime(num),
    is_perfect: isPerfect(num),
    properties,
    digit_sum: digitSum(num),
    fun_fact: funFact,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
