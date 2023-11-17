export async function getAllCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");

    const data = await response.json();

    return { data };
  } catch (error) {
    console.log(error);
  }
}
