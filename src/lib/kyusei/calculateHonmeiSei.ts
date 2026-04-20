export function calculateHonmeiSei(birthDate: Date): number {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();

  const effectiveYear =
    month < 2 || (month === 2 && day < 4)
      ? year - 1
      : year;

  const last2 = effectiveYear % 100;
  let sum = Math.floor(last2 / 10) + (last2 % 10);
  while (sum >= 10) {
    sum = Math.floor(sum / 10) + (sum % 10);
  }
  let star = 11 - sum;
  if (star <= 0) star += 9;
  return star;
}
