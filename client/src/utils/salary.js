export const normalizeSalaryInput = (salaryValue) => {
  const numericSalary = Number(salaryValue);

  if (!Number.isFinite(numericSalary) || numericSalary <= 0) {
    return "";
  }

  // Treat small values as LPA entered by recruiters, e.g. 12 => 12 LPA.
  if (numericSalary < 1000) {
    return String(Math.round(numericSalary * 100000));
  }

  return String(Math.round(numericSalary));
};

export const formatSalaryDisplay = (salaryValue) => {
  const numericSalary = Number(salaryValue);

  if (!Number.isFinite(numericSalary) || numericSalary <= 0) {
    return "Not disclosed";
  }

  if (numericSalary < 1000) {
    return `${numericSalary} LPA`;
  }

  const salaryInLpa = numericSalary / 100000;
  const formattedSalary = Number.isInteger(salaryInLpa)
    ? salaryInLpa.toFixed(0)
    : salaryInLpa.toFixed(1);

  return `${formattedSalary} LPA`;
};
