const CHESTER_BIRTHDAY = new Date("2023-03-07T00:00:00");
const CHESTER_HUMAN_AGE_TABLE = [
  { dog: 1, human: 15 }, { dog: 2, human: 24 }, { dog: 3, human: 28 },
  { dog: 4, human: 32 }, { dog: 5, human: 37 }, { dog: 6, human: 42 },
  { dog: 7, human: 47 }, { dog: 8, human: 51 }, { dog: 9, human: 56 },
  { dog: 10, human: 60 }, { dog: 12, human: 69 }
];

function calculateAgeParts(birthday, today) {
  let years = today.getFullYear() - birthday.getFullYear();
  let months = today.getMonth() - birthday.getMonth();
  let days = today.getDate() - birthday.getDate();
  if (days < 0) {
    months--;
    const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += previousMonth.getDate();
  }
  if (months < 0) { years--; months += 12; }
  return { years, months, days };
}

function calculateDecimalYears(birthday, today) {
  const millisecondsPerYear = 365.25 * 24 * 60 * 60 * 1000;
  return (today - birthday) / millisecondsPerYear;
}

function calculateHumanYears(dogYears) {
  const table = CHESTER_HUMAN_AGE_TABLE;
  for (let i = 0; i < table.length - 1; i++) {
    const current = table[i];
    const next = table[i + 1];
    if (dogYears >= current.dog && dogYears <= next.dog) {
      const progress = (dogYears - current.dog) / (next.dog - current.dog);
      return current.human + progress * (next.human - current.human);
    }
  }
  return table[table.length - 1].human;
}

function updateChesterAge() {
  const today = new Date();
  const ageParts = calculateAgeParts(CHESTER_BIRTHDAY, today);
  const dogYears = calculateDecimalYears(CHESTER_BIRTHDAY, today);
  const humanYears = calculateHumanYears(dogYears);
  document.getElementById("chesterAge").textContent = `${ageParts.years} Years, ${ageParts.months} Months, ${ageParts.days} Days`;
  document.getElementById("chesterHumanAge").textContent = `${humanYears.toFixed(1)} Human Years`;
}

updateChesterAge();
setInterval(updateChesterAge, 60 * 60 * 1000);
