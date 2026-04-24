// async function search() {
//     const from = document.getElementById("from").value;
//     const to = document.getElementById("to").value;
//     const date = document.getElementById("date").value;
//     //const passengers = document.getElementById("passengers").value;

//     // const res = await fetch(
//     //     `/api/flights?from=${from}&to=${to}&date=${date}&passengers=${passengers}`
//     // );

//     const res = await fetch(
//         `/api/flights?from=${from}&to=${to}&date=${date}`
//     );

//     const data = await res.json();

//     document.getElementById("result").textContent = JSON.stringify(data, null, 2);
// }


const form = document.getElementById("flightForm");
const results = document.getElementById("results");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const date = document.getElementById("date").value;

    const res = await fetch(
        `/api/flights?from=${from}&to=${to}&date=${date}&passengers=1`
    );

    const data = await res.json();

    results.innerHTML = data.data
    .map(
        (f) => `
        <div>
        <h3>$(f.airline)</h3>
        <p>N${f.priceNGN}</p></div>
        `
    )
    .join("");
});