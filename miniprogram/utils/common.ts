export function getFormattedBirthday(age: number) {
  const currentDate = new Date();

  const year = String(currentDate.getFullYear() - age);
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11, so we add 1
  const day = String(currentDate.getDate()).padStart(2, '0');

  // Format as yyyy-mm-dd
  console.log(`Formatted birthday is ${year}-${month}-${day}`)
  return `${year}-${month}-${day}`;
}

export function getCurrentDateFormatted(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}