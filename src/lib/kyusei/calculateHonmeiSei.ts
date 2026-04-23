export function calculateHonmeiSei(birthDate: Date): number {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();

  const effectiveYear =
    month < 2 || (month === 2 && day < 4)
      ? year - 1
      : year;

  let sum = String(effectiveYear).split('').reduce((a, d) => a + Number(d), 0);
  while (sum >= 10) {
    sum = Math.floor(sum / 10) + (sum % 10);
  }
  let star = 11 - sum;
  if (star > 9) star -= 9;
  if (star <= 0) star += 9;
  return star;
}
